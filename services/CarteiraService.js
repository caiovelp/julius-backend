const { Carteira } = require('../models/Associations');

class CarteiraService {
    async getCarteiraByUserId(usuarioId) {
        return await Carteira.findOne({ where: { usuarioId } });
    }

    async getCarteiraById(carteiraId) {
        return await Carteira.findByPk(carteiraId);
    }
}

module.exports = CarteiraService;
