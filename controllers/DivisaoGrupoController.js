const DivisaoGrupoService = require('../services/DivisaoGrupoService');

class DivisaoGrupoController {
    constructor() {
        this.divisaoGrupoService = new DivisaoGrupoService();
    }

    async createGrupo(req, res) {
        try {
            const { carteiraId } = req.params;
            const grupo = await this.divisaoGrupoService.createGrupo(carteiraId, req.body);
            return res.status(201).json({ success: true, grupo });
        } catch (error) {
            return res.status(400).json({ success: false, error: error.message || 'Erro ao criar grupo' });
        }
    }

    async getGruposPorCarteira(req, res) {
        try {
            const { carteiraId } = req.params;
            const grupos = await this.divisaoGrupoService.getGruposPorCarteira(carteiraId);
            return res.status(200).json({ success: true, total: grupos.length, grupos });
        } catch (error) {
            return res.status(400).json({ success: false, error: error.message || 'Erro ao listar grupos' });
        }
    }

    async vincularLancamento(req, res) {
        try {
            const { grupoId, lancamentoId } = req.params;
            const lancamento = await this.divisaoGrupoService.vincularLancamentoAGrupo(lancamentoId, grupoId);
            return res.status(200).json({ success: true, lancamento });
        } catch (error) {
            return res.status(400).json({ success: false, error: error.message || 'Erro ao vincular lançamento' });
        }
    }

    async desvincularLancamento(req, res) {
        try {
            const { lancamentoId } = req.params;
            const lancamento = await this.divisaoGrupoService.desvincularLancamentoDGrupo(lancamentoId);
            return res.status(200).json({ success: true, lancamento });
        } catch (error) {
            return res.status(400).json({ success: false, error: error.message || 'Erro ao desvincular lançamento' });
        }
    }
}

module.exports = DivisaoGrupoController;
