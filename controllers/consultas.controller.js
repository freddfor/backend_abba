const Clientes = require("../models").cliente;
const Motivos = require("../models").motivo;
const Cliente_Consultas = require("../models").cliente_consulta;
const Departamento = require("../models").departamento;
const Usuarios = require("../models").usuario;
const Cuentas = require("../models").cuenta;

const ErrorResponse = require("../helpers/error-response");

const include_cliente = [
  {
    model: Motivos,
  },
  {
    model: Clientes,
    include: [
      {
        model: Departamento,
        attributes: ["id", "nombre", "sigla"],
      },
    ],
  },
  {
    model: Usuarios,
    as: "usuario",
  },
  {
    model: Usuarios,
    as: "usuario_created",
  },
];

const show = async (req, res, next) => {
  const { id } = req.params;
  try {
    const consultas = await Cliente_Consultas.findAll({
      where: {
        fk_cliente: id,
      },
      include: {
        model: Motivos,
      },
    });

    res.status(200).json(consultas);
  } catch (e) {
    next(e);
  }
};

const store = async (req, res, next) => {
  const { id } = req.params;
  const { fk_motivo, descripcion } = req.body;

  try {
    const motivo = await Motivos.findOne({ where: { id: fk_motivo } });

    if (!motivo) {
      throw new ErrorResponse(1323);
    }

    const cliente_consulta = await Cliente_Consultas.create(
      {
        fk_cliente: id,
        fk_motivo,
        descripcion,
      },
      {
        include: Motivos,
      }
    );

    res.status(200).json(cliente_consulta);
  } catch (e) {
    next(e);
  }
};

const store_user = async (req, res, next) => {
  const {
    fk_cliente,
    fk_motivo,
    descripcion,
    fk_user,
    fk_libro_diario,
    cancelado,
    observaciones,
    estado,
  } = req.body;

  const { id: idUser } = req.user;

  try {
    const motivo = await Motivos.findOne({ where: { id: fk_motivo } });

    if (!motivo) {
      throw new ErrorResponse(1323);
    }

    const cliente_consulta = await Cliente_Consultas.create({
      descripcion,
      fk_motivo,
      fk_cliente,
      estado,
      cancelado,
      fk_user,
      fk_libro_diario,
      observaciones,
      created_by: idUser,
    });

    const nueva_consulta = await Cliente_Consultas.findAll({
      where: {
        id: cliente_consulta.id,
      },
      include: include_cliente,
    });

    res.status(200).json(nueva_consulta[0]);
  } catch (e) {
    next(e);
  }
};

const update_user = async (req, res, next) => {
  const {
    fk_cliente,
    fk_motivo,
    descripcion,
    fk_user,
    id,
    estado,
    observaciones,
  } = req.body;

  try {
    const cliente = await Cliente_Consultas.findOne({ where: { id } });

    if (!cliente) {
      throw new ErrorResponse(1323);
    }

    await cliente.update({
      descripcion,
      fk_motivo,
      fk_cliente,
      // estado: estado ? estado : 0,
      estado,
      observaciones,
      fk_user,
    });

    const consulta_update = await Cliente_Consultas.findAll({
      where: {
        id,
      },
      include: include_cliente,
    });

    res.status(200).json(consulta_update[0]);
  } catch (e) {
    next(e);
  }
};

// const motivos_user = async (req, res, next) => {
//   const { id: idUser } = req.user;
//   try {
//     const consultas = await Cliente_Consultas.findAll({
//       where: {
//         fk_user: idUser,
//       },
//       include: include_cliente,
//     });

//     res.status(200).json(consultas);
//   } catch (e) {
//     next(e);
//   }
// };

const motivos_user = async (req, res, next) => {
  const { id: idUser } = req.user;
  try {
    const consultas = await Cliente_Consultas.listaConsultasUsuario(idUser);

    res.status(200).json(consultas);
  } catch (e) {
    next(e);
  }
};

const motivos_user_created = async (req, res, next) => {
  const { id: idUser } = req.user;
  try {
    const consultas = await Cliente_Consultas.findAll({
      where: {
        created_by: idUser,
      },
      include: include_cliente,
    });

    res.status(200).json(consultas);
  } catch (e) {
    next(e);
  }
};

const atender_consulta = async (req, res, next) => {
  const { id } = req.body;

  try {
    const cliente = await Cliente_Consultas.findOne({ where: { id } });

    if (!cliente) {
      throw new ErrorResponse(1323);
    }

    await cliente.update({
      estado: 1,
    });

    const consulta_update = await Cliente_Consultas.findAll({
      where: {
        id,
      },
      include: include_cliente,
    });

    res.status(200).json(consulta_update[0]);
  } catch (e) {
    next(e);
  }
};

const getMotivos = async (req, res, next) => {
  try {
    const motivos = await Motivos.findAll({
      order: ["id"],
      include: [
        {
          model: Cuentas,
          attributes: ["id", "titulo", "ingreso", "fk_subgrupo_cuenta"],
        },
      ],
    });

    res.status(200).json(motivos);
  } catch (e) {
    next(e);
  }
};

const store_motivo = async (req, res, next) => {
  const { motivo, monto, fk_cuenta } = req.body;
  try {
    const new_motivo = await Motivos.create({
      motivo,
      monto,
      fk_cuenta,
      created_by: req.user.id,
    });

    res.status(200).json(new_motivo);
  } catch (e) {
    next(e);
  }
};

const update_motivo = async (req, res, next) => {
  const { id, motivo, monto } = req.body;

  try {
    const motivos = await Motivos.findOne({ where: { id } });

    const update_motivo = await motivos.update({
      motivo,
      monto,
      updated_by: req.user.id,
    });

    res.status(200).json(update_motivo);
  } catch (e) {
    next(e);
  }
};

const update_all_cuentas = async (req, res, next) => {
  const { fk_cuenta } = req.body;

  try {
    const cuenta = await Cuentas.findOne({ where: { id: fk_cuenta } });

    await Motivos.update(
      {
        fk_cuenta,
        updated_by: req.user.id,
      },
      {
        where: {},
      }
    );

    res.status(200).json(cuenta);
  } catch (e) {
    next(e);
  }
};

const show_cliente = async (req, res, next) => {
  const { ci } = req.params;

  try {
    const cliente = await Clientes.findOne({
      where: {
        ci,
      },
    });

    const consultas_cliente = await Cliente_Consultas.findAll({
      where: {
        fk_cliente: cliente.id,
      },
      include: [
        {
          model: Motivos,
        },
        {
          model: Usuarios,
          as: "usuario",
        },
        {
          model: Usuarios,
          as: "usuario_created",
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.status(200).json(consultas_cliente);
  } catch (e) {
    next(e);
  }
};

const motivos_clientes = async (req, res, next) => {
  const { id } = req.params;
  try {
    const consultas_cliente = await Cliente_Consultas.findAll({
      where: {
        fk_cliente: id,
      },
      include: [
        {
          model: Motivos,
        },
        {
          model: Usuarios,
          as: "usuario",
        },
      ],
      order: [["created_at", "DESC"]],
    });
    res.status(200).json(consultas_cliente);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  show,
  store,
  motivos_user,
  store_user,
  update_user,
  motivos_user_created,
  getMotivos,
  atender_consulta,
  store_motivo,
  update_motivo,
  update_all_cuentas,
  show_cliente,
  motivos_clientes,
};
