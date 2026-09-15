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
        CREATE TABLE IF NOT EXISTS resumo_producao (
            id_produtor INTEGER PRIMARY KEY REFERENCES produtor(id_produtor) ON DELETE CASCADE,
            ultima_colheita DATE,
            total_registros INTEGER NOT NULL DEFAULT 0,
            unidade_mais_utilizada VARCHAR(100),
            atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
    `);
}

async function buscarResumoProducao(id_produtor) {
    await garantirTabelaResumoProducao();

    const resultado = await pool.query(
        `SELECT ultima_colheita, total_registros, unidade_mais_utilizada, atualizado_em
         FROM resumo_producao
         WHERE id_produtor = $1;`,
        [id_produtor]
    );

    return resultado.rows[0] || null;
}

async function salvarResumoProducao(
    id_produtor,
    ultima_colheita,
    total_registros,
    unidade_mais_utilizada
) {
    await garantirTabelaResumoProducao();

    const resultado = await pool.query(
        `INSERT INTO resumo_producao
            (id_produtor, ultima_colheita, total_registros, unidade_mais_utilizada, atualizado_em)
         VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
         ON CONFLICT (id_produtor) DO UPDATE SET
            ultima_colheita = EXCLUDED.ultima_colheita,
            total_registros = EXCLUDED.total_registros,
            unidade_mais_utilizada = EXCLUDED.unidade_mais_utilizada,
            atualizado_em = CURRENT_TIMESTAMP
         RETURNING ultima_colheita, total_registros, unidade_mais_utilizada, atualizado_em;`,
        [id_produtor, ultima_colheita || null, total_registros, unidade_mais_utilizada || null]
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
    criarProdutor,
    buscarResumoProducao,
    salvarResumoProducao
};