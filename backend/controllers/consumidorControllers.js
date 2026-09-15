const consumidorModel = require('../models/consumidorModel');
const produtorModel = require('../models/produtorModel');

//para as senhas serem criptografadas
const bcrypt = require('bcrypt');

async function cadastrarConsumidor(req, res) {
    try {
        const {
            nome,
            email,
            telefone,
            senha
        } = req.body;

        // Verifica se os campos obrigatórios foram preenchidos
        if (!nome || !email || !senha) {
            return res.status(400).json({
                erro: 'Nome, email e senha são obrigatórios'
            });
        }

        // Verifica se já existe um consumidor com esse email
        const consumidorExistente =
            await consumidorModel.buscarConsumidorPorEmail(email);

        if (consumidorExistente) {
            return res.status(409).json({
                erro: 'Este email já está cadastrado'
            });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const consumidor = await consumidorModel.criarConsumidor(
            nome,
            email,
            telefone,
            senhaHash
        );

        res.status(201).json({
            mensagem: 'Consumidor cadastrado com sucesso!',
            consumidor
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao cadastrar consumidor'
        });
    }
}

async function fazerLogin(req, res) {
    try {

        const { email, senha, tipoUsuario } = req.body;

        // Verifica se email, senha e tipo de usuário foram informados
        if (!email || !senha || !tipoUsuario) {
            return res.status(400).json({
                erro: 'Email, senha e tipo de usuário são obrigatórios'
            });
        }

        let usuario;
        let tipo;

        // Se for consumidor, procura na tabela consumidor
        if (tipoUsuario === 'consumidor') {

            usuario = await consumidorModel.buscarConsumidorPorEmail(email);
            tipo = 'consumidor';

        // Se for produtor, procura na tabela produtor
        } else if (tipoUsuario === 'produtor') {

            usuario = await produtorModel.buscarProdutorPorEmail(email);
            tipo = 'produtor';

        } else {

            return res.status(400).json({
                erro: 'Tipo de usuário inválido'
            });
        }

        // Se não encontrou o usuário
        if (!usuario) {
            return res.status(401).json({
                erro: 'Email ou senha incorretos'
            });
        }

        // Compara a senha informada com a senha criptografada no banco
        const senhaCorreta = await bcrypt.compare(
            senha,
            usuario.senha
        );

        // Se a senha estiver errada
        if (!senhaCorreta) {
            return res.status(401).json({
                erro: 'Email ou senha incorretos'
            });
        }

        // Guarda na Session o ID e o tipo do usuário
        if (tipo === 'consumidor') {

            req.session.usuarioId = usuario.id_consumidor;

        } else {

            req.session.usuarioId = usuario.id_produtor;
        }

        req.session.tipoUsuario = tipo;

        // Login realizado com sucesso
        res.json({
            mensagem: 'Login realizado com sucesso!',
            tipoUsuario: tipo,
            usuario: {
                id: tipo === 'consumidor'
                    ? usuario.id_consumidor
                    : usuario.id_produtor,
                nome: usuario.nome,
                email: usuario.email,
                telefone: usuario.telefone
            }
        });

    } catch (erro) {

        console.error("ERRO AO REALIZAR LOGIN:", erro);

        res.status(500).json({
            erro: 'Erro ao realizar login'
        });
    }
}

async function listarConsumidores(req, res) {
    try {
        const consumidores = await consumidorModel.buscarConsumidores();

        res.json(consumidores);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            erro: 'Erro ao buscar consumidores'
        });
    }
}


async function atualizarConsumidor(req, res) {
    try {
        const { id } = req.params;
        const { nome, email, telefone } = req.body;

        if (!nome || !email) {
            return res.status(400).json({
                erro: 'Nome e email são obrigatórios'
            });
        }

        const consumidor =
            await consumidorModel.atualizarConsumidor(
                id,
                nome,
                email,
                telefone
            );

        if (!consumidor) {
            return res.status(404).json({
                erro: 'Consumidor não encontrado'
            });
        }

        res.json({
            mensagem: 'Consumidor atualizado com sucesso!',
            consumidor
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            erro: 'Erro ao atualizar consumidor'
        });
    }
}


async function deletarConsumidor(req, res) {
    try {
        const { id } = req.params;

        const consumidor =
            await consumidorModel.deletarConsumidor(id);

        if (!consumidor) {
            return res.status(404).json({
                erro: 'Consumidor não encontrado'
            });
        }

        res.json({
            mensagem: 'Consumidor deletado com sucesso!',
            consumidor
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            erro: 'Erro ao deletar consumidor'
        });
    }
}

async function buscarPerfil(req, res) {
    try {
        // Verifica se existe alguém logado
        if (!req.session.usuarioId) {
            return res.status(401).json({
                erro: 'Nenhum usuário está logado'
            });
        }

        const tipoUsuario = req.session.tipoUsuario;
        let usuario;

        // Busca os dados na tabela correta
        if (tipoUsuario === 'consumidor') {
            usuario = await consumidorModel.buscarConsumidorPorId(
                req.session.usuarioId
            );
        } 
        else if (tipoUsuario === 'produtor') {
            usuario = await produtorModel.buscarProdutorPorId(
                req.session.usuarioId
            );
        } 
        else {
            return res.status(401).json({
                erro: 'Tipo de usuário inválido ou sessão expirada'
            });
        }

        if (!usuario) {
            return res.status(404).json({
                erro: 'Usuário não encontrado'
            });
        }

        // Retorna os dados do usuário + o tipo
        res.json({
            ...usuario,
            tipoUsuario: tipoUsuario
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao buscar perfil'
        });
    }
}

module.exports = {
    cadastrarConsumidor,
    fazerLogin,
    listarConsumidores,
    atualizarConsumidor,
    deletarConsumidor,
    buscarPerfil
};