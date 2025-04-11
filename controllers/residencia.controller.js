const ErrorResponse = require("../helpers/error-response");
const Residencia = require('../models').residencia;

const show_all = async (req, res, next) => {
  try {
    const residencia = await Residencia.findAll({
      attributes: ['id', 'nombre']
    });
    res.status(200).send(residencia);
  } catch (e) {
    next(e);
  }
};

const show_one = async (req, res, next) => {
  const { id } = req.params;
  try {
    const Residencia = await Residencia.findOne({
		where: {
			id
		}
	});
    res.status(200).send(Residencia);
  } catch (e) {
    next(e);
  }
};

const store = async (req, res, next) => {
  try {
    const Residencia = await Residencia.create({

	});

    res.status(200).send(Residencia);
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const Residencia = await Residencia.findOne({
		where: {
			id
		}
	});

	await Residencia.update();

    res.status(200).send(Residencias);
  } catch (e) {
    next(e);
  }
};

const destroy = async (req, res, next) => {
  try {
    const Residencia = await Residencia.findOne({

	});
	await Residencia.update();

    res.status(200).send(Residencias);
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
