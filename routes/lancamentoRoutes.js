const express = require('express');
const router = express.Router();
const LancamentoController = require('../controllers/LancamentoController');

const lancamentoController = new LancamentoController();

/**
 * Criar novo lançamento
 * POST /lancamentos/:carteiraId
 */
router.post('/:carteiraId', (req, res) => lancamentoController.createLancamento(req, res));

/**
 * Editar lançamento
 * PUT /lancamentos/:lancamentoId
 */
router.put('/:lancamentoId', (req, res) => lancamentoController.editLancamento(req, res));

/**
 * Deletar lançamento
 * DELETE /lancamentos/:lancamentoId
 */
router.delete('/:lancamentoId', (req, res) => lancamentoController.deleteLancamento(req, res));

/**
 * Listar lançamentos por mês
 * GET /lancamentos/mes/:carteiraId?month=YYYY-MM&tag=...&cartao=...&categoria=...&conferido=true/false&search=...
 */
router.get('/mes/:carteiraId', (req, res) => lancamentoController.getLancamentosPorMes(req, res));

/**
 * Obter agregações mensais
 * GET /lancamentos/agregacoes/:carteiraId?month=YYYY-MM
 */
router.get('/agregacoes/:carteiraId', (req, res) => lancamentoController.getAgregacoesMensais(req, res));

/**
 * Obter lançamento por ID
 * GET /lancamentos/:lancamentoId
 */
router.get('/:lancamentoId', (req, res) => lancamentoController.getLancamentoById(req, res));

module.exports = router;
