const express = require('express');
const router = express.Router();
const CategoriaController = require('../controllers/CategoriaController');

const categoriaController = new CategoriaController();

router.get('/getCategoriasByWalletId/:carteiraId', categoriaController.getCategorias.bind(categoriaController));
router.post('/createCategoria/:carteiraId', categoriaController.createCategoria.bind(categoriaController));
router.post('/createCategorias/:carteiraId', categoriaController.createCategorias.bind(categoriaController));
router.put('/editCategoria/:carteiraId', categoriaController.editCategoria);
router.delete('/deleteCategoria/:carteiraId', categoriaController.deleteCategoria.bind(categoriaController));

module.exports = router;