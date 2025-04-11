const express = require("express");
const router = express.Router();

const {
  show_all,
  show_one,
  store,
  destroy,
  generar_contrato
} = require("../controllers/archivos.controller");
const { validateJwt } = require("../middlewares/validate-jwt");

router.get("/", [validateJwt], show_all);
router.get("/:id", show_one);
router.post("/", [validateJwt], store);
router.delete("/:id", [validateJwt], destroy);

router.post("/plantilla/contrato", generar_contrato);


module.exports = router;
