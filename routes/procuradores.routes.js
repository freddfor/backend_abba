const express = require("express");
const router = express.Router();

const {
  show_all,
  show_one,
  store,
  update,
  destroy,
  show_tasks,
  complete_task,
  show_tasks_month,
  update_task
} = require("../controllers/procuradores.controller");

const { validateJwt } = require("../middlewares/validate-jwt");

router.get("/tareas", [validateJwt], show_tasks);
router.get("/tareas_mes", [validateJwt], show_tasks_month);
router.post("/tareas/:id", [validateJwt], complete_task);
router.put("/tareas", [validateJwt], update_task);

router.get("/", show_all);
router.get("/:id", show_one);
router.post("/", [validateJwt], store);
router.put("/", [validateJwt], update);
router.delete("/:id", [validateJwt], destroy);

module.exports = router;
