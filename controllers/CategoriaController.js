const CategoriaService = require('../services/CategoriaService');
const { Carteira } = require('../models/Associations');

class CategoriaController {
    constructor() {
        this.categoriaService = new CategoriaService();
        this.getCategorias = this.getCategorias.bind(this);
        this.getCategoriasDefault = this.getCategoriasDefault.bind(this);
        this.createCategorias = this.createCategorias.bind(this);
    }

    async getCategorias(req, res) {
        try {
            const { carteiraId } = req.params;
            const categorias = await this.categoriaService.getCategorias(carteiraId);
            res.status(200).json(categorias);
        } catch (e) {
            res.status(500).json({ error: 'Erro ao recuperar as categorias: ' + e });
        }
    }

    async getCategoriasDefault(req, res) {
        try {
            // Busca a carteira padrão (primeira carteira do sistema)
            const carteira = await Carteira.findOne();
            if (!carteira) {
                return res.status(404).json({ error: 'Carteira padrão não encontrada' });
            }
            
            const categorias = await this.categoriaService.getCategorias(carteira.id);
            res.status(200).json(categorias);
        } catch (e) {
            res.status(500).json({ error: 'Erro ao recuperar as categorias: ' + e });
        }
    }

    async createCategorias(req, res) {
        try {
            const { carteiraId } = req.params;
            const { nomeCategorias } = req.body;

            if (!Array.isArray(nomeCategorias) || nomeCategorias.length === 0) {
                return res.status(400).json({ error: 'nomeCategorias deve ser um array não vazio.' });
            }

            await this.categoriaService.createCategorias(nomeCategorias, carteiraId);
            res.status(201).json({ message: 'Categorias criadas com sucesso.' });
        } catch (e) {
            res.status(500).json({ error: 'Erro ao criar categorias: ' + e });
        }
    }
}

module.exports = CategoriaController;
