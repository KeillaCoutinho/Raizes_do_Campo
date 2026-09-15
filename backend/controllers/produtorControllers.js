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

function validarSessaoProdutor(req, res) {
    if (!req.session.usuarioId) {
        res.status(401).json({
            erro: 'Você precisa estar logado para acessar o resumo da produção'
        });
        return false;
    }

    if (req.session.tipoUsuario !== 'produtor') {
        res.status(403).json({
            erro: 'Apenas produtores podem acessar o resumo da produção'
        });
        return false;
    }

    return true;
}

async function buscarResumoProducao(req, res) {
    if (!validarSessaoProdutor(req, res)) {
        return;
    }

    try {
        const resumo = await produtorModel.buscarResumoProducao(
            req.session.usuarioId
        );

        res.json(resumo || {
            ultima_colheita: null,
            total_registros: 0,
            unidade_mais_utilizada: null
        });
    } catch (erro) {
        console.error('ERRO AO BUSCAR RESUMO DA PRODUÇÃO:', erro);
        res.status(500).json({
            erro: 'Erro ao buscar resumo da produção'
        });
    }
}

async function atualizarResumoProducao(req, res) {
    if (!validarSessaoProdutor(req, res)) {
        return;
    }

    const {
        ultima_colheita,
        total_registros,
        unidade_mais_utilizada
    } = req.body;

    const total = Number(total_registros);

    if (!Number.isInteger(total) || total < 0) {
        return res.status(400).json({
            erro: 'O total de registros deve ser um número inteiro igual ou maior que zero'
        });
    }

    try {
        const resumo = await produtorModel.salvarResumoProducao(
            req.session.usuarioId,
            ultima_colheita,
            total,
            unidade_mais_utilizada
        );

        res.json(resumo);
    } catch (erro) {
        console.error('ERRO AO SALVAR RESUMO DA PRODUÇÃO:', erro);
        res.status(500).json({
            erro: 'Erro ao salvar resumo da produção'
        });
    }
}

module.exports = {
    cadastrarProdutor,
    buscarResumoProducao,
    atualizarResumoProducao
};