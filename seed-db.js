const Usuario = require('./models/Usuario');
const Carteira = require('./models/Carteira');

async function seedDB() {
    try {
        // Create user
        const usuario = await Usuario.create({
            nome: 'Test User',
            username: 'testuser',
            email: 'test@example.com',
            senha: 'hashed_password_123'
        });
        console.log('Created user:', usuario.id);

        // Create wallet for the user
        const carteira = await Carteira.create({
            usuarioId: usuario.id,
            saldo: 5000,
            orcamentoMensal: 3000
        });
        console.log('Created wallet:', carteira.id);

        console.log('✅ Database seeded!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

seedDB();
