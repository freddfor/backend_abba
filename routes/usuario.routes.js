const express = require('express');
const { check } = require('express-validator');
const router = express.Router();

const { index, show, store, update, destroy, alta, show_menus_by_user, verify_token, myselfbytoken, recovery_password, cambiar_password, verificar_recovery, reset_password, baja } = require('../controllers/usuario.controller');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJwt } = require('../middlewares/validate-jwt');

router.get('/', validateJwt, index);
router.get('/:id', validateJwt, show);
router.get('/my_account/token', validateJwt, myselfbytoken);
router.post('/', [
  validateJwt,
  check('fk_nivel', 'El nivel es obligatorio').notEmpty(),
  check('usuario', 'El usuario es obligatorio').notEmpty(),
  check('email', 'El email es obligatorio').notEmpty(),
  check('email', 'El email no es valido').isEmail(),
  check('nombres', 'El nombre es obligatorio').notEmpty(),
  check('ci', 'El ci es obligatorio').notEmpty(),
  validateFields
], store);

router.put('/', validateJwt,
  check('fk_nivel', 'El nivel es obligatorio').notEmpty(),
  check('usuario', 'El usuario es obligatorio').notEmpty(),
  check('email', 'El email es obligatorio').notEmpty(),
  check('email', 'El email no es valido').isEmail(),
  check('nombres', 'El nombre es obligatorio').notEmpty(),
  check('ci', 'El ci es obligatorio').notEmpty(),
  update);

router.delete('/alta/:id', validateJwt, alta);
router.delete('/baja/:id', validateJwt, baja);

router.delete('/:id', validateJwt, destroy);

router.get('/menus/nivel', validateJwt, show_menus_by_user);

router.get('/verificar', validateJwt, verify_token);

router.post('/recovery', recovery_password);

router.post('/reset_password', reset_password);

router.post('/cambiarPassword', validateJwt, cambiar_password);

router.get('/recovery/verificar', verificar_recovery);

module.exports = router