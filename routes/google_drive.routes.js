const express = require("express");
const router = express.Router();

const {
  show_all,
  show_one,
  store,
  update,
  destroy,
} = require("../controllers/google_drive.controller");
const { validateJwt } = require("../middlewares/validate-jwt");

router.get("/", show_all);
router.get("/", show_one);
router.post("/", [validateJwt], store);
router.put("/", [validateJwt], update);
router.delete("/", [validateJwt], destroy);

module.exports = router;
