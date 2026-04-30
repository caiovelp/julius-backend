const { sequelize } = require('./config/db');
const Despesa = require('./models/Despesa');
const Receita = require('./models/Receita');
require('./models/Associations'); // Load all associations

async function seedLegacyData() {
    try {
        await sequelize.authenticate();
        console.log('Conectado ao banco');

        const userId = 'b1a996da-ae72-4dc8-a9b7-da543e8ff96b';
        const walletId = 'f57a3e95-d46e-48a0-9434-b7ffcf558143';
        const categoryId = '6cd97d8e-38a1-405b-83cd-66d534b2690f'; // Alimentação

        // Criar dados legados Despesa
        const despesa1 = await Despesa.create({
            tipo: 'Fixo',
            carteiraId: walletId,
            categoriaId: categoryId,
            data: '2026-04-01',
            valor: 50.00,
            tag: 'Caio',
            nomeCobranca: 'Restaurante XYZ',
            origem: 'Nubank',
            parcela: '1/1',
            descricao: 'Almoço'
        });
        console.log('Created Despesa 1:', despesa1.id);

        const despesa2 = await Despesa.create({
            tipo: 'Fixo',
            carteiraId: walletId,
            categoriaId: categoryId,
            data: '2026-04-05',
            valor: 30.00,
            tag: 'Caio',
            nomeCobranca: 'Supermercado ABC',
            origem: 'Débito',
            parcela: '1/1',
            descricao: 'Compras'
        });
        console.log('Created Despesa 2:', despesa2.id);

        const despesa3 = await Despesa.create({
            tipo: 'Variável',
            carteiraId: walletId,
            categoriaId: categoryId,
            data: '2026-04-10',
            valor: 1200.00,
            tag: 'Aluguel',
            nomeCobranca: 'Imóvel Y',
            origem: 'Transferência',
            parcela: '1/1',
            descricao: 'Aluguel mensal'
        });
        console.log('Created Despesa 3:', despesa3.id);

        // Criar dados legados Receita
        const receita1 = await Receita.create({
            carteiraId: walletId,
            data: '2026-04-01',
            valor: 3000.00,
            descricao: 'Salário mensal'
        });
        console.log('Created Receita 1:', receita1.id);

        const receita2 = await Receita.create({
            carteiraId: walletId,
            data: '2026-04-15',
            valor: 500.00,
            descricao: 'Freelance projeto X'
        });
        console.log('Created Receita 2:', receita2.id);

        console.log('\n✅ Legacy data seeded!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

seedLegacyData();
