'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Adicionar coluna orcamentoMensal em Carteira
    await queryInterface.addColumn('Carteiras', 'orcamentoMensal', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    });

    // Criar tabela DivisaoGrupo
    await queryInterface.createTable('DivisaoGrupos', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      carteiraId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Carteiras',
          key: 'id',
        },
      },
      valorOriginal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      numParcelas: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      descricao: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Criar tabela Lancamento
    await queryInterface.createTable('Lancamentos', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      carteiraId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Carteiras',
          key: 'id',
        },
      },
      categoriaId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Categorias',
          key: 'id',
        },
      },
      divisaoGrupoId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'DivisaoGrupos',
          key: 'id',
        },
      },
      data: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      tag: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      parcela: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      observacao: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      nomeNaFatura: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cartao: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      valor: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      conferido: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      divisaoValorOriginal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Reverter em ordem inversa
    await queryInterface.dropTable('Lancamentos');
    await queryInterface.dropTable('DivisaoGrupos');
    await queryInterface.removeColumn('Carteiras', 'orcamentoMensal');
  },
};
