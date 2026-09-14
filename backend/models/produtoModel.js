const pool = require('../config/database');

//função para buscar produtos
async function buscarProdutos() {
    const resultado = await pool.query('SELECT * FROM produto;');

    return resultado.rows;
}

//função para criar produtos
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

//função para atualizar produtos
async function atualizarProduto(id_produto, id_categoria, nome, descricao, preco, unidade_medida) {
    const resultado = await pool.query(
        `UPDATE produto
        SET id_categoria = $1,
            nome = $2,
            descricao = $3,
            preco = $4,
            unidade_medida = $5
        WHERE id_produto = $6
        RETURNING *;`,
        [id_categoria, nome, descricao, preco, unidade_medida, id_produto]
    );

    return resultado.rows[0];
}

//função para deletar produtos
async function deletarProduto(id_produto) {
    const resultado = await pool.query(
        `DELETE FROM produto
        WHERE id_produto = $1
        RETURNING *;`,
        [id_produto]
    );

    return resultado.rows[0];
}

module.exports = {
    buscarProdutos,
    criarProduto,
    atualizarProduto,
    deletarProduto
};