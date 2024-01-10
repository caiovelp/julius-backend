const { DataTypes } = require('sequelize');
const {sequelize} = require('../../config/db');

const ObjetivoFinanceiro = sequelize.define('ObjetivoFinanceiro', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    valorAlvo: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    valorMensal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    dataResgate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    estrategia: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
});

module.exports = ObjetivoFinanceiro;