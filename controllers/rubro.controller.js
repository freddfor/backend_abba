const ErrorResponse = require("../helpers/error-response");
const Rubro = require('../models').rubro;

const show_all = async (req, res, next) => {
  try {
    const rubro = await Rubro.findAll({
      attributes: ['id', 'nombre']
    });
    res.status(200).send(rubro);
  } catch (e) {
    next(e);
  }
};

const show_one = async (req, res, next) => {
  const { id } = req.params;
  try {
    const Rubro = await Rubro.findOne({
      where: {
        id
      }
    });
    res.status(200).send(Rubro);
  } catch (e) {
    next(e);
  }
};

const store = async (req, res, next) => {
  try {
    const Rubro = await Rubro.create({

    });
    res.status(200).send(Rubro);
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const Rubro = await Rubro.findOne({
      where: {
        id
      }
    });

    await Rubro.update();

    res.status(200).send(Rubros);
  } catch (e) {
    next(e);
  }
};

const destroy = async (req, res, next) => {
  try {
    const Rubro = await Rubro.findOne({

    });
    await Rubro.update();

    res.status(200).send(Rubros);
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
