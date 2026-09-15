const express = require('express');
const produtoController = require('../controllers/produtoControllers');

const router = express.Router();

//rotas
router.get('/produtos', produtoController.listarProdutos);
router.post('/produtos', produtoController.cadastrarProduto);
router.put('/produtos/:id', produtoController.atualizarProduto);
router.delete('/produtos/:id', produtoController.deletarProduto);
router.get('/meus-produtos', produtoController.listarMeusProdutos);

module.exports = router;