const { DataTypes } = require('sequelize');
const {sequelize} = require('../../config/db');

const Subcategoria = sequelize.define('Subcategoria', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    limite: {
        type: DataTypes.DECIMAL(10 , 2),
        allowNull: false,
    }
}, {
    timestamps: false
});

module.exports = Subcategoria;