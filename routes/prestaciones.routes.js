const express = require("express");
const router = express.Router();

const {
  show,
  index,
  store,
  update,
  destroy,
  procesos_by_prestacion,
  store_tipo_cliente,
  store_servicio,
  delete_tipo_cliente
} = require("../controllers/prestacion.controller");
const { validateJwt } = require("../middlewares/validate-jwt");

router.get("/:id", [validateJwt], show);
router.get("/", [validateJwt], index);
router.post("/", [validateJwt], store);
router.put("/", [validateJwt], update);
router.delete("/:id", [validateJwt], destroy);

router.get("/procesos/:id", [validateJwt], procesos_by_prestacion);

router.post("/tipo_cliente", [validateJwt], store_tipo_cliente);
router.delete("/tipo_cliente/:id", [validateJwt], delete_tipo_cliente);

router.post("/servicio", [validateJwt], store_servicio);

module.exports = router;
