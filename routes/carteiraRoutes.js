const express = require('express');
const router = express.Router();
const CarteiraController = require('../controllers/CarteiraController');

const carteiraController = new CarteiraController();

router.get('/', carteiraController.getCarteiras.bind(carteiraController));
router.get('/getCarteiraByUserId/:usuarioId', carteiraController.getCarteiraByUserId.bind(carteiraController));

module.exports = router;
