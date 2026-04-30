const Categoria = require('../models/Categoria');
const { Carteira } = require('../models/Associations');

const DEFAULT_CATEGORIES = [
    'Alimentação e Bebida', 'Bela', 'Conta', 'Economias',
    'Entretenimento', 'Fixo', 'Higiene e Saúde', 'Outros', 'Transporte', 'Terceiros',
];

class CategoriaService {
    async createCategorias(nomeCategorias, carteiraId) {
        const carteira = await Carteira.findByPk(carteiraId);
        if (!carteira) throw new Error('Carteira não encontrada');

        for (const nome of nomeCategorias) {
            await Categoria.create({ nome, limite: 0, carteiraId });
        }
    }

    async getCategorias(carteiraId) {
        let categorias = await Categoria.findAll({ where: { carteiraId } });

        if (categorias.length === 0) {
            await this.createCategorias(DEFAULT_CATEGORIES, carteiraId);
            categorias = await Categoria.findAll({ where: { carteiraId } });
        }

        return categorias;
    }
}

module.exports = CategoriaService;
