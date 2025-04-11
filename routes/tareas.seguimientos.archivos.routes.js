const express = require("express");
const router = express.Router();

const {
  show_all,
  show_one,
  store,
  update,
  destroy,
  store_increment,
  show_by_seguimiento_tarea,
} = require("../controllers/tareas.seguimientos.archivos.controller");
const { validateJwt } = require("../middlewares/validate-jwt");

router.get("/", show_all);
router.get("/", show_one);
router.post("/", [validateJwt], store);
router.post("/increment", [validateJwt], store_increment);
router.put("/:id", [validateJwt], update);
router.delete("/:id", [validateJwt], destroy);

router.get("/tareas/:id", show_by_seguimiento_tarea);

module.exports = router;
