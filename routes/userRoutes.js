const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController');

const usuarioController = new UsuarioController();

router.get('/getUserByUsername', usuarioController.getUserByUsername.bind(usuarioController));
router.get('/getUserById/:id', usuarioController.getUserById.bind(usuarioController));
router.post('/createUser', usuarioController.createUser.bind(usuarioController));
router.post('/loginUser', usuarioController.postUser.bind(usuarioController));
router.put('/editUser/:id', usuarioController.editUser.bind(usuarioController));
router.delete('/deleteUser/:id', usuarioController.deleteUser.bind(usuarioController));

module.exports = router;