const request = require('supertest');
const { sequelize } = require('../config/db');
const app = require('../server');
const Lancamento = require('../models/Lancamento');
const Categoria = require('../models/Categoria');
const Carteira = require('../models/Carteira');
const Usuario = require('../models/Usuario');
require('../models/Associations');

describe('Lancamento API', () => {
    let userId;
    let walletId;
    let categoryId;
    let terceirosCategoryId;
    let lancamentoId;

    beforeAll(async () => {
        // Sync database for tests
        await sequelize.sync({ force: true });

        // Create test user
        const user = await Usuario.create({
            nome: 'Test User',
            username: 'testuser',
            email: 'test@example.com',
            senha: 'password123'
        });
        userId = user.id;

        // Create test wallet
        const wallet = await Carteira.create({
            usuarioId: userId,
            saldo: 5000,
            orcamentoMensal: 3000
        });
        walletId = wallet.id;

        // Create test category
        const category = await Categoria.create({
            nome: 'Alimentação',
            carteiraId: walletId
        });
        categoryId = category.id;

        const terceirosCategory = await Categoria.create({
            nome: 'Terceiros',
            carteiraId: walletId
        });
        terceirosCategoryId = terceirosCategory.id;

        await request(app)
            .post(`/lancamentos/${walletId}`)
            .send({
                data: '2026-04-10',
                categoriaId: terceirosCategoryId,
                valor: 80.00,
                tag: 'Caio'
            });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('POST /lancamentos/:carteiraId', () => {
        it('should create a new lancamento with required fields', async () => {
            const res = await request(app)
                .post(`/lancamentos/${walletId}`)
                .send({
                    data: '2026-04-15',
                    categoriaId: categoryId,
                    valor: 100.50,
                    tag: 'Caio'
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.lancamento).toHaveProperty('id');
            expect(res.body.lancamento.valor).toBe(100.50);
            expect(res.body.lancamento.tag).toBe('Caio');
            lancamentoId = res.body.lancamento.id;
        });

        it('should fail without required data field', async () => {
            const res = await request(app)
                .post(`/lancamentos/${walletId}`)
                .send({
                    categoriaId: categoryId,
                    valor: 50.00
                });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.error).toContain('obrigatório');
        });

        it('should fail without categoriaId', async () => {
            const res = await request(app)
                .post(`/lancamentos/${walletId}`)
                .send({
                    data: '2026-04-15',
                    valor: 50.00
                });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('should fail with valor = 0', async () => {
            const res = await request(app)
                .post(`/lancamentos/${walletId}`)
                .send({
                    data: '2026-04-15',
                    categoriaId: categoryId,
                    valor: 0
                });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('should accept negative valor (receita)', async () => {
            const res = await request(app)
                .post(`/lancamentos/${walletId}`)
                .send({
                    data: '2026-04-01',
                    categoriaId: categoryId,
                    valor: -3000.00,
                    tag: 'Salário'
                });

            expect(res.status).toBe(200);
            expect(res.body.lancamento.valor).toBe(-3000.00);
        });

        it('should validate parcela format if provided', async () => {
            const res = await request(app)
                .post(`/lancamentos/${walletId}`)
                .send({
                    data: '2026-04-15',
                    categoriaId: categoryId,
                    valor: 300.00,
                    parcela: 'invalid'
                });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('should accept valid parcela format n/x', async () => {
            const res = await request(app)
                .post(`/lancamentos/${walletId}`)
                .send({
                    data: '2026-04-15',
                    categoriaId: categoryId,
                    valor: 300.00,
                    parcela: '3/12'
                });

            expect(res.status).toBe(200);
            expect(res.body.lancamento.parcela).toBe('3/12');
        });
    });

    describe('GET /lancamentos/mes/:carteiraId', () => {
        it('should return lancamentos for the month', async () => {
            const res = await request(app)
                .get(`/lancamentos/mes/${walletId}`)
                .query({ month: '2026-04' });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.mes).toBe('2026-04');
            expect(Array.isArray(res.body.lancamentos)).toBe(true);
            expect(res.body.lancamentos.length).toBeGreaterThan(0);
        });

        it('should include Categoria in response', async () => {
            const res = await request(app)
                .get(`/lancamentos/mes/${walletId}`)
                .query({ month: '2026-04' });

            expect(res.body.lancamentos[0]).toHaveProperty('Categoria');
            expect(res.body.lancamentos[0].Categoria.nome).toBe('Alimentação');
        });

        it('should filter by tag', async () => {
            const res = await request(app)
                .get(`/lancamentos/mes/${walletId}`)
                .query({ month: '2026-04', tag: 'Caio' });

            expect(res.status).toBe(200);
            expect(res.body.lancamentos.every(l => l.tag === 'Caio')).toBe(true);
        });

        it('should filter by search text', async () => {
            const res = await request(app)
                .get(`/lancamentos/mes/${walletId}`)
                .query({ month: '2026-04', search: 'test' });

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.lancamentos)).toBe(true);
        });

        it('should return empty array for month with no entries', async () => {
            const res = await request(app)
                .get(`/lancamentos/mes/${walletId}`)
                .query({ month: '2025-01' });

            expect(res.status).toBe(200);
            expect(res.body.lancamentos.length).toBe(0);
        });
    });

    describe('GET /lancamentos/agregacoes/:carteiraId', () => {
        it('should return aggregations for the month', async () => {
            const res = await request(app)
                .get(`/lancamentos/agregacoes/${walletId}`)
                .query({ month: '2026-04' });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.agregacoes).toHaveProperty('mes');
            expect(res.body.agregacoes).toHaveProperty('orcamentoMensal');
            expect(res.body.agregacoes).toHaveProperty('totalMes');
            expect(res.body.agregacoes).toHaveProperty('saldoDisponivel');
        });

        it('should calculate saldoDisponivel correctly', async () => {
            const res = await request(app)
                .get(`/lancamentos/agregacoes/${walletId}`)
                .query({ month: '2026-04' });

            const { orcamentoMensal, totalMes, saldoDisponivel } = res.body.agregacoes;
            expect(saldoDisponivel).toBe(orcamentoMensal - totalMes);
        });

        it('should ignore Terceiros in totalMes', async () => {
            const res = await request(app)
                .get(`/lancamentos/agregacoes/${walletId}`)
                .query({ month: '2026-04' });

            expect(res.body.agregacoes.totalMes).toBe(-2599.5);
        });

        it('should include category totals', async () => {
            const res = await request(app)
                .get(`/lancamentos/agregacoes/${walletId}`)
                .query({ month: '2026-04' });

            expect(res.body.agregacoes).toHaveProperty('totaisPorCategoria');
            expect(typeof res.body.agregacoes.totaisPorCategoria).toBe('object');
        });
    });

    describe('PUT /lancamentos/:lancamentoId', () => {
        it('should update lancamento fields', async () => {
            const res = await request(app)
                .put(`/lancamentos/${lancamentoId}`)
                .send({
                    tag: 'Updated Tag',
                    observacao: 'Updated observation'
                });

            expect(res.status).toBe(200);
            expect(res.body.lancamento.tag).toBe('Updated Tag');
            expect(res.body.lancamento.observacao).toBe('Updated observation');
        });

        it('should update conferido status', async () => {
            const res = await request(app)
                .put(`/lancamentos/${lancamentoId}`)
                .send({
                    conferido: true
                });

            expect(res.status).toBe(200);
            expect(res.body.lancamento.conferido).toBe(true);
        });

        it('should fail updating with invalid valor (0)', async () => {
            const res = await request(app)
                .put(`/lancamentos/${lancamentoId}`)
                .send({
                    valor: 0
                });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe('DELETE /lancamentos/:lancamentoId', () => {
        it('should delete a lancamento', async () => {
            const res = await request(app)
                .delete(`/lancamentos/${lancamentoId}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should return 404 for non-existent lancamento', async () => {
            const res = await request(app)
                .delete(`/lancamentos/nonexistent-id`);

            expect(res.status).toBe(404);
        });
    });

    describe('GET /lancamentos/:lancamentoId', () => {
        it('should get lancamento by id', async () => {
            // Create a lancamento first
            const createRes = await request(app)
                .post(`/lancamentos/${walletId}`)
                .send({
                    data: '2026-04-20',
                    categoriaId: categoryId,
                    valor: 50.00
                });

            const newId = createRes.body.lancamento.id;

            const res = await request(app)
                .get(`/lancamentos/${newId}`);

            expect(res.status).toBe(200);
            expect(res.body.id).toBe(newId);
            expect(res.body.valor).toBe(50.00);
        });

        it('should return 404 for non-existent lancamento', async () => {
            const res = await request(app)
                .get(`/lancamentos/nonexistent-id`);

            expect(res.status).toBe(404);
        });
    });
});
