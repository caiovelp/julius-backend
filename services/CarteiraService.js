const {Carteira} = require("../models/Associations");
const Observer = require("./Observer");

class CarteiraService extends Observer {
    constructor() {
        super();
    }

    async createCarteira(usuarioId){
        return await Carteira.create({
         saldo: 0,
         usuarioId: usuarioId,
         });
    }

    async getCarteiraByUserId(usuarioId) {
        return await Carteira.findOne({
            where: {
                usuarioId: usuarioId
            }
        });
    }

    async getCarteiraById(carteiraId) {
        return await Carteira.findByPk(carteiraId);
    }

    async updateSaldoByAmount(carteiraId, valor, addAmount) {
        let carteira = await this.getCarteiraById(carteiraId);
        if(!carteira) {
            throw new Error("Carteira não encontrada.");
        }

        let saldo = addAmount ? (parseFloat(carteira.saldo) + parseFloat(valor)) : (parseFloat(carteira.saldo) - parseFloat(valor));
        return await carteira.update(
            {saldo}
        )
    }

    async update(carteiraId, valor, addAmount) {
        try {
            await this.updateSaldoByAmount(carteiraId, valor, addAmount);
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = CarteiraService;