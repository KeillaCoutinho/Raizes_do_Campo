const express = require('express');

const categoriaController = require('../controllers/categoriaControllers');

const router = express.Router();

//rotas
router.get('/categorias', categoriaController.listarCategorias);
router.post('/categorias', categoriaController.cadastrarCategoria);
router.put('/categorias/:id', categoriaController.atualizarCategoria);
router.delete('/categorias/:id', categoriaController.deletarCategoria);

module.exports = router;