const express = require("express");
const router = express.Router();

const {
  index,
  get_user_nivel,
  menus_nivel,
  store,
  update
} = require("../controllers/nivel.controller");
const { validateJwt } = require("../middlewares/validate-jwt");

router.get("/", [validateJwt], index);
router.post("/", [validateJwt], store);
router.put("/", [validateJwt], update);
router.get("/user", get_user_nivel);

router.post("/menus", [validateJwt], menus_nivel);

module.exports = router;
