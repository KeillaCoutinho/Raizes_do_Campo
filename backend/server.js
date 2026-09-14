const express = require('express');
const pool = require('./config/database');
const produtoRoutes = require('./routes/produtoRoutes');

const app = express();

const PORT = 3000;
app.use(express.json());

app.use(produtoRoutes);

app.get('/', (req, res) => {
    res.send('Backend do Raízes do Campo funcionando! 🌱');
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
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});