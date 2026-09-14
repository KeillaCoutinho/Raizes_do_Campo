const produtoModel = require('../models/produtoModel');

async function listarProdutos(req, res) {
    try {
        const produtos = await produtoModel.buscarProdutos();

        res.json(produtos);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao buscar produtos'
        });
    }
}

async function cadastrarProduto(req, res) {
    try {
        const {
            id_categoria,
            nome,
            descricao,
            preco,
            unidade_medida
        } = req.body;

        const produto = await produtoModel.criarProduto(
            id_categoria,
            nome,
            descricao,
            preco,
            unidade_medida
        );

        res.status(201).json(produto);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao cadastrar produto'
        });
    }
}

module.exports = {
    listarProdutos,
    cadastrarProduto
};