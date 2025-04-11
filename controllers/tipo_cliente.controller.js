const ErrorResponse = require("../helpers/error-response");
const TipoCliente = require("../models").tipo_cliente;
const Requisito = require("../models").requisito;
const TipoClienteRequisito = require("../models").tipo_cliente_requisito;

const show_all = async (req, res, next) => {
  try {
    const tipo_clientes = await TipoCliente.findAll({
      where: req.query,
    });
    res.status(200).json(tipo_clientes);
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
  const { titulo } = req.body;
  try {
    const tipo_cliente = await TipoCliente.create({
      titulo,
      created_by: req.user.id,
    });

    return res.status(200).send(tipo_cliente);
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  const { id, titulo } = req.body;
  try {
    const tipo_cliente = await TipoCliente.findOne({
      where: {
        id,
      },
    });

    const updated = await tipo_cliente.update({
      titulo,
      updated_by: req.user.id,
    });

    return res.status(200).send(updated);
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

const store_requerimiento = async (req, res, next) => {
  const { fk_requisito, fk_tipo_cliente } = req.body;
  try {
    const requisito = await Requisito.findOne({ where: { id: fk_requisito } });

    await requisito.update({
      fk_tipo_cliente,
    });

    return res.status(200).send(requisito);
  } catch (e) {
    next(e);
  }
};

const delete_requerimiento = async (req, res, next) => {
  const { id } = req.params;
  try {
    const tipo_cliente = await TipoClienteRequisito.findOne({
      where: {
        id,
      },
    });

    await tipo_cliente.destroy();

    return res.status(200).send(tipo_cliente);
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
  store_requerimiento,
  delete_requerimiento,
};
