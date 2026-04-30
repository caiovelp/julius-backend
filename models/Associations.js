const Carteira = require('./Carteira');
const Categoria = require('./Categoria');
const Usuario = require('./Usuario');
const Lancamento = require('./Lancamento');
const DivisaoGrupo = require('./DivisaoGrupo');

Usuario.hasOne(Carteira, { foreignKey: 'usuarioId' });

Carteira.belongsTo(Usuario, { foreignKey: 'usuarioId' });
Carteira.hasMany(Lancamento, { foreignKey: 'carteiraId' });
Carteira.hasMany(DivisaoGrupo, { foreignKey: 'carteiraId' });

Lancamento.belongsTo(Carteira, { foreignKey: 'carteiraId' });
Lancamento.belongsTo(Categoria, { as: 'Categoria', foreignKey: 'categoriaId' });
Lancamento.belongsTo(DivisaoGrupo, { foreignKey: 'divisaoGrupoId', allowNull: true });

DivisaoGrupo.belongsTo(Carteira, { foreignKey: 'carteiraId' });
DivisaoGrupo.hasMany(Lancamento, { foreignKey: 'divisaoGrupoId' });

Categoria.hasMany(Lancamento, { foreignKey: 'categoriaId' });
Categoria.belongsTo(Carteira, { foreignKey: 'carteiraId' });

module.exports = { Carteira, Categoria, Usuario, Lancamento, DivisaoGrupo };
