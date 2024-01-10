const { Usuario } = require('../models/Associations');
const CarteiraService = require("../services/CarteiraService");

class CarteiraController {
    constructor() {
        this.carteiraService = new CarteiraService();

        this.createCarteira = this.createCarteira.bind(this);
        this.getCarteiraByUserId = this.getCarteiraByUserId.bind(this);
    }

    async createCarteira(req, res) {
        try {
            const { usuarioId } = req.params;

            await this.carteiraService.createCarteira(usuarioId)
                .then(() => {
                    res.status(200).json({ message: `Carteira criada com sucesso.` });
                })
                .catch((error) => {
                    res.status(404).json({ error: 'Erro ao criar a carteira: ' + error});
                });

        }
        catch(e) {
            res.status(500).json({ error: 'Erro ao criar a carteira: ' + e});
        }
    }

    async getCarteiraByUserId(req, res) {
        try {
            const { usuarioId } = req.params;

            const carteira = await this.carteiraService.getCarteiraByUserId(usuarioId);
            if(!carteira) {
                return res.status(400).json({ error: 'Carteira não encontrada. '});
            }

            res.status(200).json(carteira);
        }
        catch(e) {
            res.status(500).json({ error: 'Erro ao recuperar informações da carteira: ' + e});
        }
    }

}

module.exports = CarteiraController