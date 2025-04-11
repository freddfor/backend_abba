const express = require("express");
const router = express.Router();

const {
  getMotivos,
  store_motivo,
  update_motivo,
  motivos_user,
  motivos_user_created,
  store_user,
  update_user,
  update_all_cuentas,
  motivos_clientes
} = require("../controllers/consultas.controller");
const { validateJwt } = require("../middlewares/validate-jwt");

router.get("/", getMotivos);
router.post("/", [validateJwt], store_motivo);
router.put("/", [validateJwt], update_motivo);

router.get("/user", [validateJwt], motivos_user);

router.get("/usercreated", [validateJwt], motivos_user_created);

router.post("/user", [validateJwt], store_user);

router.put("/user", [validateJwt], update_user);

router.put("/cuentas", [validateJwt], update_all_cuentas);

router.get("/cliente/:id", [validateJwt], motivos_clientes);

module.exports = router;
