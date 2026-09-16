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
        `SELECT id_producao, id_produto, produtor, cidade, estado,
                produto, unidade_medida, id_categoria, categoria,
                quantidade, data_colheita, observacoes
         FROM public.vw_producao_detalhada
         WHERE id_produtor = $1
         ORDER BY data_colheita DESC NULLS LAST, id_producao DESC;`,
        [id_produtor]
    );

    return resultado.rows;
}

async function buscarResumoProducaoPorCategoria(id_produtor) {
    const resultado = await pool.query(
        `SELECT id_categoria, categoria, quantidade_produtos,
                quantidade_produtores, quantidade_registros_producao,
                producao_total, producao_media
      FROM (
          SELECT c.id_categoria,
              c.nome AS categoria,
              COUNT(DISTINCT prod.id_produto)::integer AS quantidade_produtos,
              COUNT(DISTINCT prod.id_produtor)::integer AS quantidade_produtores,
              COUNT(p.id_producao)::integer AS quantidade_registros_producao,
              COALESCE(SUM(p.quantidade), 0) AS producao_total,
              COALESCE(AVG(p.quantidade), 0) AS producao_media
          FROM categoria c
          LEFT JOIN produto prod
              ON prod.id_categoria = c.id_categoria
             AND prod.id_produtor = $1
          LEFT JOIN producao p
              ON p.id_produto = prod.id_produto
             AND p.id_produtor = $1
          GROUP BY c.id_categoria, c.nome
      ) AS resumo_produtor
      ORDER BY categoria;`,
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
    buscarResumoProducaoPorCategoria,
    listarProducoes,
    criarProducao
};