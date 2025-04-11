const express = require("express");
const router = express.Router();

const {
  show_all,
  show_one,
  store,
  update,
  destroy,
} = require("../controllers/departamentos.controller");
const { validateJwt } = require("../middlewares/validate-jwt");

router.get("/", show_all);
router.get("/:id", show_one);
router.post("/", store);
router.put("/", update);
router.delete("/", destroy);

module.exports = router;
