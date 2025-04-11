const ErrorResponse = require("../helpers/error-response");
const Servicio = require("../models").servicio;

const show_all = async (req, res, next) => {
  try {
    const servicios = await Servicio.findAll();
    res.status(200).send(servicios);
  } catch (e) {
    next(e);
  }
};

const show_one = async (req, res, next) => {
  const { id } = req.params;
  try {
    const servicio = await Servicio.findOne({
      where: {
        id,
      },
    });
    res.status(200).send(servicio);
  } catch (e) {
    next(e);
  }
};

const store = async (req, res, next) => {
  const { nombre } = req.body;
  try {
    const servicio = await Servicio.create({ nombre, created_by: req.user.id });
    res.status(200).send(servicio);
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  const { id, nombre } = req.body;
  try {
    const servicio = await Servicio.findOne({
      where: {
        id,
      },
    });

    await servicio.update({
      nombre,
      updated_by: req.user.id,
    });

    res.status(200).send(servicio);
  } catch (e) {
    next(e);
  }
};

const destroy = async (req, res, next) => {
  const { id } = req.params;
  try {
    const servicio = await Servicio.findOne({
      where: {
        id,
      },
    });
    await servicio.update({
      deleted_by: req.user.id,
    });
    await servicio.destroy();
    res.status(200).send(servicio);
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
