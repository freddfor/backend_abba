const express = require("express");
const router = express.Router();

const {
  show_all,
  show_one,
  store,
  update,
  destroy,
  show_by_subgrupo
} = require("../controllers/cuentas.controller");
const { validateJwt } = require("../middlewares/validate-jwt");

router.get("/", [validateJwt], show_all);
router.get("/", [validateJwt], show_one);
router.post("/", [validateJwt], store);
router.put("/", [validateJwt], update);
router.delete("/", [validateJwt], destroy);

router.get("/subgrupo/:id", [validateJwt], show_by_subgrupo);

module.exports = router;
