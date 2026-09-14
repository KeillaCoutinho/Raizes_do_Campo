const categoriaModel = require('../models/categoriaModel');

async function listarCategorias(req, res) {
    try {
        const categorias = await categoriaModel.buscarCategorias();

        res.json(categorias);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao buscar categorias'
        });
    }
}

//função para cadastrar uma nova categoria
async function cadastrarCategoria(req, res) {
    try {
        const { nome, descricao } = req.body;

        const categoria = await categoriaModel.criarCategoria(
            nome,
            descricao
        );

        res.status(201).json(categoria);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao cadastrar categoria'
        });
    }
}

//função para atualizar uma categoria existente
async function atualizarCategoria(req, res) {
    try {
        const { id } = req.params;
        const { nome, descricao } = req.body;

        const categoria = await categoriaModel.atualizarCategoria(
            id,
            nome,
            descricao
        );

        res.json(categoria);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao atualizar categoria'
        });
    }
}

//função para deletar uma categoria existente
async function deletarCategoria(req, res) {
    try {
        const { id } = req.params;

        const categoria = await categoriaModel.deletarCategoria(id);

        res.json(categoria);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao deletar categoria'
        });
    }
}

module.exports = {
    listarCategorias,
    cadastrarCategoria,
    atualizarCategoria,
    deletarCategoria
};