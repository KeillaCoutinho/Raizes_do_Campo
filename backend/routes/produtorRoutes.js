const express = require('express');
const produtorController = require('../controllers/produtorControllers');

const router = express.Router();

router.post('/produtores', produtorController.cadastrarProdutor);

module.exports = router;