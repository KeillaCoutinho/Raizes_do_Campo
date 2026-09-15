const consumidorModel = require('../models/consumidorModel');
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

//função para fazer o login
async function fazerLogin(req, res) {
    try {
        const { email, senha } = req.body;

        // Verifica se email e senha foram informados
        if (!email || !senha) {
            return res.status(400).json({
                erro: 'Email e senha são obrigatórios'
            });
        }

        // Procura o consumidor pelo email
        const consumidor =
            await consumidorModel.buscarConsumidorPorEmail(email);

        // Se não encontrou o email
        if (!consumidor) {
            return res.status(401).json({
                erro: 'Email ou senha incorretos'
            });
        }

        // Compara a senha informada com o hash salvo no banco
        const senhaCorreta =
            await bcrypt.compare(senha, consumidor.senha);

        // Se a senha estiver errada
        if (!senhaCorreta) {
            return res.status(401).json({
                erro: 'Email ou senha incorretos'
            });
        }

        // Guarda o ID do usuário na Session
        req.session.usuarioId = consumidor.id_consumidor;

        // Login realizado com sucesso
        res.json({
            mensagem: 'Login realizado com sucesso!',
            consumidor: {
                id_consumidor: consumidor.id_consumidor,
                nome: consumidor.nome,
                email: consumidor.email,
                telefone: consumidor.telefone
            }
        });

    } catch (erro) {
        console.error(erro);

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

module.exports = {
    cadastrarConsumidor,
    fazerLogin,
    listarConsumidores,
    atualizarConsumidor,
    deletarConsumidor
};