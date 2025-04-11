const ErrorResponse = require("../helpers/error-response");
const Prestacion = require("../models").prestacion;
const Prestacion_Requisito = require("../models").prestacion_requisito;
const Requisito = require("../models").requisito;
const PrestacionTipoCliente = require("../models").prestacion_tipo_cliente;
const TipoCliente = require("../models").tipo_cliente;
const Contrato = require("../models").contrato;
const PrestacionProceso = require("../models").prestacion_proceso;
const Proceso = require("../models").proceso;
const Servicio = require("../models").servicio;
const Cuenta = require("../models").cuenta;

const show = async (req, res, next) => {
  const { id } = req.params;
  try {
    const prestaciones = await Prestacion.findOne({
      where: { id },
      include: Requisito,
    });
    res.status(200).json(prestaciones);
  } catch (e) {
    next(e);
  }
};

const index = async (req, res, next) => {
  try {
    const prestaciones = await Prestacion.findAll({
      where: {
        ...req.query,
      },
      order: ["id"],
      include: [
        {
          model: Servicio,
        },
        {
          model: Cuenta,
        },
      ],
    });
    const contratos = await Contrato.findAll({});
    let cntContratos = contratos.filter(
      (c) => new Date(c.createdAt).getFullYear === new Date().getFullYear
    ).length;
    res.status(200).json({ prestaciones, cntContratos: cntContratos++ });
  } catch (e) {
    next(e);
  }
};

const store = async (req, res, next) => {
  const { nombre, monto, grupo, codigo, fk_servicio, fk_cuenta } = req.body;
  try {
    const prestacion = await Prestacion.create({
      nombre,
      monto,
      grupo,
      codigo,
      fk_servicio,
      fk_cuenta,
      created_by: req.user.id,
    });

    const new_prestacion = await Prestacion.findOne({
      where: { id: prestacion.id },
      include: [
        {
          model: Servicio,
        },
        {
          model: Cuenta,
        },
      ],
    });

    res.status(200).json(new_prestacion);
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  const { id, nombre, monto, grupo, codigo, fk_servicio, fk_cuenta } = req.body;
  try {
    const prestacion = await Prestacion.findOne({
      where: { id },
    });

    const updated_prestacion = await prestacion.update({
      nombre,
      monto,
      grupo,
      codigo,
      fk_servicio,
      fk_cuenta,
      updated_by: req.user.id,
    });

    const new_prestacion = await Prestacion.findOne({
      where: { id: updated_prestacion.id },
      include: [
        {
          model: Servicio,
        },
        {
          model: Cuenta,
        },
      ],
    });

    res.status(200).json(new_prestacion);
  } catch (e) {
    next(e);
  }
};

const destroy = async (req, res, next) => {
  const { id } = req.params;
  try {
    const prestacion = await Prestacion.findOne({
      where: { id },
    });

    await prestacion.update({
      deleted_by: req.user.id,
    });

    prestacion.destroy();

    res.status(200).json(prestacion);
  } catch (e) {
    next(e);
  }
};

const procesos_by_prestacion = async (req, res, next) => {
  const { id } = req.params;

  try {
    const proceso_prestacion = await PrestacionProceso.findAll({
      where: {
        fk_prestacion: id,
      },
      include: [
        {
          model: Proceso,
        },
      ],
    });
    res.status(200).json(proceso_prestacion);
  } catch (e) {
    next(e);
  }
};

const store_tipo_cliente = async (req, res, next) => {
  const { fk_prestacion, fk_tipo_cliente } = req.body;

  try {
    const tipo_cliente = await TipoCliente.findOne({
      where: { id: fk_tipo_cliente },
      include: [
        {
          model: Requisito,
          // attributes: ["id", "titulo", "tiempo", "formulario"],
        },
      ],
    });

    await tipo_cliente.update({
      fk_prestacion,
    });

    res.status(200).json(tipo_cliente);
  } catch (e) {
    next(e);
  }
};

const store_servicio = async (req, res, next) => {
  const { fk_prestacion, fk_tipo_cliente } = req.body;

  try {
    const prestacion_tipo_cliente = await PrestacionTipoCliente.create({
      fk_prestacion,
      fk_tipo_cliente,
    });

    const nuevo = await PrestacionTipoCliente.findOne({
      where: {
        id: prestacion_tipo_cliente.id,
      },
      include: [
        {
          model: TipoCliente,
          include: [
            {
              model: Requisito,
              // attributes: ["id", "titulo", "tiempo", "formulario"],
            },
          ],
        },
      ],
    });
    res.status(200).json(nuevo);
  } catch (e) {
    next(e);
  }
};

const delete_tipo_cliente = async (req, res, next) => {
  const { id } = req.params;

  try {
    const prestacion_tipo_cliente = await PrestacionTipoCliente.findOne({
      where: {
        id,
      },
    });

    await prestacion_tipo_cliente.destroy();

    res.status(200).json(prestacion_tipo_cliente);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  show,
  index,
  store,
  update,
  destroy,
  procesos_by_prestacion,
  store_tipo_cliente,
  store_servicio,
  delete_tipo_cliente,
};
