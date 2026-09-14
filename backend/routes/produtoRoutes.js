const express = require('express');
const produtoController = require('../controllers/produtoControllers');

const router = express.Router();

router.get('/produtos', produtoController.listarProdutos);
router.post('/produtos', produtoController.cadastrarProduto);

module.exports = router;