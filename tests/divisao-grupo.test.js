const request = require('supertest');
const { sequelize } = require('../config/db');
const app = require('../server');
const DivisaoGrupo = require('../models/DivisaoGrupo');
const Lancamento = require('../models/Lancamento');
const Carteira = require('../models/Carteira');
const Categoria = require('../models/Categoria');
const Usuario = require('../models/Usuario');
require('../models/Associations');

describe('DivisaoGrupo API', () => {
    let userId;
    let walletId;
    let categoryId;
    let lancamentoId;
    let grupoId;

    beforeAll(async () => {
        await sequelize.sync({ force: true });

        const user = await Usuario.create({
            nome: 'Test User',
            username: 'testuser',
            email: 'test@example.com',
            senha: 'password123'
        });
        userId = user.id;

        const wallet = await Carteira.create({
            usuarioId: userId,
            saldo: 5000,
            orcamentoMensal: 3000
        });
        walletId = wallet.id;

        const category = await Categoria.create({
            nome: 'Alimentação',
            carteiraId: walletId
        });
        categoryId = category.id;

        // Create a test lancamento
        const lancamento = await Lancamento.create({
            carteiraId: walletId,
            categoriaId: categoryId,
            data: '2026-04-15',
            valor: 100.00
        });
        lancamentoId = lancamento.id;
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('POST /divisao-grupos/:carteiraId', () => {
        it('should create a new divisao grupo', async () => {
            const res = await request(app)
                .post(`/divisao-grupos/${walletId}`)
                .send({
                    valorOriginal: 300.00,
                    numParcelas: 3,
                    descricao: 'Compra dividida'
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.grupo).toHaveProperty('id');
            expect(res.body.grupo.valorOriginal).toBe(300.00);
            expect(res.body.grupo.numParcelas).toBe(3);
            grupoId = res.body.grupo.id;
        });

        it('should fail without valorOriginal', async () => {
            const res = await request(app)
                .post(`/divisao-grupos/${walletId}`)
                .send({
                    numParcelas: 3
                });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('should create grupo with optional fields as null', async () => {
            const res = await request(app)
                .post(`/divisao-grupos/${walletId}`)
                .send({
                    valorOriginal: 150.00
                });

            expect(res.status).toBe(200);
            expect(res.body.grupo.numParcelas).toBeNull();
            expect(res.body.grupo.descricao).toBeNull();
        });
    });

    describe('GET /divisao-grupos/:grupoId', () => {
        it('should return grupo by id', async () => {
            const res = await request(app)
                .get(`/divisao-grupos/${grupoId}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.grupo.id).toBe(grupoId);
            expect(res.body.grupo.valorOriginal).toBe(300.00);
        });

        it('should return 404 for non-existent grupo', async () => {
            const res = await request(app)
                .get(`/divisao-grupos/nonexistent-id`);

            expect(res.status).toBe(404);
        });
    });

    describe('GET /divisao-grupos/carteira/:carteiraId', () => {
        it('should return all grupos for wallet', async () => {
            const res = await request(app)
                .get(`/divisao-grupos/carteira/${walletId}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.grupos)).toBe(true);
            expect(res.body.grupos.length).toBeGreaterThan(0);
        });

        it('should include lancamentos in grupo', async () => {
            const res = await request(app)
                .get(`/divisao-grupos/carteira/${walletId}`);

            expect(res.body.grupos[0]).toHaveProperty('Lancamentos');
            expect(Array.isArray(res.body.grupos[0].Lancamentos)).toBe(true);
        });
    });

    describe('POST /divisao-grupos/:grupoId/vincular/:lancamentoId', () => {
        it('should vincular lancamento to grupo', async () => {
            const res = await request(app)
                .post(`/divisao-grupos/${grupoId}/vincular/${lancamentoId}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should verify lancamento is linked after vincular', async () => {
            const res = await request(app)
                .get(`/lancamentos/${lancamentoId}`);

            expect(res.body.divisaoGrupoId).toBe(grupoId);
        });
    });

    describe('GET /divisao-grupos/:grupoId/lancamentos', () => {
        it('should return lancamentos in grupo', async () => {
            const res = await request(app)
                .get(`/divisao-grupos/${grupoId}/lancamentos`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.lancamentos)).toBe(true);
            expect(res.body.lancamentos.length).toBeGreaterThan(0);
        });

        it('should include correct lancamento in results', async () => {
            const res = await request(app)
                .get(`/divisao-grupos/${grupoId}/lancamentos`);

            const found = res.body.lancamentos.find(l => l.id === lancamentoId);
            expect(found).toBeDefined();
        });
    });

    describe('DELETE /divisao-grupos/desvincular/:lancamentoId', () => {
        it('should desvincular lancamento from grupo', async () => {
            const res = await request(app)
                .delete(`/divisao-grupos/desvincular/${lancamentoId}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should verify lancamento is unlinked', async () => {
            const res = await request(app)
                .get(`/lancamentos/${lancamentoId}`);

            expect(res.body.divisaoGrupoId).toBeNull();
        });
    });

    describe('DELETE /divisao-grupos/:grupoId', () => {
        it('should delete grupo and unlink lancamentos', async () => {
            // Create new grupo and lancamento for deletion test
            const groupRes = await request(app)
                .post(`/divisao-grupos/${walletId}`)
                .send({ valorOriginal: 100.00 });
            const tempGrupoId = groupRes.body.grupo.id;

            const lancRes = await request(app)
                .post(`/lancamentos/${walletId}`)
                .send({
                    data: '2026-04-25',
                    categoriaId: categoryId,
                    valor: 50.00
                });
            const tempLancamentoId = lancRes.body.lancamento.id;

            // Link them
            await request(app)
                .post(`/divisao-grupos/${tempGrupoId}/vincular/${tempLancamentoId}`);

            // Delete grupo
            const res = await request(app)
                .delete(`/divisao-grupos/${tempGrupoId}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);

            // Verify lancamento is unlinked
            const lancCheckRes = await request(app)
                .get(`/lancamentos/${tempLancamentoId}`);
            expect(lancCheckRes.body.divisaoGrupoId).toBeNull();
        });

        it('should return 404 for non-existent grupo deletion', async () => {
            const res = await request(app)
                .delete(`/divisao-grupos/nonexistent-id`);

            expect(res.status).toBe(404);
        });
    });
});
