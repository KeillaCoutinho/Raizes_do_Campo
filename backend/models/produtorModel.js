const pool = require('../config/database');

async function buscarProdutorPorEmail(email) {
    const resultado = await pool.query(
        `SELECT * FROM produtor
         WHERE email = $1;`,
        [email]
    );

    return resultado.rows[0];
}

async function buscarResumoProducao(id_produtor) {
    const resultado = await pool.query(
        `SELECT MAX(p.data_colheita) AS ultima_colheita,
                COUNT(p.id_producao)::integer AS total_registros,
                COALESCE(SUM(p.quantidade), 0) AS quantidade_total,
                MODE() WITHIN GROUP (ORDER BY prod.unidade_medida) AS unidade_mais_utilizada
         FROM producao p
         JOIN produto prod ON prod.id_produto = p.id_produto
         WHERE p.id_produtor = $1;`,
        [id_produtor]
    );

    return resultado.rows[0];
}

async function listarProducoes(id_produtor) {
    const resultado = await pool.query(
        `SELECT p.id_producao, p.id_produto, prod.nome AS produto,
                prod.unidade_medida, p.quantidade, p.data_colheita,
                p.observacoes
         FROM producao p
         JOIN produto prod ON prod.id_produto = p.id_produto
         WHERE p.id_produtor = $1
         ORDER BY p.data_colheita DESC NULLS LAST, p.id_producao DESC;`,
        [id_produtor]
    );

    return resultado.rows;
}

async function criarProducao(
    id_produtor,
    id_produto,
    quantidade,
    data_colheita,
    observacoes
) {
    const resultado = await pool.query(
        `INSERT INTO producao
            (id_produto, id_produtor, quantidade, data_colheita, observacoes)
         SELECT $1, $2, $3, $4, $5
         WHERE EXISTS (
            SELECT 1 FROM produto WHERE id_produto = $1 AND id_produtor = $2
         )
         RETURNING *;`,
        [id_produto, id_produtor, quantidade, data_colheita || null, observacoes || null]
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

async function atualizarProdutor(id_produtor, nome, email, telefone) {
    const resultado = await pool.query(
        `UPDATE produtor
         SET nome = $1,
             email = $2,
             telefone = $3
         WHERE id_produtor = $4
         RETURNING id_produtor, id_localizacao, nome, email, telefone, tipo_produtor;`,
        [nome, email, telefone, id_produtor]
    );

    return resultado.rows[0];
}

async function deletarProdutor(id_produtor) {
    const resultado = await pool.query(
        `DELETE FROM produtor
         WHERE id_produtor = $1
         RETURNING id_produtor;`,
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
    atualizarProdutor,
    deletarProdutor,
    criarProdutor,
    buscarResumoProducao,
    listarProducoes,
    criarProducao
};