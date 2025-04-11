const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const {
  index,
  list,
  list_clientes,
  show,
  store,
  update,
  updatePassword,
  destroy,
  getMotivos,
  search,
  storeAFP,
  get_observaciones,
  store_tareas,
  get_tareas,
  update_tareas,
  search_cliente,
  excel,
} = require("../controllers/cliente.controller");
const { validateFields } = require("../middlewares/validate-fields");

const { validateJwt } = require("../middlewares/validate-jwt");

router.get("/", index);

router.get("/lista", list);

router.get("/excel", excel);

router.get("/lista_clientes", list_clientes);

router.get("/:id", show);

router.get("/carnet/:ci", search);

router.get("/busqueda/asociado", search_cliente);

router.post(
  "/",
  [
    validateJwt,
    check("nombres", "El nombre es obligatorio").notEmpty(),
    check("apellidos", "El apellido es obligatorio").notEmpty(),
    validateFields,
  ],
  store
);

router.post("/afp/:id", [validateJwt], storeAFP);
router.put("/", [validateJwt], update);
router.delete("/:id", [validateJwt], destroy);


router.get("/observaciones/carnet/:ci", [validateJwt], get_observaciones);

router.get("/tareas/carnet/:ci", [validateJwt], get_tareas);
router.post("/tareas", [validateJwt], store_tareas);

router.put("/tareas", [validateJwt], update_tareas);

module.exports = router;
