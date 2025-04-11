const express = require("express");
const router = express.Router();

const {
  show_all,
  show_one,
  store,
  update,
  destroy,
  show_all_tarea
} = require("../controllers/tareas.seguimientos.controller");
const { validateJwt } = require("../middlewares/validate-jwt");

router.get("/", show_all);
router.get("/", show_one);
router.post("/", [validateJwt], store);
router.put("/", [validateJwt], update);
router.delete("/", destroy);

router.get("/tarea/:id", show_all_tarea);

module.exports = router;
