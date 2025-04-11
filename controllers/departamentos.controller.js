const ErrorResponse = require("../helpers/error-response");
const Departamento = require('../models').departamento;

const show_all = async (req, res, next) => {
  try {
    const depa = await Departamento.findAll();
    res.status(200).send(depa);
  } catch (e) {
    next(e);
  }
};

const show_one = async (req, res, next) => {
  const { id } = req.params;
  try {
    const departamento = await Departamento.findOne({
      where: { id }
    });
    res.status(200).send(departamento);
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
