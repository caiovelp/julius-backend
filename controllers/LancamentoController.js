const LancamentoService = require('../services/LancamentoService');

class LancamentoController {
    constructor() {
        this.lancamentoService = new LancamentoService();
    }

    async createLancamento(req, res) {
        try {
            const { carteiraId } = req.params;
            const lancamento = await this.lancamentoService.createLancamento({
                carteiraId,
                ...req.body,
            });
            return res.status(201).json({ success: true, lancamento });
        } catch (error) {
            return res.status(400).json({ success: false, error: error.message || 'Erro ao criar lançamento' });
        }
    }

    async editLancamento(req, res) {
        try {
            const { lancamentoId } = req.params;
            const lancamento = await this.lancamentoService.editLancamento(lancamentoId, req.body);
            return res.status(200).json({ success: true, lancamento });
        } catch (error) {
            return res.status(400).json({ success: false, error: error.message || 'Erro ao editar lançamento' });
        }
    }

    async deleteLancamento(req, res) {
        try {
            const { lancamentoId } = req.params;
            await this.lancamentoService.deleteLancamento(lancamentoId);
            return res.status(200).json({ success: true });
        } catch (error) {
            return res.status(400).json({ success: false, error: error.message || 'Erro ao deletar lançamento' });
        }
    }

    async getLancamentosPorMes(req, res) {
        try {
            const { carteiraId } = req.params;
            const { month, tag, cartao, categoria, conferido, search } = req.query;

            if (!month) {
                return res.status(400).json({ success: false, error: 'Parâmetro month (YYYY-MM) é obrigatório' });
            }

            const filters = {};
            if (tag) filters.tag = tag;
            if (cartao) filters.cartao = cartao;
            if (categoria) filters.categoria = categoria;
            if (conferido !== undefined) filters.conferido = conferido === 'true';
            if (search) filters.search = search;

            const lancamentos = await this.lancamentoService.getLancamentosPorMes(carteiraId, month, filters);
            return res.status(200).json({ success: true, mes: month, total: lancamentos.length, lancamentos });
        } catch (error) {
            return res.status(400).json({ success: false, error: error.message || 'Erro ao listar lançamentos' });
        }
    }
}

module.exports = LancamentoController;
