const express = require('express');
const router = express.Router();
const CategoriaController = require('../controllers/CategoriaController');

const categoriaController = new CategoriaController();

router.get('/getCategorias', categoriaController.getCategoriasDefault.bind(categoriaController));
router.get('/getCategoriasByWalletId/:carteiraId', categoriaController.getCategorias.bind(categoriaController));
router.post('/createCategorias/:carteiraId', categoriaController.createCategorias.bind(categoriaController));

module.exports = router;
