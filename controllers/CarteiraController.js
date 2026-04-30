const CarteiraService = require('../services/CarteiraService');
const { Carteira } = require('../models/Associations');

class CarteiraController {
    constructor() {
        this.carteiraService = new CarteiraService();
        this.getCarteiraByUserId = this.getCarteiraByUserId.bind(this);
        this.getCarteiras = this.getCarteiras.bind(this);
    }

    async getCarteiras(req, res) {
        try {
            const carteiras = await Carteira.findAll();
            res.status(200).json(carteiras);
        } catch (e) {
            res.status(500).json({ error: 'Erro ao recuperar carteiras: ' + e });
        }
    }

    async getCarteiraByUserId(req, res) {
        try {
            const { usuarioId } = req.params;
            const carteira = await this.carteiraService.getCarteiraByUserId(usuarioId);
            if (!carteira) {
                return res.status(400).json({ error: 'Carteira não encontrada.' });
            }
            res.status(200).json(carteira);
        } catch (e) {
            res.status(500).json({ error: 'Erro ao recuperar informações da carteira: ' + e });
        }
    }
}

module.exports = CarteiraController;
