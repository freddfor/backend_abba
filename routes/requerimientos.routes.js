const express = require("express");
const router = express.Router();

const {
  show_all,
  show_one,
  store,
  update,
  destroy,
  show_by_prestacion,
  update_contrato,
  destroyRequisitoContrato,
} = require("../controllers/requerimientos.controller");
const { validateJwt } = require("../middlewares/validate-jwt");

router.get("/", show_all);
router.get("/", show_one);
router.post("/", [validateJwt], store);
router.put("/", update);
router.delete("/", destroy);

router.delete("/contrato/:id_requerimiento", destroyRequisitoContrato);

router.get("/prestacion/:id", show_by_prestacion);
router.put("/contrato", update_contrato);

module.exports = router;
