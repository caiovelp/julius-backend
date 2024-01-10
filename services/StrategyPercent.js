const Strategy = require("./Strategy");


class StrategyPercent extends Strategy {

    async calculaValorMensal(porcentagem, salario) {
        return (porcentagem / 100) * salario;
    }
}

module.exports = StrategyPercent;