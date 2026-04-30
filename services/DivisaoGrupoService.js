const { DivisaoGrupo, Lancamento } = require('../models/Associations');
const { Op } = require('sequelize');

class DivisaoGrupoService {
    constructor() {}

    /**
     * Criar novo grupo de divisão
     */
    async createGrupo(carteiraId, groupData) {
        const { valorOriginal, numParcelas, descricao } = groupData;

        if (!carteiraId || !valorOriginal) {
            throw new Error('Campos obrigatórios: carteiraId, valorOriginal');
        }

        return await DivisaoGrupo.create({
            carteiraId,
            valorOriginal: parseFloat(valorOriginal),
            numParcelas: numParcelas || null,
            descricao: descricao || null,
        });
    }

    /**
     * Obter grupo por ID
     */
    async getGrupoById(grupoId) {
        return await DivisaoGrupo.findByPk(grupoId, {
            include: [
                {
                    model: Lancamento,
                    attributes: ['id', 'data', 'valor', 'tag', 'nomeNaFatura'],
                },
            ],
        });
    }

    /**
     * Listar todos os grupos de uma carteira
     */
    async getGruposPorCarteira(carteiraId) {
        return await DivisaoGrupo.findAll({
            where: { carteiraId },
            include: [
                {
                    model: Lancamento,
                    attributes: ['id', 'data', 'valor', 'tag', 'nomeNaFatura'],
                },
            ],
            order: [['createdAt', 'DESC']],
        });
    }

    /**
     * Vincular lançamento a um grupo
     */
    async vincularLancamentoAGrupo(lancamentoId, grupoId) {
        const lancamento = await Lancamento.findByPk(lancamentoId);
        if (!lancamento) {
            throw new Error('Lançamento não encontrado');
        }

        const grupo = await DivisaoGrupo.findByPk(grupoId);
        if (!grupo) {
            throw new Error('Grupo de divisão não encontrado');
        }

        return await lancamento.update({ divisaoGrupoId: grupoId });
    }

    /**
     * Desvincular lançamento de um grupo
     */
    async desvincularLancamentoDGrupo(lancamentoId) {
        const lancamento = await Lancamento.findByPk(lancamentoId);
        if (!lancamento) {
            throw new Error('Lançamento não encontrado');
        }

        return await lancamento.update({ divisaoGrupoId: null });
    }

    /**
     * Deletar grupo (sem deletar lançamentos, apenas desvincular)
     */
    async deleteGrupo(grupoId) {
        const grupo = await DivisaoGrupo.findByPk(grupoId);
        if (!grupo) {
            throw new Error('Grupo não encontrado');
        }

        // Desvincular todos os lançamentos
        await Lancamento.update(
            { divisaoGrupoId: null },
            { where: { divisaoGrupoId: grupoId } }
        );

        // Deletar grupo
        return await grupo.destroy();
    }

    /**
     * Obter todos os lançamentos de um grupo
     */
    async getLancamentosDoGrupo(grupoId) {
        return await Lancamento.findAll({
            where: { divisaoGrupoId: grupoId },
            order: [['data', 'ASC']],
        });
    }
}

module.exports = DivisaoGrupoService;
