const express = require('express');
const router = express.Router();
const ReceitaController = require('../controllers/ReceitaController');

const receitaController = new ReceitaController();

router.get('/:carteiraId', receitaController.getReceitas.bind(receitaController));
router.get('/getById/:carteiraId', receitaController.getReceitaById.bind(receitaController));
router.get('/getValorReceitaMensal/:carteiraId', receitaController.getValorReceitaMensal.bind(receitaController));
router.post('/createReceita/', receitaController.createReceita.bind(receitaController));
router.put('/editReceita/:carteiraId', receitaController.editReceita.bind(receitaController));
router.delete('/deleteReceita/:carteiraId', receitaController.deleteReceita.bind(receitaController));

module.exports = router;