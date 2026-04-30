/**
 * Script de migração: Despesa/Receita -> Lancamento
 * 
 * Executa:
 * node scripts/migrate-to-lancamento.js
 * 
 * IMPORTANTE: Faça backup do banco antes de executar!
 */

const { sequelize } = require('../config/db');
const Despesa = require('../models/Despesa');
const Receita = require('../models/Receita');
const Lancamento = require('../models/Lancamento');
require('../models/Associations'); // Load associations

async function migrateDespesaToLancamento() {
    console.log('Iniciando migração de Despesa para Lancamento...');

    try {
        const despesas = await Despesa.findAll();
        console.log(`Encontradas ${despesas.length} despesas para migrar`);

        let migradas = 0;
        for (const despesa of despesas) {
            try {
                await Lancamento.create({
                    carteiraId: despesa.carteiraId,
                    categoriaId: despesa.categoriaId,
                    data: despesa.data,
                    tag: despesa.tag || null,
                    parcela: despesa.parcela || null,
                    observacao: null, // Novo campo, sem equivalente em Despesa
                    nomeNaFatura: despesa.nomeCobranca || null,
                    cartao: despesa.origem || null, // Usar 'origem' como 'cartao'
                    valor: parseFloat(despesa.valor), // Positivo para despesa
                    conferido: false, // Default false
                    divisaoValorOriginal: null, // Sem equivalente
                    divisaoGrupoId: null, // Sem equivalente
                });
                migradas++;
            } catch (err) {
                console.error(`Erro ao migrar despesa ${despesa.id}:`, err.message);
            }
        }

        console.log(`✓ ${migradas} despesas migradas com sucesso`);
    } catch (error) {
        console.error('Erro durante migração de Despesa:', error.message);
    }
}

async function migrateReceitaToLancamento() {
    console.log('Iniciando migração de Receita para Lancamento...');

    try {
        const receitas = await Receita.findAll();
        console.log(`Encontradas ${receitas.length} receitas para migrar`);

        let migradas = 0;
        for (const receita of receitas) {
            try {
                await Lancamento.create({
                    carteiraId: receita.carteiraId,
                    categoriaId: null, // Receita não tem categoria; pode ser manual depois
                    data: receita.data,
                    tag: null, // Receita não tem tag
                    parcela: null,
                    observacao: receita.descricao || null, // Usar descrição como observação
                    nomeNaFatura: null,
                    cartao: null,
                    valor: -parseFloat(receita.valor), // NEGATIVO para receita (regra de sinal)
                    conferido: false,
                    divisaoValorOriginal: null,
                    divisaoGrupoId: null,
                });
                migradas++;
            } catch (err) {
                console.error(`Erro ao migrar receita ${receita.id}:`, err.message);
            }
        }

        console.log(`✓ ${migradas} receitas migradas com sucesso`);
    } catch (error) {
        console.error('Erro durante migração de Receita:', error.message);
    }
}

async function runMigration() {
    try {
        await sequelize.authenticate();
        console.log('Conectado ao banco de dados');

        // Migrar Despesa
        await migrateDespesaToLancamento();

        // Migrar Receita
        await migrateReceitaToLancamento();

        console.log('\n✓ Migração concluída com sucesso!');
        console.log('Verifique os dados em Lancamento e se estiver tudo ok, remova os dados legados de Despesa/Receita manualmente.');
        
        process.exit(0);
    } catch (error) {
        console.error('Erro fatal:', error);
        process.exit(1);
    }
}

// Executar
runMigration();
