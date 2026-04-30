const { DataTypes} = require('sequelize');
const {sequelize} = require('../config/db');

const Categoria = sequelize.define('Categoria', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    carteiraId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Carteiras',
            key: 'id',
        },
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    limite: {
        type: DataTypes.DECIMAL(10 , 2),
        allowNull: false
    }
}, {
    timestamps: false,
});

module.exports = Categoria;