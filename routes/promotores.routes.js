const express = require('express');
const router = express.Router();

const { index, store } = require('../controllers/promotores.controller');


router.get('/', index);

router.post('/', store);

module.exports = router