const { DataTypes } = require('sequelize');
const {sequelize} = require('../../config/db');

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
}, {
    timestamps: false,
});

module.exports = Carteira;