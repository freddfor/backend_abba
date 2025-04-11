const express = require("express");
const router = express.Router();

const {
  show_all,
  show_one,
  store,
  update,
  destroy,
  show_by_grupo
} = require("../controllers/subgrupo_cuentas.controller");
const { validateJwt } = require("../middlewares/validate-jwt");

router.get("/", [validateJwt], show_all);
router.get("/:id", [validateJwt], show_one);
router.post("/", [validateJwt], store);
router.put("/", [validateJwt], update);
router.delete("/", [validateJwt], destroy);

router.get("/grupo/:id", [validateJwt], show_by_grupo);

module.exports = router;
