const produtorModel = require('../models/produtorModel');
const bcrypt = require('bcrypt');

async function cadastrarProdutor(req, res) {

    try {

        const {
            nome,
            email,
            telefone,
            tipo_produtor,
            senha
        } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({
                erro: 'Nome, email e senha são obrigatórios'
            });
        }

        const produtorExistente =
            await produtorModel.buscarProdutorPorEmail(email);

        if (produtorExistente) {
            return res.status(409).json({
                erro: 'Este email já está cadastrado'
            });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const produtor = await produtorModel.criarProdutor(
            1,
            nome,
            email,
            telefone,
            tipo_produtor,
            senhaHash
        );

        res.status(201).json({
            mensagem: 'Produtor cadastrado com sucesso!',
            produtor
        });

    } catch (erro) {

        console.error("ERRO REAL AO CADASTRAR PRODUTOR:", erro);

        res.status(500).json({
            erro: erro.message
        });
    }
}

module.exports = {
    cadastrarProdutor
};