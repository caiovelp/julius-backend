const express = require('express');
const router = express.Router();
const LancamentoController = require('../controllers/LancamentoController');

const lancamentoController = new LancamentoController();

router.get('/mes/:carteiraId', (req, res) => lancamentoController.getLancamentosPorMes(req, res));
router.post('/:carteiraId', (req, res) => lancamentoController.createLancamento(req, res));
router.put('/:lancamentoId', (req, res) => lancamentoController.editLancamento(req, res));
router.delete('/:lancamentoId', (req, res) => lancamentoController.deleteLancamento(req, res));

module.exports = router;
