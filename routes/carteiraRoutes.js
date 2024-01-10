const express = require('express');
const router = express.Router();
const CarteiraController = require('../controllers/CarteiraController');

const carteiraController = new CarteiraController();

router.get('/getCarteiraByUserId/:usuarioId', carteiraController.getCarteiraByUserId.bind(carteiraController));
router.post('/createCarteira/:usuarioId', carteiraController.createCarteira.bind(carteiraController));

module.exports = router;