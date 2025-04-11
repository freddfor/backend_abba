const express = require('express');
const router = express.Router();

const { show, exportarexcel } = require('../controllers/clientes_consultas.controller');
const { validateJwt } = require('../middlewares/validate-jwt');

router.get('/',
// [validateJwt],
show
);

router.get("/exportarexcel", exportarexcel);



// router.get('/:id', [
// 	validateJwt
// ], show);

// router.get('/carnet/:ci', [
// 	validateJwt
// ], show_cliente);

module.exports = router