const pool = require('../config/database');

async function garantirColunaImagem() {
    await pool.query(`
        ALTER TABLE produto
        ADD COLUMN IF NOT EXISTS imagem TEXT;
    `);
}

//função para buscar produtos
async function buscarProdutos() {
    await garantirColunaImagem();
    const resultado = await pool.query('SELECT * FROM produto;');

    return resultado.rows;
}

// Função para buscar somente os produtos de um produtor
const buscarProdutosPorProdutor = async (id_produtor) => {
    await garantirColunaImagem();
    const resultado = await pool.query(
        `SELECT *
         FROM produto
         WHERE id_produtor = $1
         ORDER BY id_produto`,
        [id_produtor]
    );

    return resultado.rows;
};

//função para criar produtos
async function criarProduto(
    id_categoria,
    id_produtor,
    nome,
    descricao,
    preco,
    unidade_medida,
    imagem
) {
    await garantirColunaImagem();
    const resultado = await pool.query(
        `INSERT INTO produto 
        (id_categoria, id_produtor, nome, descricao, preco, unidade_medida, imagem)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;`,
        [id_categoria, id_produtor, nome, descricao, preco, unidade_medida, imagem]
    );

    return resultado.rows[0];
}

// Função para atualizar produto
const atualizarProduto = async (
    id, id_categoria, nome, descricao, preco, unidade_medida, imagem, id_produtor) => {
    await garantirColunaImagem();
    const resultado = await pool.query(
        `UPDATE produto
         SET id_categoria = $1,
             nome = $2,
             descricao = $3,
             preco = $4,
                         unidade_medida = $5,
                         imagem = COALESCE($6, imagem)
                 WHERE id_produto = $7
                     AND id_produtor = $8
         RETURNING *;`,
                [id_categoria, nome, descricao, preco, unidade_medida, imagem, id, id_produtor]
    );

    return resultado.rows[0];
};

// Função para deletar produto
const deletarProduto = async (id, id_produtor) => {
    const resultado = await pool.query(
        `DELETE FROM produto
         WHERE id_produto = $1
           AND id_produtor = $2
         RETURNING *;`,
        [id, id_produtor]
    );

    return resultado.rows[0];
};

module.exports = {
    criarProduto,
    buscarProdutos,
    buscarProdutosPorProdutor,
    atualizarProduto,
    deletarProduto
};