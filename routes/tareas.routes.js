const express = require("express");
const router = express.Router();

const {
  show_all,
  show_one,
  store,
  update,
  destroy,
  show_tarea_proceso,
  store_proceso_tarea,
  iniciar_tareas,
  actualizar_tareas,
  store_tarea_contrato,
  destroy_tarea_proceso,
  destroy_tarea_contrato,
  show_tarea_archivos,
  store_tarea_contrato_lotes,
  lista_contratos_tareas,
  lista_tareas
} = require("../controllers/tareas.controller");
const { validateJwt } = require("../middlewares/validate-jwt");

router.get("/", show_all);
router.get("/listacontratostareas", lista_contratos_tareas);
router.get("/listatareas",[validateJwt], lista_tareas);
router.get("/:id", show_one);
router.post("/", [validateJwt], store);
router.put("/:id", [validateJwt], update);
router.delete("/", [validateJwt], destroy);

router.get("/proceso/:id", show_tarea_proceso);
router.post("/proceso", [validateJwt], store_proceso_tarea);
router.post("/iniciar/:id", [validateJwt], iniciar_tareas);
router.put("/iniciar/updated", [validateJwt], actualizar_tareas);

router.post("/contratos", [validateJwt], store_tarea_contrato);
router.post("/contratos/lotes", [validateJwt], store_tarea_contrato_lotes);
router.delete("/contratos/:id", [validateJwt], destroy_tarea_contrato);

router.delete("/proceso/:id", [validateJwt], destroy_tarea_proceso);

router.get("/archivos/:id", show_tarea_archivos);

module.exports = router;
