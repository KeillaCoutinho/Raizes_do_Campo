const pool = require('../config/database');

async function buscarConsumidorPorEmail(email) {
    const resultado = await pool.query(
        `SELECT * FROM consumidor
         WHERE email = $1;`,
        [email]
    );

    return resultado.rows[0];
}

async function criarConsumidor(nome, email, telefone, senha) {
    const resultado = await pool.query(
        `INSERT INTO consumidor
        (nome, email, telefone, senha)
        VALUES ($1, $2, $3, $4)
        RETURNING id_consumidor, nome, email, telefone;`,
        [nome, email, telefone, senha]
    );

    return resultado.rows[0];
}

async function buscarConsumidores() {
    const resultado = await pool.query(
        `SELECT id_consumidor, nome, email, telefone
         FROM consumidor
         ORDER BY id_consumidor;`
    );

    return resultado.rows;
}

async function atualizarConsumidor(id_consumidor, nome, email, telefone) {
    const resultado = await pool.query(
        `UPDATE consumidor
         SET nome = $1,
             email = $2,
             telefone = $3
         WHERE id_consumidor = $4
         RETURNING id_consumidor, nome, email, telefone;`,
        [nome, email, telefone, id_consumidor]
    );

    return resultado.rows[0];
}

async function deletarConsumidor(id_consumidor) {
    const resultado = await pool.query(
        `DELETE FROM consumidor
         WHERE id_consumidor = $1
         RETURNING id_consumidor, nome, email, telefone;`,
        [id_consumidor]
    );

    return resultado.rows[0];
}

module.exports = {
    buscarConsumidorPorEmail,
    criarConsumidor,
    buscarConsumidores,
    atualizarConsumidor,
    deletarConsumidor   
};