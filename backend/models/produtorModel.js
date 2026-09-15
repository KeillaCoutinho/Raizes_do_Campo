const pool = require('../config/database');

async function buscarProdutorPorEmail(email) {
    const resultado = await pool.query(
        `SELECT * FROM produtor
         WHERE email = $1;`,
        [email]
    );

    return resultado.rows[0];
}

async function garantirTabelaResumoProducao() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS registro_producao (
            id_registro SERIAL PRIMARY KEY,
            id_produtor INTEGER NOT NULL REFERENCES produtor(id_produtor) ON DELETE CASCADE,
            data_colheita DATE NOT NULL,
            produto VARCHAR(150) NOT NULL,
            peso NUMERIC(12, 2) NOT NULL CHECK (peso > 0),
            criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
    `);
}

async function buscarResumoProducao(id_produtor) {
    await garantirTabelaResumoProducao();

    const resultado = await pool.query(
        `SELECT
            COUNT(*)::INTEGER AS total_registros,
            (ARRAY_AGG(data_colheita ORDER BY data_colheita DESC, id_registro DESC))[1] AS ultima_colheita,
            (ARRAY_AGG(produto ORDER BY data_colheita DESC, id_registro DESC))[1] AS produto,
            (ARRAY_AGG(peso ORDER BY data_colheita DESC, id_registro DESC))[1] AS peso,
            COALESCE((
                SELECT AVG(preco)
                FROM produto
                WHERE id_produtor = $1
            ), 0)::NUMERIC(12, 2) AS valor_medio
         FROM registro_producao
         WHERE registro_producao.id_produtor = $1;`,
        [id_produtor]
    );

    return resultado.rows[0];
}

async function salvarRegistroProducao(
    id_produtor,
    data_colheita,
    produto,
    peso
) {
    await garantirTabelaResumoProducao();

    const resultado = await pool.query(
        `INSERT INTO registro_producao
            (id_produtor, data_colheita, produto, peso)
         VALUES ($1, $2, $3, $4)
         RETURNING id_registro, data_colheita, produto, peso, criado_em;`,
        [id_produtor, data_colheita, produto, peso]
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

async function deletarProdutor(id_produtor) {
    const cliente = await pool.connect();

    try {
        await cliente.query('BEGIN');

        await cliente.query(
            `DELETE FROM registro_producao
             WHERE id_produtor = $1;`,
            [id_produtor]
        );

        await cliente.query(
            `DELETE FROM produto
             WHERE id_produtor = $1;`,
            [id_produtor]
        );

        const resultado = await cliente.query(
            `DELETE FROM produtor
             WHERE id_produtor = $1
             RETURNING id_produtor, nome, email, telefone, tipo_produtor;`,
            [id_produtor]
        );

        await cliente.query('COMMIT');

        return resultado.rows[0];
    } catch (erro) {
        await cliente.query('ROLLBACK');
        throw erro;
    } finally {
        cliente.release();
    }
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
    deletarProdutor,
    criarProdutor,
    buscarResumoProducao,
    salvarRegistroProducao
};