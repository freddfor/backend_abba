const ErrorResponse = require("../helpers/error-response");
const Archivo = require('../models').archivo;
const TareaSeguimiento = require('../models').tarea_seguimiento;

const show_all = async (req, res, next) => {
  try {
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
  const { descripcion, fk_tarea } = req.body;
  try {
    // console.log(req.body);
    const seguimiento = await TareaSeguimiento.create({
      descripcion,
      fk_tarea,
      created_by: req.user.id,
      updated_by: req.user.id,
    });

    const nuevo_seguimiento = await TareaSeguimiento.findOne({
      where: {
        id: seguimiento.id,
      },
      include: [
        {
          model: Archivo,
        },
      ],
    });

    res.status(200).send(nuevo_seguimiento);
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  const { id, descripcion } = req.body;
  try {
    console.log(req.body);
    const seguimiento = await TareaSeguimiento.findOne({
      where: {
        id,
      },
    });

    const seguimiento_updated = await seguimiento.update({
      descripcion,
      updated_by: req.user.id,
    });

    res.status(200).send(seguimiento_updated);
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

const show_all_tarea = async (req, res, next) => {
  const { id } = req.params;
  try {
    const seguimiento = await TareaSeguimiento.findAll({
      where: {
        fk_tarea: id,
      },
      include: [
        {
          model: Archivo,
        },
      ],
    });
    res.status(200).send(seguimiento);
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
  show_all_tarea,
};
