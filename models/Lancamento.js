const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Lancamento = sequelize.define('Lancamento', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    data: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    tag: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    parcela: {
        type: DataTypes.STRING, // Formato: "n/x" (ex: "1/3", "1/x")
        allowNull: true,
    },
    observacao: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    nomeNaFatura: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    cartao: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    valor: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        // Pode ser positivo (despesa) ou negativo (receita)
    },
    conferido: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    divisaoValorOriginal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        // Valor original se este é um item rateado
    },
}, {
    timestamps: true, // createdAt, updatedAt para auditoria
});

module.exports = Lancamento;
