const { Router } = require('express');
const router = Router();

const { store, index, show, destroy, update } = require('../controllers/menus.controller') 

// /api/v1/menu/
router.post('/', store);
router.get('/', index);
//router.get('/submenus/', getMenuAndSubmenus);

// /api/v1/menu/id
router.get('/:id', show);
router.delete('/:id', destroy);
router.put('/:id', update);

module.exports = router;