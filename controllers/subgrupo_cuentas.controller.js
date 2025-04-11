const ErrorResponse = require("../helpers/error-response");
const SubGrupoCuenta = require('../models').subgrupo_cuenta;

const show_all = async (req, res, next) => {
  try {
    const sub_grupos = await SubGrupoCuenta.findAll({
      where: {
        baja_logica: false,
      },
    });
    res.status(200).send(sub_grupos);
  } catch (e) {
    next(e);
  }
};

const show_one = async (req, res, next) => {
  const { id } = req.params;
  try {
    const sub_grupos = await SubGrupoCuenta.findOne({
      where: {
        id,
      },
    });
    res.status(200).send(sub_grupos);
  } catch (e) {
    next(e);
  }
};

const store = async (req, res, next) => {
  const { titulo, fk_grupo_cuenta, ingreso } = req.body;
  try {
    const grupo = await SubGrupoCuenta.create({
      titulo,
      created_by: req.user.id,
      fk_grupo_cuenta,
      ingreso,
    });
    res.status(200).send(grupo);
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  const { id, titulo, fk_grupo_cuenta } = req.body;

  try {
    const grupo = await SubGrupoCuenta.findOne({
      where: {
        id,
      },
    });

    const grupo_updated = await grupo.update({
      titulo,
      fk_grupo_cuenta,
      updated_by: req.user.id,
    });

    res.status(200).send(grupo_updated);
  } catch (e) {
    next(e);
  }
};

const destroy = async (req, res, next) => {
  const { id } = req.params;

  try {
    const grupo = await SubGrupoCuenta.findOne({
      where: {
        id,
      },
    });

    const grupo_updated = await grupo.update({
      fk_user_deleted: req.user.id,
      deleted_at: new Date(),
      baja_logica: true,
    });

    res.status(200).send(grupo_updated);
  } catch (e) {
    next(e);
  }
};

const show_by_grupo = async (req, res, next) => {
  const { id } = req.params;
  try {
    const sub_grupos = await SubGrupoCuenta.findAll({
      where: {
        fk_grupo_cuenta: id,
      },
    });
    res.status(200).send(sub_grupos);
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
  show_by_grupo,
};
