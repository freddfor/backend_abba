const express = require("express");
const router = express.Router();

const {
  show_all,
  show_one,
  store,
  update,
  destroy,
} = require("../controllers/servicios.controller");
const { validateJwt } = require("../middlewares/validate-jwt");

router.get("/", [validateJwt], show_all);
router.get("/", [validateJwt], show_one);
router.post("/", [validateJwt], store);
router.put("/", [validateJwt], update);
router.delete("/:id", [validateJwt], destroy);

module.exports = router;
