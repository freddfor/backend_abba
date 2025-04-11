const express = require('express');
const router = express.Router();

const { show, store, show_cliente } = require('../controllers/consultas.controller');
const { validateJwt } = require('../middlewares/validate-jwt');

router.post('/:id', [
	validateJwt
], store);

router.get('/:id', [
	validateJwt
], show);

router.get('/carnet/:ci', [
	validateJwt
], show_cliente);

module.exports = router