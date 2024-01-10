const express = require('express');
const router = express.Router();
const DespesaController = require('../controllers/DespesaController');

const despesaController = new DespesaController();

router.get('/:carteiraId', despesaController.getDespesas.bind(despesaController));
router.get('/getById/:carteiraId', despesaController.getDespesaById.bind(despesaController));
router.get('/getValorDespesaMensal/:carteiraId', despesaController.getValorDespesaMensal.bind(despesaController));
router.get('/getDespesasMensaisList/:carteiraId', despesaController.getDespesasMensais.bind(despesaController));
router.get('/getDespesasMensaisAgrupadasPorCategoria/:carteiraId', despesaController.getDespesasMensaisGroupByCategory.bind(despesaController));
router.post('/createDespesa/:carteiraId', despesaController.createDespesa.bind(despesaController));
router.put('/editDespesa/:carteiraId', despesaController.editDespesa.bind(despesaController));
router.delete('/deleteDespesa/:carteiraId', despesaController.deleteDespesa.bind(despesaController));

module.exports = router;