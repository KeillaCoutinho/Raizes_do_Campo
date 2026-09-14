const produtoModel = require('../models/produtoModel');

//função para listar produtos
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

//função para cadastrar produtos
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

//função para atualizar produtos
async function atualizarProduto(req, res) {
    try {
        const { id } = req.params;

        const {
            id_categoria,
            nome,
            descricao,
            preco,
            unidade_medida
        } = req.body;

        const produto = await produtoModel.atualizarProduto(
            id,
            id_categoria,
            nome,
            descricao,
            preco,
            unidade_medida
        );

        res.json(produto);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao atualizar produto'
        });
    }
}

//função para deletar produtos
async function deletarProduto(req, res) {
    try {
        const { id } = req.params;

        const produto = await produtoModel.deletarProduto(id);

        res.json(produto);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao deletar produto'
        });
    }
}

module.exports = {
    listarProdutos,
    cadastrarProduto,
    atualizarProduto,
    deletarProduto

};