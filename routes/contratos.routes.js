const express = require("express");
const router = express.Router();

const {
  list,
  show,
  index,
  actualizarContrato,
  store,
  contratosCliente,
  store_prestaciones,
  store_cc_cliente,
  store_pago,
  finalizar_contrato,
  revoke_pago,
  contrato_tareas,
  nueva_observacion,
  actualizar_observacion,
  eliminar_observacion,
  excel,
  store_titular_fechas,
  tareas_seguimientos,
  store_check_fechas,
} = require("../controllers/contratos.controller");
const { validateJwt } = require("../middlewares/validate-jwt");

router.get("/", index);
router.put("/", [validateJwt], actualizarContrato);
router.get("/lista", list);
router.get("/excel", excel);
router.post("/", [validateJwt], store);
router.post("/prestaciones", [validateJwt], store_prestaciones);
router.post("/titular_fechas", [validateJwt], store_titular_fechas);
router.post("/check_fechas", [validateJwt], store_check_fechas);
router.post("/cc_cliente", [validateJwt], store_cc_cliente);
router.get("/codigo", show);
router.get("/tareas_seguimientos", tareas_seguimientos);
router.get("/cliente/:id", contratosCliente);

//Plan de pagos
router.post("/pagos", [validateJwt], store_pago);
router.delete("/pagos/:id", [validateJwt], revoke_pago);

//Finzalizar contrato
router.post("/finalizar", [validateJwt], finalizar_contrato);

router.get("/tareas", [validateJwt], contrato_tareas);

//Observaciones
router.post("/observacion", [validateJwt], nueva_observacion);
router.put("/observacion", [validateJwt], actualizar_observacion);
router.delete("/observacion/:id", [validateJwt], eliminar_observacion);

module.exports = router;
