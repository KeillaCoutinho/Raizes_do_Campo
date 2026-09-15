const express = require('express');

const router = express.Router();

router.post('/contato', (req, res) => {
    const { nome, email, mensagem } = req.body;

    const erros = [];

    // Validação do nome
    if (
        !nome ||
        typeof nome !== 'string' ||
        nome.trim() === ''
    ) {
        erros.push('O nome é obrigatório.');
    } else if (nome.trim().length < 3) {
        erros.push('O nome deve ter pelo menos 3 caracteres.');
    }

    // Validação do e-mail
    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
        !email ||
        typeof email !== 'string' ||
        email.trim() === ''
    ) {
        erros.push('O e-mail é obrigatório.');
    } else if (!formatoEmail.test(email.trim())) {
        erros.push('Digite um e-mail válido.');
    }

    // Validação da mensagem
    if (
        !mensagem ||
        typeof mensagem !== 'string' ||
        mensagem.trim() === ''
    ) {
        erros.push('A mensagem é obrigatória.');
    } else if (mensagem.trim().length < 10) {
        erros.push('A mensagem deve ter pelo menos 10 caracteres.');
    }

    // Se houver erros, retorna status HTTP 400
    if (erros.length > 0) {
        return res.status(400).json({
            sucesso: false,
            erros: erros
        });
    }

    // Se os dados forem válidos
    return res.status(200).json({
        sucesso: true,
        mensagem: 'Dados do formulário validados com sucesso!'
    });
});

module.exports = router;