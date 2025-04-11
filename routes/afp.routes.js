const express = require("express");
const router = express.Router();

const { show_all } = require("../controllers/afp.controller");
const { validateJwt } = require("../middlewares/validate-jwt");

router.get("", show_all);
// router.get("/:id", show_one);
// router.post("/", [validateJwt], store);
// router.delete("/:id", [validateJwt], destroy);

module.exports = router;
