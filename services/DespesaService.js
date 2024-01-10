const {Op} = require("sequelize");
const {sequelize} = require("../../config/db");
const {Despesa, Categoria} = require("../models/Associations");
const CategoriaService = require("./CategoriaService");
const Subject = require("./Subject");

class DespesaService extends Subject {
    constructor() {
        super();
    }

    // TODO: Arrumar um jeito de não usar o carteira service como parâmetro.
    async createDespesa(tipo, data, tag, descricao, origem, valor, carteiraId, categoriaId, parcela, nomeCobranca, carteiraService) {
        try {
            let categoriaService = new CategoriaService();

            let carteira = await carteiraService.getCarteiraById(carteiraId);
            if(!carteira) {
                throw new Error('Carteira não encontrada.');
            }

            let categoria = await categoriaService.getCategoria(categoriaId, carteiraId);
            if(!categoria) {
                throw new Error('Categoria não encontrada.');
            }

            let numParcelas = parcela;
            let despesaData = new Date(data);

            let valorDaParcela = valor / parcela;

            for (let i = 0; i < numParcelas; i++) {
                await Despesa.create({
                    tipo: tipo,
                    data: despesaData,
                    tag: tag,
                    descricao: descricao,
                    origem: origem,
                    valor: valorDaParcela.toFixed(2),
                    carteiraId: carteiraId,
                    categoriaId: categoriaId,
                    parcela: `${i+1}/${numParcelas}`,
                    nomeCobranca: nomeCobranca,
                });

                this.addObserver(carteiraService);
                // await carteiraService.updateSaldoMensalByExpense(carteiraId, valor, true);
                this.notifyObservers(carteiraId, valor, false);
                despesaData.setMonth(despesaData.getMonth() + 1);
            }
        } catch(error) {
            console.log(error);
            return error;
        }
    }

    async editDespesa(tipo, data, tag, descricao, origem, valor, categoriaId, id, carteiraId) {
        let updatedDespesa = await Despesa.update(
            {tipo, data, tag, descricao, origem, valor, categoriaId },
            { where: { id, carteiraId } }
        )

        if(updatedDespesa[0] !== 1) {
            throw new Error('Despesa não encontrada.');
        }
    }

    async deleteDespesa(id, carteiraId, carteiraService) {
        let despesa = await this.getDespesaById(id, carteiraId);

        if(!despesa) {
            throw new Error('Despesa não encontrada.');
        }
        let valor = despesa.valor;

        despesa.destroy();

        this.addObserver(carteiraService)
        this.notifyObservers(carteiraId, valor, true);

    }

    async deleteAllDespesas(carteiraId) {
        return await Despesa.destroy({
            where: {
                carteiraId: carteiraId
            }
        });
    }

    async getDespesaById(id, carteiraId) {
        let despesa = await Despesa.findOne({
            where: {
                id: id,
                carteiraId: carteiraId
            }
        })
        if (!despesa) {
            throw new Error('Despesa não encontrada.');
        }
        else {
            return despesa;
        }
    }

    async getDespesas(carteiraId) {
        return await Despesa.findAll({ where: { carteiraId } });
    }

    async getDespesaMensal(carteiraId) {
        const mesAtual = new Date().getMonth() + 1;

        let despesasDoMesAtual = await Despesa.findAll({
            where: {
                carteiraId,
                [Op.and]: [
                    sequelize.where(
                        sequelize.fn('EXTRACT', sequelize.literal('MONTH FROM "data"')),
                        mesAtual
                    )
                ]
            },
            attributes: ['valor']
        })

        let despesaMensal = 0;
        despesasDoMesAtual.forEach((despesa) => {
            despesaMensal = despesaMensal + parseFloat(despesa.dataValues.valor);
        });

        return despesaMensal.toString();
    }

    async getDespesasMensaisList(carteiraId) {
        return await Despesa.findAll({
            where: {
                [Op.and]: [
                    sequelize.literal('EXTRACT(MONTH FROM data) = EXTRACT(MONTH FROM CURRENT_DATE)'),
                    {carteiraId: carteiraId}
                ]
            }
        });
    }

    async getDespesasMensaisGroupyByCategory(carteiraId) {

        return await Despesa.findAll({
            attributes: [
                [sequelize.literal('SUM(valor)'), 'total'],
            ],
            include: {
                model: Categoria,
                as: 'Categoria',
            },
            where: {
                [Op.and]: [
                    sequelize.literal('EXTRACT(MONTH FROM data) = EXTRACT(MONTH FROM CURRENT_DATE)'),
                    {carteiraId: carteiraId}
                ]
            },
            group: ['Categoria.id']
        });
    }
}

module.exports = DespesaService;