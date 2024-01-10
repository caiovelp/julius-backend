const Carteira = require('./Carteira');
const Categoria = require('./Categoria');
const Despesa = require('./Despesa');
const Subcategoria = require('./Subcategoria');
const Usuario = require('./Usuario');
const Receita = require('./Receita');
const Banco = require('./Banco');
const ObjetivoFinanceiro = require('./ObjetivoFinanceiro');

Usuario.hasOne(Carteira, { foreignKey: 'usuarioId' });
Usuario.hasMany(Banco, { foreignKey: 'usuarioId' });
Usuario.hasMany(ObjetivoFinanceiro, { foreignKey: 'usuarioId' });

Carteira.belongsTo(Usuario, { foreignKey: 'usuarioId' });
Carteira.hasMany(Despesa, { foreignKey: 'carteiraId' });
Carteira.hasMany(Receita, { foreignKey: 'carteiraId' });

Despesa.belongsTo(Carteira, { foreignKey: 'carteiraId' });
Despesa.belongsTo(Categoria, { as: 'Categoria', foreignKey: 'categoriaId' });

Receita.belongsTo(Carteira, { foreignKey: 'carteiraId' });

Subcategoria.belongsTo(Categoria, { foreignKey: 'categoriaId' });

Categoria.hasMany(Despesa, { as: 'Categoria', foreignKey: 'categoriaId' });
Categoria.hasMany(Subcategoria, { foreignKey: 'categoriaId' });
Categoria.belongsTo(Carteira, { foreignKey: 'carteiraId' });

Banco.belongsTo(Usuario, { foreignKey: 'usuarioId' });

ObjetivoFinanceiro.belongsTo(Usuario, { foreignKey: 'usuarioId' });

module.exports = {
    Carteira,
    Categoria,
    Despesa,
    Subcategoria,
    Usuario,
    Receita,
    Banco,
    ObjetivoFinanceiro,
}