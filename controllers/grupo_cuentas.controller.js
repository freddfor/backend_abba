const ErrorResponse = require("../helpers/error-response");
const GrupoCuenta = require("../models").grupo_cuenta;
const SubGrupoCuenta = require("../models").subgrupo_cuenta;
const Cuenta = require("../models").cuenta;

const include_grupo_cuentas = [
  {
    model: SubGrupoCuenta,
    include: [
      {
        model: Cuenta,
      },
    ],
  },
];

const show_all = async (req, res, next) => {
  try {
    console.log(req.query);
    const grupos = await GrupoCuenta.findAll({
      where: {
        ...req.query,
      },
      include: include_grupo_cuentas,
    });

    res.status(200).send(grupos);
  } catch (e) {
    next(e);
  }
};

const show_one = async (req, res, next) => {
  const { id } = req.params;
  try {
    const grupos = await GrupoCuenta.findOne({
      where: {
        id,
      },
    });
    res.status(200).send(grupos);
  } catch (e) {
    next(e);
  }
};

const store = async (req, res, next) => {
  const { titulo, ingreso } = req.body;
  try {
    const grupo = await GrupoCuenta.create({
      titulo,
      created_by: req.user.id,
      ingreso,
    });
    res.status(200).send(grupo);
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  const { id, titulo } = req.body;

  try {
    const grupo = await GrupoCuenta.findOne({
      where: {
        id,
      },
    });

    const grupo_updated = await grupo.update({
      titulo,
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
    const grupo = await GrupoCuenta.findOne({
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

module.exports = {
  show_all,
  show_one,
  store,
  update,
  destroy,
};
