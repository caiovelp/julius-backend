const { Lancamento, Categoria, DivisaoGrupo } = require('../models/Associations');
const { Op, sequelize, fn, col } = require('sequelize');

class LancamentoService {
    constructor() {}

    /**
     * Criar novo lançamento
     * @param {Object} lancamentoData - { carteiraId, categoriaId, data, tag, parcela, observacao, nomeNaFatura, cartao, valor, conferido, divisaoValorOriginal, divisaoGrupoId }
     */
    async createLancamento(lancamentoData) {
        const {
            carteiraId,
            categoriaId,
            data,
            tag,
            parcela,
            observacao,
            nomeNaFatura,
            cartao,
            valor,
            conferido = false,
            divisaoValorOriginal,
            divisaoGrupoId,
        } = lancamentoData;

        // Validações básicas
        if (!carteiraId || !data || valor === undefined || valor === null) {
            throw new Error('Campos obrigatórios faltando: carteiraId, data, valor');
        }

        if (!categoriaId) {
            throw new Error('categoriaId é obrigatório');
        }

        if (valor === 0) {
            throw new Error('Valor não pode ser zero');
        }

        // Validar formato de parcela se informado
        if (parcela && !this._isValidParcelaFormat(parcela)) {
            throw new Error('Formato de parcela inválido. Use formato n/x (ex: 1/3)');
        }

        return await Lancamento.create({
            carteiraId,
            categoriaId,
            data,
            tag: tag || null,
            parcela: parcela || null,
            observacao: observacao || null,
            nomeNaFatura: nomeNaFatura || null,
            cartao: cartao || null,
            valor: parseFloat(valor),
            conferido,
            divisaoValorOriginal: divisaoValorOriginal ? parseFloat(divisaoValorOriginal) : null,
            divisaoGrupoId: divisaoGrupoId || null,
        });
    }

    /**
     * Editar lançamento existente
     */
    async editLancamento(lancamentoId, lancamentoData) {
        const lancamento = await Lancamento.findByPk(lancamentoId);
        if (!lancamento) {
            throw new Error('Lançamento não encontrado');
        }

        const {
            data,
            tag,
            parcela,
            observacao,
            nomeNaFatura,
            cartao,
            valor,
            categoriaId,
            conferido,
            divisaoValorOriginal,
            divisaoGrupoId,
        } = lancamentoData;

        // Validações
        if (valor !== undefined && valor === 0) {
            throw new Error('Valor não pode ser zero');
        }

        if (parcela && !this._isValidParcelaFormat(parcela)) {
            throw new Error('Formato de parcela inválido. Use formato n/x (ex: 1/3)');
        }

        const updateData = {};
        if (data !== undefined) updateData.data = data;
        if (tag !== undefined) updateData.tag = tag;
        if (parcela !== undefined) updateData.parcela = parcela;
        if (observacao !== undefined) updateData.observacao = observacao;
        if (nomeNaFatura !== undefined) updateData.nomeNaFatura = nomeNaFatura;
        if (cartao !== undefined) updateData.cartao = cartao;
        if (valor !== undefined) updateData.valor = parseFloat(valor);
        if (categoriaId !== undefined) updateData.categoriaId = categoriaId;
        if (conferido !== undefined) updateData.conferido = conferido;
        if (divisaoValorOriginal !== undefined) updateData.divisaoValorOriginal = divisaoValorOriginal ? parseFloat(divisaoValorOriginal) : null;
        if (divisaoGrupoId !== undefined) updateData.divisaoGrupoId = divisaoGrupoId || null;

        return await lancamento.update(updateData);
    }

    /**
     * Deletar lançamento por ID
     */
    async deleteLancamento(lancamentoId) {
        const lancamento = await Lancamento.findByPk(lancamentoId);
        if (!lancamento) {
            throw new Error('Lançamento não encontrado');
        }
        return await lancamento.destroy();
    }

