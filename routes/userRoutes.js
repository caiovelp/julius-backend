const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController');

const usuarioController = new UsuarioController();

router.get('/getUserById/:id', usuarioController.getUserById.bind(usuarioController));

module.exports = router;
