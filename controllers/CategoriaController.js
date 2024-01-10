const CategoriaService = require("../services/CategoriaService");

class CategoriaController {
    constructor() {
        this.categoriaService = new CategoriaService();

        this.createCategoria = this.createCategoria.bind(this);
        this.createCategorias = this.createCategorias.bind(this);
        this.deleteCategoria = this.deleteCategoria.bind(this);
        this.getCategorias = this.getCategorias.bind(this);
        this.editCategoria = this.editCategoria.bind(this);
    }

    async createCategoria(req, res) {
        try {
            const { carteiraId } = req.params;
            const { nome } = req.body;

            if (!nome) {
                return res.status(400).json({ error: 'O nome da categoria é obrigatório.' });
            }

            await this.categoriaService.createCategoria(nome, carteiraId)
                .then(() => {
                    res.status(200).json({ message: `Categoria de despesa ${nome} criada com sucesso.` });
                })
                .catch((e) => {
                    res.status(500).json({ error: 'Erro ao adicionar uma categoria de despesa: ' + e });
                });
        }
        catch (e) {
            res.status(500).json({ error: 'Erro ao adicionar uma categoria de despesa: ' + e });
        }
    }

    async createCategorias(req, res) {
        try {
            const { carteiraId } = req.params;
            const { nomeCategorias } = req.body;

            if (!nomeCategorias) {
                return res.status(400).json({ error: 'Os nomes das categorias são obrigatórios.' });
            }

            await this.categoriaService.createCategorias(nomeCategorias, carteiraId)
                .then(() => {
                    res.status(200).json({ message: `Categorias de despesa criadas com sucesso.` });
                })
                .catch((e) => {
                    res.status(500).json({ error: 'Erro ao adicionar uma categoria de despesa: ' + e });
                });
        }
        catch (e) {
            res.status(500).json({ error: 'Erro ao adicionar uma categoria de despesa: ' + e });
        }
    }

    async editCategoria(req, res) {
        try {
            const { carteiraId } = req.params;
            const { id, nome, limite } = req.body;

            await this.categoriaService.editCategoria(id, carteiraId, nome, limite)
                .then(() => {
                    res.status(200).json({ message: 'Categoria atualizada com sucesso. '});
                })
                .catch((e) => {
                    res.status(500).json({ error: 'Erro ao atualizar a categoria: ' + e});
                });
        } catch (e) {
            res.status(500).json({error: 'Erro ao editar a categoria: ' + e});
        }
    }

    async deleteCategoria(req, res){
        try {
            const { carteiraId } = req.params;
            const { id } = req.body;

            await this.categoriaService.deleteCategoria(id, carteiraId)
                .then(() => {
                    res.status(200).json({ message: 'Categoria deletada com sucesso. '});
                })
                .catch((e) => {
                    res.status(500).json({ error: 'Erro ao deletar a categoria: ' + e});
                });
        }
        catch (e) {
            res.status(500).json({ error: 'Erro ao deletar a categoria: ' + e});
        }
    }

    async getCategorias(req, res) {
        try {
            const { carteiraId } = req.params;

            await this.categoriaService.getCategorias(carteiraId)
                .then((categorias) => {
                    res.status(200).json(categorias);
                })
                .catch((e) => {
                    res.status(500).json({ error: 'Erro ao recuperar as categorias do usuário: ' + e});
                });
        }
        catch (e) {
            res.status(500).json({ error: 'Erro ao recuperar as categorias do usuário: ' + e});
        }
    }
}

module.exports = CategoriaController