    /**
     * Listar lançamentos por mês com filtros
     * @param {UUID} carteiraId
     * @param {string} month - formato YYYY-MM (ex: 2026-04)
     * @param {Object} filters - { tag, cartao, categoria, conferido, search }
     */
    async getLancamentosPorMes(carteiraId, month, filters = {}) {
        // Parse month
        const [year, monthNum] = month.split('-').map(Number);
        if (!year || !monthNum || monthNum < 1 || monthNum > 12) {
            throw new Error('Formato de mês inválido. Use YYYY-MM (ex: 2026-04)');
        }

        const startDate = new Date(year, monthNum - 1, 1);
        const endDate = new Date(year, monthNum, 0, 23, 59, 59);

        const whereClause = {
            carteiraId,
            data: {
                [Op.between]: [startDate, endDate],
            },
        };

        // Aplicar filtros
        if (filters.tag) {
            whereClause.tag = filters.tag;
        }
        if (filters.cartao) {
            whereClause.cartao = filters.cartao;
        }
        if (filters.conferido !== undefined) {
            whereClause.conferido = filters.conferido;
        }
        if (filters.categoria) {
            whereClause.categoriaId = filters.categoria;
        }
        // Busca textual em observação e nomeNaFatura
        if (filters.search) {
            whereClause[Op.or] = [
                { observacao: { [Op.iLike]: `%${filters.search}%` } },
                { nomeNaFatura: { [Op.iLike]: `%${filters.search}%` } },
            ];
        }

        return await Lancamento.findAll({
            where: whereClause,
            include: [
                {
                    model: Categoria,
                    as: 'Categoria',
                    attributes: ['id', 'nome'],
                },
                {
                    model: DivisaoGrupo,
                    attributes: ['id', 'valorOriginal', 'descricao'],
                },
            ],
            order: [['data', 'ASC']],
        });
    }

    /**
     * Obter agregações mensais para topo da tela
     * Retorna: saldoDisponivel, totaisPorCartao, totaisPorTag, totaisPorCategoria
     */
    async getAgregacoesMensais(carteiraId, month, orcamentoMensal) {
        const lancamentos = await this.getLancamentosPorMes(carteiraId, month);

        const totalMes = lancamentos.reduce((sum, l) => sum + parseFloat(l.valor), 0);
        const saldoDisponivel = orcamentoMensal - totalMes;

        // Totais por cartão
        const totaisPorCartao = {};
        lancamentos.forEach((l) => {
            const cartao = l.cartao || 'Sem cartão';
            totaisPorCartao[cartao] = (totaisPorCartao[cartao] || 0) + parseFloat(l.valor);
        });

        // Totais por tag
        const totaisPorTag = {};
        lancamentos.forEach((l) => {
            const tag = l.tag || 'Sem tag';
            totaisPorTag[tag] = (totaisPorTag[tag] || 0) + parseFloat(l.valor);
        });

        // Totais por categoria (exclusão de Terceiros)
        const totaisPorCategoria = {};
        lancamentos.forEach((l) => {
            // Só incluir se categoria não for "Terceiros"
            if (l.Categoria && l.Categoria.nome !== 'Terceiros') {
                const cat = l.Categoria.nome || 'Sem categoria';
                totaisPorCategoria[cat] = (totaisPorCategoria[cat] || 0) + parseFloat(l.valor);
            }
        });

        return {
            mes: month,
            orcamentoMensal,
            totalMes,
            saldoDisponivel,
            totaisPorCartao,
            totaisPorTag,
            totaisPorCategoria,
        };
    }

    /**
     * Validar formato de parcela (n/x)
     */
    _isValidParcelaFormat(parcela) {
        const regex = /^\d+\/(\d+|x)$/i;
        return regex.test(parcela);
    }

    /**
     * Buscar lançamento por ID
     */
    async getLancamentoById(lancamentoId) {
        return await Lancamento.findByPk(lancamentoId, {
            include: [
                {
                    model: Categoria,
                    as: 'Categoria',
                },
                {
                    model: DivisaoGrupo,
                },
            ],
        });
    }
}

module.exports = LancamentoService;
