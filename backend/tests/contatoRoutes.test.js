const test = require('node:test');
const assert = require('node:assert/strict');
const nodemailer = require('nodemailer');

const { enviarEmailAgradecimento } = require('../routes/contatoRoutes');

const smtpOriginal = {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
  secure: process.env.SMTP_SECURE,
  from: process.env.EMAIL_FROM
};

function restaurarVariaveisSmtp() {
  if (smtpOriginal.host === undefined) delete process.env.SMTP_HOST; else process.env.SMTP_HOST = smtpOriginal.host;
  if (smtpOriginal.port === undefined) delete process.env.SMTP_PORT; else process.env.SMTP_PORT = smtpOriginal.port;
  if (smtpOriginal.user === undefined) delete process.env.SMTP_USER; else process.env.SMTP_USER = smtpOriginal.user;
  if (smtpOriginal.pass === undefined) delete process.env.SMTP_PASS; else process.env.SMTP_PASS = smtpOriginal.pass;
  if (smtpOriginal.secure === undefined) delete process.env.SMTP_SECURE; else process.env.SMTP_SECURE = smtpOriginal.secure;
  if (smtpOriginal.from === undefined) delete process.env.EMAIL_FROM; else process.env.EMAIL_FROM = smtpOriginal.from;
}

test.afterEach(() => {
  restaurarVariaveisSmtp();
  nodemailer.createTransport = originalCreateTransport;
});

const originalCreateTransport = nodemailer.createTransport;

test('deve enviar um e-mail de agradecimento para o e-mail informado pelo usuário', async () => {
  process.env.SMTP_HOST = 'smtp.test.com';
  process.env.SMTP_PORT = '587';
  process.env.SMTP_USER = 'teste@empresa.com';
  process.env.SMTP_PASS = 'senha-secreta';
  process.env.EMAIL_FROM = 'teste@empresa.com';

  nodemailer.createTransport = () => ({
    sendMail: async (opcoes) => {
      assert.equal(opcoes.to, 'usuario@email.com');
      assert.match(opcoes.subject, /agradecemos|contato/i);
      return { messageId: 'abc-123' };
    }
  });

  const resultado = await enviarEmailAgradecimento('usuario@email.com', 'Maria');

  assert.equal(resultado.ok, true);
  assert.equal(resultado.destinatario, 'usuario@email.com');
  assert.match(resultado.assunto, /agradecemos|contato|mensagem/i);
});

test('deve falhar com mensagem clara quando o SMTP não está configurado', async () => {
  delete process.env.SMTP_HOST;
  delete process.env.SMTP_PORT;
  delete process.env.SMTP_USER;
  delete process.env.SMTP_PASS;
  delete process.env.EMAIL_FROM;

  await assert.rejects(
    () => enviarEmailAgradecimento('usuario@email.com', 'Maria'),
    /Configuração SMTP ausente/i
  );
});
