const express = require('express');
const cors = require('cors');

const { sequelize } = require('./config/db');
const { Carteira, Categoria } = require('./models/Associations');
const authMiddleware = require('./middleware/authMiddleware');
const userRoutes = require('./routes/userRoutes');
const walletRoutes = require('./routes/carteiraRoutes');
const categoryRoutes = require('./routes/categoriaRoutes');
const lancamentoRoutes = require('./routes/lancamentoRoutes');
const divisaoGrupoRoutes = require('./routes/divisaoGrupoRoutes');

const DEFAULT_CATEGORIES = [
    'Alimentação e Bebida', 'Bela', 'Conta', 'Economias',
    'Entretenimento', 'Fixo', 'Higiene e Saúde', 'Outros', 'Transporte', 'Terceiros',
];

const app = express();
app.use(cors());
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authMiddleware);

const initializeDatabase = async () => {
    try {
        await sequelize.sync();
        console.log('Database synced');

        // Criar ou obter carteira padrão
        let carteira = await Carteira.findOne();
        if (!carteira) {
            carteira = await Carteira.create({ saldo: 0, orcamentoMensal: 0 });
            console.log('Carteira padrão criada');
        }

        // Seedar categorias padrão se não existirem
        const existingCategories = await Categoria.count({ where: { carteiraId: carteira.id } });
        if (existingCategories === 0) {
            for (const nome of DEFAULT_CATEGORIES) {
                await Categoria.create({ nome, limite: 0, carteiraId: carteira.id });
            }
            console.log('Categorias padrão criadas');
        }
    } catch (error) {
        console.error('Erro ao inicializar banco:', error);
    }
};

initializeDatabase();

app.use('/users', userRoutes);
app.use('/wallets', walletRoutes);
app.use('/category', categoryRoutes);
app.use('/lancamentos', lancamentoRoutes);
app.use('/divisao-grupos', divisaoGrupoRoutes);

if (require.main === module) {
    app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
}

module.exports = app;
