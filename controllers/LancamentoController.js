const LancamentoService = require('../services/LancamentoService');
const { Carteira } = require('../models/Associations');

class LancamentoController {
    constructor() {
        this.lancamentoService = new LancamentoService();
    }

    /**
     * Criar novo lançamento
     */
    async createLancamento(req, res) {
        try {
            const { carteiraId } = req.params;
            const lancamentoData = {
                carteiraId,
                ...req.body,
            };

            const lancamento = await this.lancamentoService.createLancamento(lancamentoData);

            return res.status(201).json({
                success: true,
                message: 'Lançamento criado com sucesso',
                lancamento,
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                error: error.message || 'Erro ao criar lançamento',
            });
        }
    }

    /**
     * Editar lançamento
     */
    async editLancamento(req, res) {
        try {
            const { lancamentoId } = req.params;
            const lancamento = await this.lancamentoService.editLancamento(lancamentoId, req.body);

            return res.status(200).json({
                success: true,
                message: 'Lançamento atualizado com sucesso',
                lancamento,
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                error: error.message || 'Erro ao editar lançamento',
            });
        }
    }

    /**
     * Deletar lançamento
     */
    async deleteLancamento(req, res) {
        try {
            const { lancamentoId } = req.params;
            await this.lancamentoService.deleteLancamento(lancamentoId);

            return res.status(200).json({
                success: true,
                message: 'Lançamento deletado com sucesso',
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                error: error.message || 'Erro ao deletar lançamento',
            });
        }
    }

    /**
     * Listar lançamentos por mês
     * Query params: month (YYYY-MM), tag, cartao, categoria, conferido (true/false), search
     */
    async getLancamentosPorMes(req, res) {
        try {
            const { carteiraId } = req.params;
            const { month, tag, cartao, categoria, conferido, search } = req.query;

            if (!month) {
                return res.status(400).json({
                    success: false,
                    error: 'Parâmetro month (YYYY-MM) é obrigatório',
                });
            }

            // Parsear filtros
            const filters = {};
            if (tag) filters.tag = tag;
            if (cartao) filters.cartao = cartao;
            if (categoria) filters.categoria = categoria;
            if (conferido !== undefined) filters.conferido = conferido === 'true';
            if (search) filters.search = search;

            const lancamentos = await this.lancamentoService.getLancamentosPorMes(carteiraId, month, filters);

            return res.status(200).json({
                success: true,
                mes: month,
                total: lancamentos.length,
                lancamentos,
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                error: error.message || 'Erro ao listar lançamentos',
            });
        }
    }

    /**
     * Obter agregações mensais (totais, saldo disponível)
     */
    async getAgregacoesMensais(req, res) {
        try {
            const { carteiraId } = req.params;
            const { month } = req.query;

            if (!month) {
                return res.status(400).json({
                    success: false,
                    error: 'Parâmetro month (YYYY-MM) é obrigatório',
                });
            }

            // Obter orçamento mensal da carteira
            const carteira = await Carteira.findByPk(carteiraId);
            if (!carteira) {
                return res.status(404).json({
                    success: false,
                    error: 'Carteira não encontrada',
                });
            }

            const agregacoes = await this.lancamentoService.getAgregacoesMensais(
                carteiraId,
                month,
                parseFloat(carteira.orcamentoMensal) || 0
            );

            return res.status(200).json({
                success: true,
                agregacoes,
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                error: error.message || 'Erro ao obter agregações',
            });
        }
    }

    /**
     * Obter lançamento por ID
     */
    async getLancamentoById(req, res) {
        try {
            const { lancamentoId } = req.params;
            const lancamento = await this.lancamentoService.getLancamentoById(lancamentoId);

            if (!lancamento) {
                return res.status(404).json({
                    success: false,
                    error: 'Lançamento não encontrado',
                });
            }

            return res.status(200).json({
                success: true,
                lancamento,
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                error: error.message || 'Erro ao obter lançamento',
            });
        }
    }
}

module.exports = LancamentoController;
