const ObjetivoFinanceiroService = require("../services/ObjetivoFinanceiroService");

class ObjetivoFinanceiroController {
  constructor() {
    this.objetivoFinanceiroService = new ObjetivoFinanceiroService();

    this.createObjetivoFinanceiro = this.createObjetivoFinanceiro.bind(this);
  }

  async createObjetivoFinanceiro(req, res) {
    try {
      const {
        usuarioId,
      } = req.params;

      const {
        nome,
        valorAlvo,
        dataResgate,
        estrategia,
        porcentagem,
        salario,
      } = req.body;

      await this.objetivoFinanceiroService
        .createObjetivoFinanceiro(
          usuarioId,
          nome,
          valorAlvo,
          dataResgate,
          estrategia,
          porcentagem,
          salario
        )
        .then(() => {
          res
            .status(200)
            .json({ message: `ObjetivoFinanceiro criada com sucesso.` });
        })
        .catch((error) => {
          res
            .status(404)
            .json({ error: "Erro ao criar a objetivoFinanceiro: " + error });
        });
    } catch (e) {
      res
        .status(500)
        .json({ error: "Erro ao criar a objetivoFinanceiro: " + e });
    }
  }
}

module.exports = ObjetivoFinanceiroController;
