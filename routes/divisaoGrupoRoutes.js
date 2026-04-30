const express = require('express');
const router = express.Router();
const DivisaoGrupoController = require('../controllers/DivisaoGrupoController');

const divisaoGrupoController = new DivisaoGrupoController();

// Rotas específicas antes das com parâmetro genérico
router.get('/carteira/:carteiraId', (req, res) => divisaoGrupoController.getGruposPorCarteira(req, res));
router.delete('/desvincular/:lancamentoId', (req, res) => divisaoGrupoController.desvincularLancamento(req, res));

router.post('/:carteiraId', (req, res) => divisaoGrupoController.createGrupo(req, res));
router.post('/:grupoId/vincular/:lancamentoId', (req, res) => divisaoGrupoController.vincularLancamento(req, res));

module.exports = router;
