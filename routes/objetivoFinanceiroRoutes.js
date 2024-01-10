const express = require('express');
const router = express.Router();
const ObjetivoFinanceiroController = require('../controllers/ObjetivoFinanceiroController');

const objetivoFinanceiroController = new ObjetivoFinanceiroController();

router.post('/createObjetivoFinanceiro/:usuarioId', objetivoFinanceiroController.createObjetivoFinanceiro.bind(objetivoFinanceiroController));

module.exports = router;