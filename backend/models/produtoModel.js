const pool = require('../config/database');

async function buscarProdutos() {
    const resultado = await pool.query('SELECT * FROM produto;');

    return resultado.rows;
}

async function criarProduto(id_categoria, nome, descricao, preco, unidade_medida) {
    const resultado = await pool.query(
        `INSERT INTO produto 
        (id_categoria, nome, descricao, preco, unidade_medida)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;`,
        [id_categoria, nome, descricao, preco, unidade_medida]
    );

    return resultado.rows[0];
}

module.exports = {
    buscarProdutos,
    criarProduto
};