const { ObjetivoFinanceiro } = require("../models/Associations");
const StrategyMonth = require("./StrategyMonth");
const StrategyPercent = require("./StrategyPercent");

class ObjetivoFinanceiroService {
  constructor() {
    this.strategies = {
      strategyMonth: new StrategyMonth(),
      strategyPercent: new StrategyPercent(),
    };
    this.strategy = null;
  }

  setStrategy(estrategia) {
    this.strategy = this.strategies[estrategia];
  }

  async calculaDataResgate(total, valorMensal) {
    let mesesNecessarios = Math.ceil(total / valorMensal);
    let dataAtual = new Date();

    const dataAlvo = new Date(dataAtual);
    dataAlvo.setMonth(dataAtual.getMonth() + mesesNecessarios);

    return dataAlvo;
  }

  async createObjetivoFinanceiro(
    usuarioId,
    nome,
    valorAlvo,
    dataResgate,
    estrategia,
    porcentagem,
    salario
  ) {
    this.setStrategy(estrategia);
    let valorMensal = 0;
    let novaDataResgate = dataResgate;
    if (estrategia == "strategyMonth") {
      valorMensal = await this.strategy.calculaValorMensal(
        valorAlvo,
        dataResgate
      );
    } else {
      valorMensal = await this.strategy.calculaValorMensal(
        porcentagem,
        salario
      );
      novaDataResgate = await this.calculaDataResgate(valorAlvo, valorMensal);
    }

    return await ObjetivoFinanceiro.create({
      usuarioId: usuarioId,
      nome: nome,
      valorAlvo: valorAlvo,
      dataResgate:
        novaDataResgate === dataResgate ? dataResgate : novaDataResgate,
      estrategia: estrategia,
      valorMensal: valorMensal,
    });
  }
}

module.exports = ObjetivoFinanceiroService;
