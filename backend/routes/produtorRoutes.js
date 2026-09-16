const express = require('express');
const produtorController = require('../controllers/produtorControllers');

const router = express.Router();

router.post('/produtores', produtorController.cadastrarProdutor);
router.get('/produtores/:id', produtorController.buscarProdutorPorId);
router.put('/produtores/:id', produtorController.atualizarProdutor);
router.get('/resumo-producao', produtorController.buscarResumoProducao);
router.post('/resumo-producao', produtorController.registrarProducao);
router.delete('/produtores/:id', produtorController.deletarProdutor);

module.exports = router;