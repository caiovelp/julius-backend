const { sequelize } = require('./config/db');
const Usuario = require('./models/Usuario');
const Carteira = require('./models/Carteira');

async function checkDB() {
    try {
        const usuarios = await Usuario.findAll();
        console.log('Usuarios:', usuarios.map(u => ({ id: u.id, usuario: u.usuario })));
        
        const carteiras = await Carteira.findAll();
        console.log('Carteiras:', carteiras.map(c => ({ id: c.id, usuarioId: c.usuarioId })));
    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkDB();
