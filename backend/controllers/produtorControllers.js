const produtorModel = require('../models/produtorModel');
const bcrypt = require('bcrypt');

function validarDadosExtra(dadosExtra) {
    if (dadosExtra === undefined) {
        return {};
    }

    if (
        dadosExtra === null ||
        typeof dadosExtra !== 'object' ||
        Array.isArray(dadosExtra)
    ) {
        return null;
    }

    return dadosExtra;
}

async function cadastrarProdutor(req, res) {

    try {

        const {
            nome,
            email,
            telefone,
            tipo_produtor,
            senha,
            dados_extra
        } = req.body;

        const dadosExtra = validarDadosExtra(dados_extra);

        if (dadosExtra === null) {
            return res.status(400).json({
                erro: 'dados_extra deve ser um objeto JSON'
            });
        }

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
            senhaHash,
            dadosExtra
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

async function buscarProdutorPorId(req, res) {
    if (!validarSessaoProdutor(req, res)) {
        return;
    }

    if (String(req.session.usuarioId) !== String(req.params.id)) {
        return res.status(403).json({
            erro: 'Você só pode consultar o próprio perfil'
        });
    }

    try {
        const produtor = await produtorModel.buscarProdutorPorId(req.params.id);

        if (!produtor) {
            return res.status(404).json({
                erro: 'Produtor não encontrado'
            });
        }

        res.json(produtor);
    } catch (erro) {
        console.error('ERRO AO BUSCAR PRODUTOR:', erro);
        res.status(500).json({
            erro: 'Erro ao buscar produtor'
        });
    }
}

async function atualizarProdutor(req, res) {
    if (!validarSessaoProdutor(req, res)) {
        return;
    }

    const { id } = req.params;
    const { nome, email, telefone, tipo_produtor, dados_extra } = req.body;
    const dadosExtra = dados_extra === undefined
        ? null
        : validarDadosExtra(dados_extra);

    if (!nome || !email) {
        return res.status(400).json({
            erro: 'Nome e email são obrigatórios'
        });
    }

    if (dadosExtra === null && dados_extra !== undefined) {
        return res.status(400).json({
            erro: 'dados_extra deve ser um objeto JSON'
        });
    }

    if (String(req.session.usuarioId) !== String(id)) {
        return res.status(403).json({
            erro: 'Você só pode atualizar o próprio perfil'
        });
    }

    try {
        const produtor = await produtorModel.atualizarProdutor(
            id,
            nome,
            email,
            telefone,
            tipo_produtor,
            dadosExtra
        );

        if (!produtor) {
            return res.status(404).json({
                erro: 'Produtor não encontrado'
            });
        }

        res.json({
            mensagem: 'Produtor atualizado com sucesso!',
            produtor
        });
    } catch (erro) {
        console.error('ERRO AO ATUALIZAR PRODUTOR:', erro);
        res.status(500).json({
            erro: 'Erro ao atualizar produtor'
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
            total_registros: 0,
            ultima_colheita: null,
            produto: null,
            peso: null,
            valor_medio: 0
        });
    } catch (erro) {
        console.error('ERRO AO BUSCAR RESUMO DA PRODUÇÃO:', erro);
        res.status(500).json({
            erro: 'Erro ao buscar resumo da produção'
        });
    }
}

async function registrarProducao(req, res) {
    if (!validarSessaoProdutor(req, res)) {
        return;
    }

    const {
        data_colheita,
        produto,
        peso
    } = req.body;

    const pesoNumerico = Number(peso);

    if (!data_colheita || !produto || !produto.trim() ||
        !Number.isFinite(pesoNumerico) || pesoNumerico <= 0) {
        return res.status(400).json({
            erro: 'Informe a data, o produto e um peso maior que zero'
        });
    }

    try {
        await produtorModel.salvarRegistroProducao(
            req.session.usuarioId,
            data_colheita,
            produto.trim(),
            pesoNumerico
        );

        const resumo = await produtorModel.buscarResumoProducao(
            req.session.usuarioId
        );

        res.status(201).json(resumo);
    } catch (erro) {
        console.error('ERRO AO REGISTRAR PRODUÇÃO:', erro);
        res.status(500).json({
            erro: 'Erro ao registrar produção'
        });
    }
}

async function deletarProdutor(req, res) {
    try {
        const { id } = req.params;

        const produtor = await produtorModel.deletarProdutor(id);

        if (!produtor) {
            return res.status(404).json({
                erro: 'Produtor não encontrado'
            });
        }

        req.session.destroy((erro) => {
            if (erro) {
                console.error('ERRO AO ENCERRAR SESSÃO DO PRODUTOR:', erro);
            }
        });

        res.json({
            mensagem: 'Produtor deletado com sucesso!',
            produtor
        });
    } catch (erro) {
        console.error('ERRO AO DELETAR PRODUTOR:', erro);
        res.status(500).json({
            erro: 'Erro ao deletar produtor'
        });
    }
}

module.exports = {
    cadastrarProdutor,
    buscarProdutorPorId,
    atualizarProdutor,
    buscarResumoProducao,
    registrarProducao,
    deletarProdutor
};