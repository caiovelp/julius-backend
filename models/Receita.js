const { DataTypes } = require('sequelize');
const {sequelize} = require('../../config/db');

const Receita = sequelize.define('Receita', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    data: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    valor: {
        type: DataTypes.DECIMAL(10 , 2),
        allowNull: false,
    }
}, {
    timestamps: false,
});

module.exports = Receita;