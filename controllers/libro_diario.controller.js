const ErrorResponse = require("../helpers/error-response");
const LibroDiario = require("../models").libro_diario;
const Cuenta = require("../models").cuenta;
const Grupo = require("../models").grupo_cuenta;
const SubGrupo = require("../models").subgrupo_cuenta;
const PagoDeposito = require("../models").pago_deposito;
const PagoEfectivo = require("../models").pago_efectivo;
const CuentaBancaria = require("../models").cuenta_bancaria;
const Usuarios = require("../models").usuario;

const ContratoPagos = require("../models").contrato_pago;
const Contrato = require("../models").contrato;
const Cliente = require("../models").cliente;

const ClienteConsultas = require("../models").cliente_consulta;

const { Op, Sequelize: sequelize } = require("sequelize");

const dayjs = require("dayjs");

const show_all = async (req, res, next) => {
  try {
    const { ingreso, from, to } = req.query;
    let where = {};
    if (req.user.fk_nivel !== 1) {
      where = {
        fecha: {
          [Op.between]: [
            dayjs(from).format("YYYY-MM-DD"),
            dayjs(to).format("YYYY-MM-DD"),
          ],
        },
        created_by: req.user.id,
      };
    } else {
      where = {
        fecha: {
          [Op.between]: [
            dayjs(from).format("YYYY-MM-DD"),
            dayjs(to).format("YYYY-MM-DD"),
          ],
        },
      };
    }
    const libro_diario = await Cuenta.findAll({
      where: {
        ingreso,
      },
      include: [
        {
          model: LibroDiario,
          where,
          include: [
            {
              model: Usuarios,
              as: "user_created",
              attributes: ["usuario", "nombres", "apellidos"],
            },
          ],
        },
        {
          model: SubGrupo,
          attributes: ['titulo'],
          include: [{ model: Grupo, attributes: ['titulo'] }],
        },
      ],
    });
    res.status(200).send(libro_diario);
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
  const { fk_cuenta, monto, fecha, deposito, efectivo, tipo_pago, glosa } =
    req.body;
  // console.log(req.body, "LIBRO DIARIO");
  try {
    let pago;
    if (tipo_pago === 2) {
      const new_deposito = await PagoDeposito.create({
        fk_cuenta: deposito.fk_cuenta,
        nro_deposito: deposito.nro_deposito,
      });
      pago = await LibroDiario.create({
        fk_cuenta,
        monto,
        fk_deposito: new_deposito.id,
        fecha,
        glosa,
        created_by: req.user.id,
      });
    } else if (tipo_pago === 1) {
      const new_efectivo = await PagoEfectivo.create({
        nro_comprobante: efectivo.nro_comprobante,
      });
      pago = await LibroDiario.create({
        fk_cuenta,
        monto,
        fk_efectivo: new_efectivo.id,
        fecha,
        glosa,
        created_by: req.user.id,
        updated_by: req.user.id,
      });
    }

    const nuevoPago = await LibroDiario.findOne({
      where: {
        id: pago.id,
      },
      include: [
        {
          model: Cuenta,
        },
        {
          model: Usuarios,
          as: "user_created",
        },
      ],
    });
    res.status(200).send(nuevoPago);
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

  console.log(id, "ID A REVOCAR");
  try {
    const libro_diario = await LibroDiario.findOne({
      where: {
        id,
      },
    });

    await libro_diario.destroy();
    const libro_diario_updated = await libro_diario.update({
      deleted_by: req.user.id,
    });

    res.status(200).send(libro_diario_updated);
  } catch (e) {
    next(e);
  }
};

const estado_resultados = async (req, res, next) => {
  const { ingreso, from, to } = req.query;
  try {
    const libro_diario = await LibroDiario.findAll({
      where: {
        fecha: {
          [Op.between]: [
            dayjs(from).format("YYYY-MM-DD"),
            dayjs(to).format("YYYY-MM-DD"),
          ],
        },
      },
      attributes: [
        "fk_cuenta",
        [sequelize.fn("SUM", sequelize.col("monto")), "total"],
      ],
      include: [
        {
          model: Cuenta,
          where: { ingreso },
          attributes: ["titulo"],
        },
      ],
      group: [["fk_cuenta"], ["cuentum.id"]],
    });

    // const cuentas = await Cuenta.findAll({
    //   attributes: ["id"],
    //   where: {
    //     ingreso: true,
    //   },
    //   include: [
    //     {
    //       model: LibroDiario,
    //       attributes: {
    //         include: [
    //           "fk_cuenta",
    //           [sequelize.fn("COUNT", sequelize.col("monto")), "total"],
    //         ],
    //         exclude: ["id"],
    //       },
    //       group: [["fk_cuenta"]],
    //       // include: [
    //       //   {
    //       //     model: Usuarios,
    //       //     as: "user_created",
    //       //     attributes: ["usuario", "full_name"],
    //       //   },
    //       // ],
    //     },
    //   ],
    //   group: [["cuenta.id"]],
    // });

    res.status(200).send(libro_diario);
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
  estado_resultados,
};

async function actualizarGlosas() {
  const contratos_pagos = await ContratoPagos.findAll({
    attributes: ["id", "fk_libro_diario", "fk_contrato"],
    include: [
      {
        model: Contrato,
        attributes: ["id"],
        include: [
          { model: Cliente, attributes: ["id", "nombres", "apellidos", "ci"] },
        ],
      },
    ],
  });

  for (const cp of contratos_pagos) {
    const { fk_libro_diario } = cp.dataValues;
    if (cp.dataValues.contrato) {
      const { nombres, apellidos, ci } =
        cp.dataValues.contrato?.dataValues.cliente.dataValues;
      const libro_up = await LibroDiario.findOne({
        where: { id: fk_libro_diario },
      });
      await libro_up?.update({
        glosa: `${ci} - ${nombres} ${apellidos}`,
      });
    } else {
      const libro_up = await LibroDiario.findOne({
        where: { id: fk_libro_diario },
      });
      await libro_up?.update({
        glosa: `DESCONOCIDO`,
      });
    }
  }
  console.log("TERMINADO");
}

// actualizarGlosas();

async function actualizarGlosasMotivos() {
  const cliente_consulta = await ClienteConsultas.findAll({
    attributes: ["id", "fk_libro_diario", "fk_cliente"],
    include: [
      { model: Cliente, attributes: ["id", "nombres", "apellidos", "ci"] },
    ],
  });

  for (const cp of cliente_consulta) {
    console.log(cp.dataValues);
    const { fk_libro_diario } = cp.dataValues;
    if (cp.dataValues.cliente) {
      const { nombres, apellidos, ci } = cp.dataValues.cliente?.dataValues;
      const libro_up = await LibroDiario.findOne({
        where: { id: fk_libro_diario },
      });
      await libro_up?.update({
        glosa: `${ci} - ${nombres} ${apellidos}`,
      });
    } else {
      if (fk_libro_diario) {
        const libro_up = await LibroDiario.findOne({
          where: { id: fk_libro_diario },
        });
        await libro_up?.update({
          glosa: `DESCONOCIDO`,
        });
      }
    }
  }
  console.log("TERMINADO");
}

// actualizarGlosasMotivos();

//Estado de resultados
