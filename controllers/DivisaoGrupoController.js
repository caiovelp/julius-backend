const DivisaoGrupoService = require('../services/DivisaoGrupoService');

class DivisaoGrupoController {
    constructor() {
        this.divisaoGrupoService = new DivisaoGrupoService();
    }

    /**
     * Criar novo grupo de divisão
     * POST /divisao-grupos/:carteiraId
     */
    async createGrupo(req, res) {
        try {
            const { carteiraId } = req.params;
            const grupo = await this.divisaoGrupoService.createGrupo(carteiraId, req.body);

            return res.status(201).json({
                success: true,
                message: 'Grupo de divisão criado com sucesso',
                grupo,
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                error: error.message || 'Erro ao criar grupo',
            });
        }
    }

    /**
     * Obter grupo por ID
     * GET /divisao-grupos/:grupoId
     */
    async getGrupoById(req, res) {
        try {
            const { grupoId } = req.params;
            const grupo = await this.divisaoGrupoService.getGrupoById(grupoId);

            if (!grupo) {
                return res.status(404).json({
                    success: false,
                    error: 'Grupo não encontrado',
                });
            }

            return res.status(200).json({
                success: true,
                grupo,
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                error: error.message || 'Erro ao obter grupo',
            });
        }
    }

    /**
     * Listar grupos de uma carteira
     * GET /divisao-grupos/carteira/:carteiraId
     */
    async getGruposPorCarteira(req, res) {
        try {
            const { carteiraId } = req.params;
            const grupos = await this.divisaoGrupoService.getGruposPorCarteira(carteiraId);

            return res.status(200).json({
                success: true,
                total: grupos.length,
                grupos,
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                error: error.message || 'Erro ao listar grupos',
            });
        }
    }

    /**
     * Vincular lançamento a um grupo
     * POST /divisao-grupos/:grupoId/vincular/:lancamentoId
     */
    async vincularLancamento(req, res) {
        try {
            const { grupoId, lancamentoId } = req.params;
            const lancamento = await this.divisaoGrupoService.vincularLancamentoAGrupo(
                lancamentoId,
                grupoId
            );

            return res.status(200).json({
                success: true,
                message: 'Lançamento vinculado ao grupo com sucesso',
                lancamento,
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                error: error.message || 'Erro ao vincular lançamento',
            });
        }
    }

    /**
     * Desvincular lançamento de um grupo
     * DELETE /divisao-grupos/desvincular/:lancamentoId
     */
    async desvincularLancamento(req, res) {
        try {
            const { lancamentoId } = req.params;
            const lancamento = await this.divisaoGrupoService.desvincularLancamentoDGrupo(lancamentoId);

            return res.status(200).json({
                success: true,
                message: 'Lançamento desvinculado do grupo com sucesso',
                lancamento,
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                error: error.message || 'Erro ao desvincular lançamento',
            });
        }
    }

    /**
     * Deletar grupo
     * DELETE /divisao-grupos/:grupoId
     */
    async deleteGrupo(req, res) {
        try {
            const { grupoId } = req.params;
            await this.divisaoGrupoService.deleteGrupo(grupoId);

            return res.status(200).json({
                success: true,
                message: 'Grupo de divisão deletado com sucesso',
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                error: error.message || 'Erro ao deletar grupo',
            });
        }
    }

    /**
     * Obter lançamentos de um grupo
     * GET /divisao-grupos/:grupoId/lancamentos
     */
    async getLancamentosDoGrupo(req, res) {
        try {
            const { grupoId } = req.params;
            const lancamentos = await this.divisaoGrupoService.getLancamentosDoGrupo(grupoId);

            return res.status(200).json({
                success: true,
                total: lancamentos.length,
                lancamentos,
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                error: error.message || 'Erro ao listar lançamentos do grupo',
            });
        }
    }
}

module.exports = DivisaoGrupoController;
