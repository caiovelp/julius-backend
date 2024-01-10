const { DataTypes } = require('sequelize');
const {sequelize} = require('../../config/db');

const Banco = sequelize.define('Banco', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    nome: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.STRING
    },
    saldo: {
        type: DataTypes.DECIMAL(10 , 2),
        allowNull: false,
    },
}, {
    timestamps: false,
});

module.exports = Banco;