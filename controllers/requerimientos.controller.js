const Proceso = require("../models").proceso;
const Prestacion = require("../models").prestacion;
const Prestacion_Requisito = require("../models").prestacion_requisito;
const Contrato_Requisito = require("../models").contrato_requisito;
const Requisito = require("../models").requisito;
const PrestacionTipoCliente = require("../models").prestacion_tipo_cliente;
const TipoCliente = require("../models").tipo_cliente;

const ErrorResponse = require("../helpers/error-response");

const show_all = async (req, res, next) => {
  try {
    const requisitos = await Requisito.findAll({
      where: { fk_tipo_cliente: null },
    });
    res.status(200).json(requisitos);
  } catch (e) {
    next(e);
  }
};

const show_one = async (req, res, next) => {
  const { id } = req.params;
  try {
    const requisito = await Requisito.findOne({ where: { id } });
    res.status(200).json(requisito);
  } catch (e) {
    next(e);
  }
};

const store = async (req, res, next) => {
  const { description } = req.body;
  try {
    const nuevo_requisito = await Requisito.create({
      description,
      created_by: req.user.id,
    });

    res.status(200).json(nuevo_requisito);
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  const { id, description } = req.body;
  try {
    const requisito = await Requisito.findOne({ where: { id } });
    await requisito.update({
      description,
    });
    return res.status(200).send(requisito);
  } catch (e) {
    next(e);
  }
};

const destroy = async (req, res, next) => {
  try {
    res.status(200).send("Not impleted yet");
  } catch (e) {
    next(e);
  }
};

const destroyRequisitoContrato = async (req, res, next) => {
  const { id_requerimiento } = req.params;
  try {
    const requisito = await Contrato_Requisito.findOne({
      where: { id: id_requerimiento },
    });
    await requisito.destroy({ force: true });
    res.status(200).send(requisito);
  } catch (e) {
    next(e);
  }
};

const show_by_prestacion = async (req, res, next) => {
  const { id } = req.params;
  try {
    const prestacion_requisito = await TipoCliente.findAll({
      where: {
        fk_prestacion: id,
      },
      order: [
        // ["updated_at", "DESC"],
        [Requisito, "id", "ASC"],
      ],
      include: [
        {
          model: Requisito,
        },
      ],
    });
    // const prestacion_requisito = await Prestacion_Requisito.findAll({
    //   where: {
    //     fk_prestacion: id,
    //   },
    //   include: [
    //     {
    //       model: Requisito,
    //       group: 'tipo',
    //     },
    //   ],
    // });
    res.status(200).json(prestacion_requisito);
  } catch (e) {
    next(e);
  }
};

const update_contrato = async (req, res, next) => {
  const { id, observado, entregado } = req.body;
  try {
    const requisito = await Contrato_Requisito.findOne({
      where: {
        id,
      },
    });

    await requisito.update({
      observado,
      entregado,
    });

    const requisito_updated = await Contrato_Requisito.findOne({
      where: {
        id,
      },
    });

    res.status(200).json(requisito_updated);
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
  show_by_prestacion,
  update_contrato,
  destroyRequisitoContrato,
};
