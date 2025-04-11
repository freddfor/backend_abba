const { check } = require('express-validator');
const { validateJwt } = require('../middlewares/validate-jwt');
const { validateFields } = require('../middlewares/validate-fields');
const { hasRegimen } = require('../middlewares/validate-activity-plan');


const getValidation = [
  validateJwt,
  check('fk_plan', 'El plan es obligatorio').notEmpty(),
  validateFields
]

const saveValidation = [
  validateJwt,
  hasRegimen,
  check('fk_plan', 'El plan es obligatorio').notEmpty(),
  check('activity', 'La actividad es obligatoria').notEmpty(),
  check('fkc_criticality', 'La criticidad es obligatoria').notEmpty(),
  check('duration_hours', 'La duración de horas es obligatoria').notEmpty(),
  check('duration_minutes', 'La duración de minutos es obligatoria').notEmpty(),
  check('stoppage_hours', 'Las horas de paro es obligatoria').notEmpty(),
  check('is_active', 'El estado es obligatorio').notEmpty(),
  validateFields
]

const saveImagesValidation = [
  validateJwt
]

module.exports = {
  getValidation,
  saveValidation,
  saveImagesValidation
}