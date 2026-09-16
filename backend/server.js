require('dotenv').config({
    path: require('path').resolve(__dirname, '../.env')
});

const express = require('express');
const pool = require('./config/database');
const cors = require('cors');
const path = require('path');

const produtoRoutes = require('./routes/produtoRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const contatoRoutes = require('./routes/contatoRoutes');
const consumidorRoutes = require('./routes/consumidorRoutes');
const produtorRoutes = require('./routes/produtorRoutes');

const session = require('express-session');

const app = express();

const PORT = Number(process.env.PORT) || 3000;
app.use(express.json());

app.use(cors({
    origin: (origem, callback) => {
        const origensPermitidas = [
            process.env.FRONTEND_URL || 'https://raizes-do-campo.onrender.com',
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://localhost:5500',
            'http://127.0.0.1:5500'
        ].filter(Boolean);

        if (!origem || origensPermitidas.includes(origem)) {
            return callback(null, true);
        }

        return callback(new Error('Origem não permitida pelo CORS'));
    },
    credentials: true
}));

app.use(session({
    secret: 'raizes-do-campo-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 // a sessão irá durar 1 hora
    }
}));

app.use(express.static(path.resolve(__dirname, '..')));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../index.html'));
});

app.use(produtoRoutes);
app.use(categoriaRoutes);
app.use(contatoRoutes);
app.use(consumidorRoutes);
app.use(produtorRoutes);

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
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});