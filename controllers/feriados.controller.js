const ErrorResponse = require("../helpers/error-response");
const Departamento = require("../models").departamento;
const Feriado = require("../models").feriado;

const { Op, Sequelize: sequelize } = require("sequelize");


const dayjs = require('dayjs');

const include_feriado = [
  {
    model: Departamento,
  },
];

const getFeriadoById = async (id) => {
  return await Feriado.findOne({
    where: {
      id: id,
    },
    include: include_feriado,
  });
};

const show_all = async (req, res, next) => {

  const { sucursal_id } = req.query;

  try {

    let where = {};

    if (sucursal_id) {
      where = {
        [Op.or]: [
          {
            fk_departamento: sucursal_id,
          },
          { fk_departamento: null }
        ]
      }
    }

    const feriados = await Feriado.findAll({
      where: {
        ...where
      },
      include: include_feriado,
    });

    res.status(200).send(feriados);
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
  const { fecha, descripcion, fk_departamento } = req.body;
  try {
    const feriado = await Feriado.create({
      fecha: dayjs(fecha),
      descripcion,
      fk_departamento,
      created_by: req.user.id,
    });

    const nuevo_feriado = await getFeriadoById(feriado.id);

    res.status(200).send(nuevo_feriado);
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  const { id, fecha, descripcion, fk_departamento } = req.body;

  try {
    const feriado = await Feriado.findOne({
      where: {
        id
      }
    });

    await feriado.update({
      fecha: dayjs(fecha),
      descripcion,
      fk_departamento,
      updated_by: req.user.id
    });

    const actualizado_feriado = await getFeriadoById(feriado.id);

    res.status(200).send(actualizado_feriado);

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
