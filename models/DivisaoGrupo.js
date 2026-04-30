const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const DivisaoGrupo = sequelize.define('DivisaoGrupo', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    carteiraId: {
        type: DataTypes.UUID,
        allowNull: false,
        // FK para Carteira
    },
    valorOriginal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        // Valor original da compra antes de rateio
    },
    numParcelas: {
        type: DataTypes.INTEGER,
        allowNull: true,
        // Número de partes se aplicável (para referência)
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: true,
        // Descrição do grupo (ex: "Almoço no Outback")
    },
}, {
    timestamps: true,
});

module.exports = DivisaoGrupo;
