const pool = require('../config/database');

async function buscarProdutorPorEmail(email) {
    const resultado = await pool.query(
        `SELECT * FROM produtor
         WHERE email = $1;`,
        [email]
    );

    return resultado.rows[0];
}

async function buscarProdutorPorId(id_produtor) {
    const resultado = await pool.query(
        `SELECT id_produtor, id_localizacao, nome, email, telefone, tipo_produtor
         FROM produtor
         WHERE id_produtor = $1;`,
        [id_produtor]
    );

    return resultado.rows[0];
}

async function criarProdutor(
    id_localizacao,
    nome,
    email,
    telefone,
    tipo_produtor,
    senha
) {
    const resultado = await pool.query(
        `INSERT INTO produtor
        (id_localizacao, nome, email, telefone, tipo_produtor, senha)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id_produtor, id_localizacao, nome, email, telefone, tipo_produtor;`,
        [
            id_localizacao,
            nome,
            email,
            telefone,
            tipo_produtor,
            senha
        ]
    );

    return resultado.rows[0];
}


module.exports = {
    buscarProdutorPorEmail,
    buscarProdutorPorId,
    criarProdutor
};