const express = require('express');

const consumidorController = require('../controllers/consumidorControllers');

const router = express.Router();

//rotas
router.post('/consumidores', consumidorController.cadastrarConsumidor);
router.post('/login', consumidorController.fazerLogin);
router.post('/logout', (req, res) => {
    req.session.destroy((erro) => {
        if (erro) {
            console.error('ERRO AO ENCERRAR SESSÃO:', erro);
            return res.status(500).json({
                erro: 'Não foi possível encerrar a sessão'
            });
        }

        res.clearCookie('connect.sid');
        res.json({ mensagem: 'Logout realizado com sucesso!' });
    });
});
router.get('/consumidores', consumidorController.listarConsumidores);
router.put('/consumidores/:id', consumidorController.atualizarConsumidor);
router.delete('/consumidores/:id', consumidorController.deletarConsumidor);
router.get('/perfil', consumidorController.buscarPerfil);
router.put('/perfil', consumidorController.atualizarPerfil);
router.delete('/perfil', consumidorController.deletarPerfil);

router.get('/sessao', (req, res) => {
    if (!req.session.usuarioId) {
        return res.status(401).json({
            erro: 'Nenhum usuário está logado'
        });
    }

    res.json({
        mensagem: 'Existe um usuário logado!',
        usuarioId: req.session.usuarioId
    });
});

module.exports = router;