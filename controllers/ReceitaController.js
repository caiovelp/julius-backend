const CarteiraService = require("../services/CarteiraService");
const ReceitaService = require("../services/ReceitaService");

class ReceitaController {
    constructor() {
        this.receitaService = new ReceitaService();

        this.createReceita = this.createReceita.bind(this);
        this.editReceita = this.editReceita.bind(this);
        this.deleteReceita = this.deleteReceita.bind(this);
        this.getReceitaById = this.getReceitaById.bind(this);
        this.getReceitas = this.getReceitas.bind(this);
        this.getValorReceitaMensal = this.getValorReceitaMensal.bind(this);
    }

    async createReceita(req, res){
        try {
            const { carteiraId, data, descricao, valor } = req.body;

            if (!data || !descricao || !valor) {
            return res.status(400).json({ error: 'Todos os campos (data, descrição, valor) são obrigatórios.' });
            }

            let carteiraService = new CarteiraService();

            await this.receitaService.createReceita(data, descricao, valor, carteiraId, carteiraService)
                .then(async () => {
                    res.status(200).json({message: `Receita criada com sucesso.`});
                })
                .catch((error) => {
                    res.status(500).json({ error: 'Erro ao criar receita: ' + error });
                });
        }
        catch (e) {
            res.status(500).json({ error: 'Erro ao adicionar uma receita: ' + e });
        }
    }

    async editReceita(req, res){
        try {
            const { carteiraId } = req.params;
            const { id, data, descricao, valor } = req.body;

            await this.receitaService.editReceita(data, descricao, valor, id, carteiraId)
                .then(() => {
                    res.status(200).json({ message: 'Receita atualizada com sucesso.' });
                })
                .catch((error) => {
                    res.status(500).json({ error: 'Erro ao atualizar a receita: ' + error });
                });

        }
        catch (e) {
            res.status(500).json({ error: 'Erro ao atualizar a receita:' + e });
        }
    }

    async deleteReceita (req, res){
        try {
            const { carteiraId } = req.params;
            const { id } = req.body;

            let carteiraService = new CarteiraService();

            await this.receitaService.deleteReceita(id, carteiraId, carteiraService)
                .then(() => {
                    res.status(200).json({ message: `Receita deletada com sucesso.` });
                })
                .catch((error) => {
                    res.status(500).json({ error: 'Erro ao deletar a receita: ' + error });
                });
        }
        catch (e) {
            res.status(500).json({ error: 'Erro ao deletar a receita:' + e });
        }
    }

    async getReceitaById(req, res) {
        try {
            const { carteiraId } = req.params;
            const { id } = req.body;

            await this.receitaService.getReceitaById(id, carteiraId)
                .then(receita => {
                    res.status(200).json(receita);
                })
                .catch((error) => {
                    res.status(400).json({ error: 'Erro ao recuperar receita: ' + error });
                });
        }
        catch (e) {
            res.status(500).json({ error: 'Erro ao recuperar receita: ' + e });
        }
    }

    async getReceitas(req, res) {
        try {
            const { carteiraId } = req.params;

            await this.receitaService.getReceitas(carteiraId)
                .then(receitas => {
                    res.status(200).json(receitas);
                })
                .catch((error) => {
                    res.status(400).json({ error: 'Erro ao recuperar receitas: ' + error });
                });

        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar receitas' });
        }
    }

    async getValorReceitaMensal(req, res) {
        try {
            const { carteiraId } = req.params;

            await this.receitaService.getReceitaMensal(carteiraId)
                .then(receitaMensal => {
                    res.status(200).json({
                        receitaMensal: receitaMensal
                    });
                })
                .catch((error) => {
                    res.status(400).json({ error: 'Erro ao recuperar receitas do mês: ' + error });
                });
        }
        catch (error) {
            res.status(500).json({ error: 'Erro ao buscar receitas do mês: ' + error });
        }
    }
}

module.exports = ReceitaController