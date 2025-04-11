const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const {
  login,
  register,
  getUser,
  getAllUser,
} = require("../controllers/auth.controller");
const { validateFields } = require("../middlewares/validate-fields");

const { validateJwt } = require("../middlewares/validate-jwt");

router.post(
  "/login",
  [
    check("username", "El username es obligatorio").notEmpty(),
    check("password", "El password es obligatorio").notEmpty(),
    validateFields,
  ],
  login
);

router.post(
  "/register",
  [
    validateJwt,
    check("email", "El email es obligatorio").notEmpty(),
    check("email", "El email no es valido").isEmail(),
    check("nombres", "El nombre es obligatorio").notEmpty(),
    check("apellidos", "El apellido es obligatorio").notEmpty(),
    validateFields,
  ],
  register
);

router.get("/", [validateJwt], getUser);

router.get("/all", getAllUser);

module.exports = router;
