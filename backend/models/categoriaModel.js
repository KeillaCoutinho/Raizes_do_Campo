const pool = require('../config/database');

async function buscarCategorias() {
    const resultado = await pool.query('SELECT * FROM categoria;');

    return resultado.rows;
}

//função para criar uma nova categoria
async function criarCategoria(nome, descricao) {
    const resultado = await pool.query(
        `INSERT INTO categoria
        (nome, descricao)
        VALUES ($1, $2)
        RETURNING *;`,
        [nome, descricao]
    );

    return resultado.rows[0];
}

//função para atualizar uma categoria existente
async function atualizarCategoria(id_categoria, nome, descricao) {
    const resultado = await pool.query(
        `UPDATE categoria
        SET nome = $1,
            descricao = $2
        WHERE id_categoria = $3
        RETURNING *;`,
        [nome, descricao, id_categoria]
    );

    return resultado.rows[0];
}

//funcao para deletar uma categoria existente
async function deletarCategoria(id_categoria) {
    const resultado = await pool.query(
        `DELETE FROM categoria
        WHERE id_categoria = $1
        RETURNING *;`,
        [id_categoria]
    );

    return resultado.rows[0];
}

module.exports = {
    buscarCategorias,
    criarCategoria,
    atualizarCategoria,
    deletarCategoria
};