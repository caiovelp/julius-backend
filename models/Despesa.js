const { DataTypes } = require("sequelize");
const {sequelize} = require('../../config/db');

const Despesa = sequelize.define('Despesa', {
     id: {
         type: DataTypes.UUID,
         defaultValue: DataTypes.UUIDV4,
         primaryKey: true,
     },
    tipo: {
         type: DataTypes.STRING,
         allowNull: false,
    },
    data: {
         type: DataTypes.DATE,
         allowNull: false,
    },
    tag: {
         type: DataTypes.STRING,
         allowNull: false,
    },
    parcela: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nomeCobranca: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descricao: {
         type: DataTypes.STRING,
         allowNull: false,
    },
    origem: {
         type: DataTypes.STRING,
         allowNull: false,
    },
    valor: {
         type: DataTypes.DECIMAL(10 , 2),
         allowNull: false,
    },
}, {
    timestamps: false,
});

module.exports = Despesa;