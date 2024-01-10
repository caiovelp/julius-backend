const express = require('express');
const router = express.Router();
const BancoController = require('../controllers/BancoController');

const bancoController = new BancoController();

router.get('/getBancoById/:id', bancoController.getBancoById.bind(bancoController));
router.get('/getBancoGroupByUserId/:usuarioId', bancoController.getBancoGroupByUserId.bind(bancoController));
router.post('/createBanco/:usuarioId', bancoController.createBanco.bind(bancoController));

module.exports = router;