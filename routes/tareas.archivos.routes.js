const express = require("express");
const router = express.Router();

const {
  show_all,
  show_one,
  store,
  store_increment,
  destroy,
} = require("../controllers/tareas.archivos.controller");
const { validateJwt } = require("../middlewares/validate-jwt");

router.get("/", [validateJwt], show_all);
router.get("/:id", show_one);
router.post("/", [validateJwt], store);
router.post("/increment", [validateJwt], store_increment);
// router.put("/:id", update);
router.delete("/:id", [validateJwt], destroy);

module.exports = router;
