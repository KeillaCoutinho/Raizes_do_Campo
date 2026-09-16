const produtoModel = require('../models/produtoModel');


// Função para listar todos os produtos
// Pode ser utilizada no catálogo público
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


// Função para listar somente os produtos do produtor logado
async function listarMeusProdutos(req, res) {
    try {
        // Verifica se existe um usuário logado
        if (!req.session.usuarioId) {
            return res.status(401).json({
                erro: 'Você precisa estar logado para visualizar seus produtos'
            });
        }

        // Verifica se o usuário logado é um produtor
        if (req.session.tipoUsuario !== 'produtor') {
            return res.status(403).json({
                erro: 'Apenas produtores podem visualizar seus produtos'
            });
        }

        const id_produtor = req.session.usuarioId;

        const produtos =
            await produtoModel.buscarProdutosPorProdutor(id_produtor);

        res.json(produtos);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao buscar seus produtos'
        });
    }
}


// Função para cadastrar produtos
async function cadastrarProduto(req, res) {
    try {
        // Verifica se existe um usuário logado
        if (!req.session.usuarioId) {
            return res.status(401).json({
                erro: 'Você precisa estar logado para cadastrar produtos'
            });
        }

        // Verifica se o usuário logado é um produtor
        if (req.session.tipoUsuario !== 'produtor') {
            return res.status(403).json({
                erro: 'Apenas produtores podem cadastrar produtos'
            });
        }

        const {
            id_categoria,
            nome,
            descricao,
            preco,
            unidade_medida,
            imagem
        } = req.body;

        // O produtor vem da sessão, não do formulário
        const id_produtor = req.session.usuarioId;

        const produto = await produtoModel.criarProduto(
            id_categoria,
            id_produtor,
            nome,
            descricao,
            preco,
            unidade_medida,
            imagem
        );

        res.status(201).json(produto);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao cadastrar produto'
        });
    }
}


// Função para atualizar produtos
async function atualizarProduto(req, res) {
    try {
        // Verifica se existe um usuário logado
        if (!req.session.usuarioId) {
            return res.status(401).json({
                erro: 'Você precisa estar logado para atualizar produtos'
            });
        }

        // Verifica se o usuário logado é um produtor
        if (req.session.tipoUsuario !== 'produtor') {
            return res.status(403).json({
                erro: 'Apenas produtores podem atualizar produtos'
            });
        }

        const { id } = req.params;

        const {
            id_categoria,
            nome,
            descricao,
            preco,
            unidade_medida,
            imagem
        } = req.body;

        const id_produtor = req.session.usuarioId;

        const produto = await produtoModel.atualizarProduto(
            id,
            id_categoria,
            nome,
            descricao,
            preco,
            unidade_medida,
            imagem,
            id_produtor
        );

        if (!produto) {
            return res.status(404).json({
                erro: 'Produto não encontrado ou não pertence a este produtor'
            });
        }

        res.json(produto);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao atualizar produto'
        });
    }
}


// Função para deletar produtos
async function deletarProduto(req, res) {
    try {
        // Verifica se existe um usuário logado
        if (!req.session.usuarioId) {
            return res.status(401).json({
                erro: 'Você precisa estar logado para excluir produtos'
            });
        }

        // Verifica se o usuário logado é um produtor
        if (req.session.tipoUsuario !== 'produtor') {
            return res.status(403).json({
                erro: 'Apenas produtores podem excluir produtos'
            });
        }

        const { id } = req.params;

        const id_produtor = req.session.usuarioId;

        const produto =
            await produtoModel.deletarProduto(id, id_produtor);

        if (!produto) {
            return res.status(404).json({
                erro: 'Produto não encontrado ou não pertence a este produtor'
            });
        }

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
    listarMeusProdutos,
    cadastrarProduto,
    atualizarProduto,
    deletarProduto
};