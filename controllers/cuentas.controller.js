const ErrorResponse = require("../helpers/error-response");
const Cuenta = require('../models').cuenta;

const show_all = async (req, res, next) => {
  try {
    const cuentas = await Cuenta.findAll({
      where: {
        ...req.query
      },
    });
    res.status(200).send(cuentas);
  } catch (e) {
    next(e);
  }
};

const show_one = async (req, res, next) => {
  const { id } = req.params;
  try {
    const cuenta = await Cuenta.findOne({
      where: {
        id,
      },
    });
    res.status(200).send(cuenta);
  } catch (e) {
    next(e);
  }
};

const store = async (req, res, next) => {
  const { titulo, fk_subgrupo_cuenta, ingreso } = req.body;
  try {
    const cuenta = await Cuenta.create({
      titulo,
      created_by: req.user.id,
      fk_subgrupo_cuenta,
      ingreso,
    });
    res.status(200).send(cuenta);
  } catch (e) {
    next(e);
  }
};

/** actualizaion de cuentas */
const update = async (req, res, next) => {
  const { id, titulo, fk_subgrupo_cuenta, ingreso } = req.body;

  try {
    const cuenta = await Cuenta.findOne({
      where: {
        id,
      },
    });

    const cuenta_updated = await cuenta.update({
      titulo,
      fk_subgrupo_cuenta,
      updated_by: req.user.id,
      ingreso,
    });

    res.status(200).send(cuenta_updated);
  } catch (e) {
    next(e);
  }
};

const destroy = async (req, res, next) => {
  const { id } = req.params;

  try {
    const cuenta = await Cuenta.findOne({
      where: {
        id,
      },
    });

    const cuenta_updated = await cuenta.update({
      fk_user_deleted: req.user.id,
      deleted_at: new Date(),
      baja_logica: true,
    });

    res.status(200).send(cuenta_updated);
  } catch (e) {
    next(e);
  }
};

const show_by_subgrupo = async (req, res, next) => {
  const { id } = req.params;
  try {
    const cuenta = await Cuenta.findAll({
      where: {
        fk_subgrupo_cuenta: id,
      },
    });
    res.status(200).send(cuenta);
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
  show_by_subgrupo,
};
