const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

function criarTransportador() {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const secure = process.env.SMTP_SECURE === 'true' || port === 465;

    if (!host || !user || !pass) {
        throw new Error(
            'Configuração SMTP ausente. Defina SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS e EMAIL_FROM no arquivo .env.'
        );
    }

    return nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
            user,
            pass
        }
    });
}

async function enviarEmailAgradecimento(destinatario, nome = 'cliente') {
    const email = String(destinatario || '').trim();

    if (!email) {
        throw new Error('E-mail do destinatário é obrigatório.');
    }

    const nomeFormatado = String(nome || 'cliente').trim() || 'cliente';
    const transportador = criarTransportador();

    const resultado = await transportador.sendMail({
        from: process.env.EMAIL_FROM || process.env.SMTP_USER,
        to: email,
        subject: 'Agradecemos o seu contato!',
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
                <h2 style="color: #2f6f3e;">Olá, ${nomeFormatado}!</h2>
                <p>Obrigado por entrar em contato com a Raízes do Campo.</p>
                <p>Recebemos sua mensagem e, em breve, nossa equipe vai responder.</p>
                <p>Enquanto isso, agradecemos pelo interesse e pela confiança em nosso trabalho.</p>
                <br>
                <p>Atenciosamente,<br>Equipe Raízes do Campo</p>
            </div>
        `
    });

    return {
        ok: true,
        destinatario: email,
        assunto: 'Agradecemos o seu contato!',
        mensagemId: resultado.messageId,
        modo: 'smtp'
    };
}

router.post('/contato', async (req, res) => {
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

    try {
        await enviarEmailAgradecimento(email, nome);

        return res.status(200).json({
            sucesso: true,
            mensagem: 'Mensagem enviada com sucesso! Em breve entraremos em contato.'
        });
    } catch (erro) {
        console.error('Erro ao enviar e-mail de agradecimento:', erro);

        return res.status(500).json({
            sucesso: false,
            erros: ['Não foi possível enviar a confirmação do contato. Tente novamente mais tarde.']
        });
    }
});

module.exports = router;
module.exports.enviarEmailAgradecimento = enviarEmailAgradecimento;