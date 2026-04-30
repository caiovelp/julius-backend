const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/db');

const Carteira = sequelize.define('Carteira', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    saldo: {
        type: DataTypes.DECIMAL(10 , 2),
        allowNull: false,
    },
    orcamentoMensal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0,
        // Orçamento mensal para calcular saldo disponível
    },
}, {
    timestamps: false,
});

module.exports = Carteira;