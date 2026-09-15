require('dotenv').config({
    path: require('path').resolve(__dirname, '../.env')
});

const path = require('path');
const express = require('express');
const pool = require('./config/database');
const cors = require('cors');

const produtoRoutes = require('./routes/produtoRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const contatoRoutes = require('./routes/contatoRoutes');
const consumidorRoutes = require('./routes/consumidorRoutes');
const produtorRoutes = require('./routes/produtorRoutes');

const session = require('express-session');

const app = express();

const PORT = process.env.PORT || 3000;
const frontendUrl = process.env.FRONTEND_URL;

app.use(express.json({ limit: '10mb' }));

app.use(cors({
    origin: frontendUrl || true,
    credentials: true
}));

if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

app.use(session({
    secret: process.env.SESSION_SECRET || 'raizes-do-campo-secret-local',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
}));

app.use(produtoRoutes);
app.use(categoriaRoutes);
app.use(contatoRoutes);
app.use(consumidorRoutes);
app.use(produtorRoutes);

app.use(express.static(path.resolve(__dirname, '..')));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'index.html'));
});

app.get('/teste-banco', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM produto;');

        res.json({
            mensagem: 'Banco conectado com sucesso! 🌱',
            produtos: resultado.rows
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao conectar com o banco'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});