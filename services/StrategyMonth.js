const Strategy = require("./Strategy");


class StrategyMonth extends Strategy {

    async calculaValorMensal(total, dataResgate) {
        let dataAtual = new Date();
        let meses = await this.monthDif(new Date(dataResgate), dataAtual);
        return total/meses;
    }

    async monthDif (dataResgate, dataAtual) {
        return dataResgate.getMonth() - dataAtual.getMonth() + (12 + (dataResgate.getFullYear() - dataAtual.getFullYear()));
    }
}

module.exports = StrategyMonth;