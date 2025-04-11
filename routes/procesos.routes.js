const express = require("express");
const router = express.Router();

const {
  show_all,
  show_one,
  store,
  update,
  destroy,
  show_by_prestacion,
  store_prestacion_proceso,
  destroy_prestacion_proceso,
  update_prestacion_proceso
} = require("../controllers/procesos.controller");
const { validateJwt } = require("../middlewares/validate-jwt");

router.get("/", show_all);
router.get("/", show_one);
router.post("/", store);
router.put("/", update);
router.delete("/", destroy);

router.get("/prestacion/:id", show_by_prestacion);
router.post("/prestacion", store_prestacion_proceso);
router.put("/prestacion", update_prestacion_proceso);

router.delete("/prestacion/:id", destroy_prestacion_proceso);

module.exports = router;
