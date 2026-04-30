const express = require('express');
const router = express.Router();
const DivisaoGrupoController = require('../controllers/DivisaoGrupoController');

const divisaoGrupoController = new DivisaoGrupoController();

/**
 * Criar novo grupo de divisão
 * POST /divisao-grupos/:carteiraId
 */
router.post('/:carteiraId', (req, res) => divisaoGrupoController.createGrupo(req, res));

/**
 * Obter grupo por ID
 * GET /divisao-grupos/:grupoId
 */
router.get('/:grupoId', (req, res) => divisaoGrupoController.getGrupoById(req, res));

/**
 * Listar grupos de uma carteira
 * GET /divisao-grupos/carteira/:carteiraId
 */
router.get('/carteira/:carteiraId', (req, res) => divisaoGrupoController.getGruposPorCarteira(req, res));

/**
 * Vincular lançamento a um grupo
 * POST /divisao-grupos/:grupoId/vincular/:lancamentoId
 */
router.post('/:grupoId/vincular/:lancamentoId', (req, res) => divisaoGrupoController.vincularLancamento(req, res));

/**
 * Desvincular lançamento de um grupo
 * DELETE /divisao-grupos/desvincular/:lancamentoId
 */
router.delete('/desvincular/:lancamentoId', (req, res) => divisaoGrupoController.desvincularLancamento(req, res));

/**
 * Deletar grupo
 * DELETE /divisao-grupos/:grupoId
 */
router.delete('/:grupoId', (req, res) => divisaoGrupoController.deleteGrupo(req, res));

/**
 * Obter lançamentos de um grupo
 * GET /divisao-grupos/:grupoId/lancamentos
 */
router.get('/:grupoId/lancamentos', (req, res) => divisaoGrupoController.getLancamentosDoGrupo(req, res));

module.exports = router;
