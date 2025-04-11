const express = require("express");
const router = express.Router();

const {
  show_all,
  show_one,
  store,
  update,
  destroy,
  store_requerimiento,
  delete_requerimiento
} = require("../controllers/tipo_cliente.controller");
const { validateJwt } = require("../middlewares/validate-jwt");

router.get("/", show_all);
router.get("/", show_one);
router.post("/", [validateJwt], store);
router.put("/", [validateJwt], update);
router.delete("/", [validateJwt], destroy);

router.post("/requerimiento", [validateJwt], store_requerimiento);
router.delete("/requerimiento/:id", [validateJwt], delete_requerimiento);


module.exports = router;
