const ErrorResponse = require("../helpers/error-response");
const CuentaBancaria = require('../models').cuenta_bancaria;

const show_all = async (req, res, next) => {
  try {
    const cuentas = await CuentaBancaria.findAll();
    res.status(200).send(cuentas);
  } catch (e) {
    next(e);
  }
};

const show_one = async (req, res, next) => {
  try {
  } catch (e) {
    next(e);
  }
};

const store = async (req, res, next) => {
  try {
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
  } catch (e) {
    next(e);
  }
};

const destroy = async (req, res, next) => {
  try {
  } catch (e) {
    next(e);
  }
};

module.exports = {
  show_all,
  show_one,
  store,
  update,
  destroy,
};
