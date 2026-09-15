const express = require('express');
const produtorController = require('../controllers/produtorControllers');

const router = express.Router();

router.post('/produtores', produtorController.cadastrarProdutor);
router.get('/resumo-producao', produtorController.buscarResumoProducao);
router.post('/resumo-producao', produtorController.registrarProducao);

module.exports = router;