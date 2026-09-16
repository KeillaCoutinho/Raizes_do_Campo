const express = require('express');
const produtorController = require('../controllers/produtorControllers');

const router = express.Router();

router.post('/produtores', produtorController.cadastrarProdutor);
router.get('/producoes/resumo', produtorController.buscarResumoProducao);
router.get('/producoes/resumo-categorias', produtorController.buscarResumoProducaoPorCategoria);
router.get('/producoes', produtorController.listarProducoes);
router.post('/producoes', produtorController.registrarProducao);

module.exports = router;