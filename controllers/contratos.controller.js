const dayjs = require("dayjs");
const ErrorResponse = require("../helpers/error-response");
const Contrato = require("../models").contrato;
const Requisito = require("../models").requisito;
const Contrato_Requisito = require("../models").contrato_requisito;
const ContratoObservacion = require("../models").contrato_observaciones;
const ContratoPago = require("../models").contrato_pago;
const Prestacion = require("../models").prestacion;
const Clientes = require("../models").cliente;
const Proceso = require("../models").proceso;
const ContratoProcesoTarea = require("../models").contrato_proceso_tarea;
const Tarea = require("../models").tarea;
const TareaArchivo = require("../models").tarea_archivo;
const Feriado = require("../models").feriado;
const Archivo = require("../models").archivo;
const Usuarios = require("../models").usuario;
const PagoDeposito = require("../models").pago_deposito;
const PagoEfectivo = require("../models").pago_efectivo;
const CuentaBancaria = require("../models").cuenta_bancaria;
const Cuenta = require("../models").cuenta;
const LibroDiario = require("../models").libro_diario;
const Departamento = require("../models").departamento;
const Servicio = require("../models").servicio;
const Afp = require("../models").afp;
const AfpCliente = require("../models").afp_cliente;
const TipoCliente = require("../models").tipo_cliente;
const Correlativo = require("../models").correlativo;
const TareaSeguimiento = require("../models").tarea_seguimiento;

const { Op, Sequelize: sequelize } = require("sequelize");
// const sequelizeTransactions = require('sequelize-transactions');

const { getPagingData, getPagination } = require("../helpers/pagination");
const { sortBuilder } = require("../helpers/sort");
const { zeroPad } = require("../helpers/zeropad");
const { AdicionarDias } = require("../helpers/sumarDias");
const contrato = require("../models/contrato");
const contratos = require("./archivos/contratos");
const ExcelJS = require('exceljs');

const show = async (req, res, next) => {
  const { cod } = req.query;
  try {
    const contrato = await Contrato.findOne({
      where: {
        codigo_contrato: cod,
      },
      order: [
        [{ model: ContratoProcesoTarea }, "orden", "asc"],
        [{ model: ContratoProcesoTarea }, "fk_tarea", "asc"],
        [{ model: ContratoPago }, "created_at", "ASC"],
        [{ model: ContratoObservacion }, "created_at", "DESC"],
      ],
      include: [
        {
          model: Contrato_Requisito,
        },
        {
          model: Prestacion,
          include: [
            {
              model: Cuenta,
              attributes: ["id", "titulo", "ingreso", "fk_subgrupo_cuenta"],
            },
            {
              model: Servicio,
            },
          ],
        },
        {
          model: Usuarios,
          as: "titular",
        },
        {
          model: Usuarios,
          as: "suplente",
        },
        {
          model: Usuarios,
          as: "creado_por",
        },
        {
          model: ContratoPago,
          include: [
            {
              model: Usuarios,
            },
            {
              model: LibroDiario,
              include: [
                { model: PagoEfectivo },
                {
                  model: PagoDeposito,
                  include: [
                    {
                      model: CuentaBancaria,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          model: ContratoProcesoTarea,
          include: [
            {
              model: TareaSeguimiento,
            },
            {
              model: Tarea,
              as: "tarea_contrato",
            },
            {
              model: Archivo,
            },
            {
              model: Proceso,
            },
            {
              model: Usuarios,
              as: "responsable",
            },
          ],
        },
        {
          model: Clientes,
          include: [
            {
              model: Departamento,
            },
            {
              model: AfpCliente,
              include: [{ model: Afp }],
            },
          ],
        },
        {
          model: ContratoObservacion,
          include: [{ model: Usuarios, attributes: ["usuario"] }],
        },
      ],
    });

    console.log(contrato, 'contrato completo');
    
    if (contrato && contrato.contrato_proceso_tareas) {
      contrato.contrato_proceso_tareas.forEach(tarea => {
        if (tarea.tarea_seguimientos && tarea.tarea_seguimientos.length > 0) {
          tarea.tarea_seguimientos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }
      });
    }

    res.status(200).json(contrato);
  } catch (e) {
    next(e);
  }
};

const tareas_seguimientos = async (req, res, next) => {
  // const { id } = req.params;
  const { id } = req.query;
  console.log(req.query, 'id contrato');

  try {
    const tareas = await ContratoProcesoTarea.findAll({
      where: {
        fk_contrato: id,
      },
      order: [
        ["orden", "asc"],
        ["fk_tarea", "asc"],
      ],
      include: [
        {
          model: TareaSeguimiento,
        },
        {
          model: Proceso,
        },
      ],
    })

    // Ordenar manualmente los TareaSeguimiento por created_at DESC
    const tareasOrdenadas = tareas.map(tarea => {
      if (tarea.tarea_seguimientos && tarea.tarea_seguimientos.length > 0) {
        tarea.tarea_seguimientos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      }
      return tarea;
    });


    res.status(200).json(tareasOrdenadas);
  } catch (e) {
    next(e);
  }
};


const index = async (req, res, next) => {
  try {
    let page = req.query["page"];
    let size = req.query["size"];
    let search = req.query["search"];

    const { filterField, filterValue, filterValueTwo } = req.query;

    const { sortBy, orderBy } = sortBuilder(
      !req.query["sortBy"] ? "codigo_contrato" : req.query["sortBy"],
      req.query["orderBy"]
    );
    const { limit, offset } = getPagination(page, size);

    let where = {};
    let filtering = {};

    if (filterField === "created_at") {
      filtering = {
        created_at: {
          [Op.between]: [
            filterValue,
            dayjs(filterValueTwo).add(1, "day").format("YYYY-MM-DD"),
          ],
        },
      };
    }

    let whereSearch = {};
    if (search || search !== "") {
      whereSearch = {
        [Op.or]: [
          { codigo_contrato: { [Op.iLike]: `%${search.toLowerCase()}%` } },
        ],
      };
    }

    where = {
      where: {
        ...whereSearch,
        ...filtering,
      },
    };

    const result = await Contrato.findAndCountAll({
      include: [
        {
          model: Clientes,
        },
        {
          model: Prestacion,
        },
        {
          model: Usuarios,
          as: "titular",
        },
        {
          model: Usuarios,
          as: "suplente",
        },
        {
          model: Usuarios,
          as: "creado_por",
        },
      ],
      attributes: {
        include: [
          [
            sequelize.fn(
              "total_pagado_contrato",
              sequelize.col("contrato.codigo_contrato")
            ),
            "a_cuenta",
          ],
          [
            sequelize.fn(
              "tareas_contrato",
              sequelize.col("contrato.codigo_contrato"),
              0
            ),
            "tareas_no_iniciadas",
          ],
          [
            sequelize.fn(
              "tareas_contrato",
              sequelize.col("contrato.codigo_contrato"),
              1
            ),
            "tareas_iniciadas",
          ],
          [
            sequelize.fn(
              "tareas_contrato",
              sequelize.col("contrato.codigo_contrato"),
              2
            ),
            "tareas_completadas",
          ],
        ],
      },
      ...where,
      order: [[sortBy, orderBy]],
      limit,
      offset,
    });

    const contratos = getPagingData(result, page, limit, offset);

    res.status(200).json(contratos);
  } catch (e) {
    next(e);
  }
};

const list = async (req, res, next) => {

  try {
    const { skip, take, requireTotalCount, sort, filter } = req.query;
    const filtroCadena = await generateFilterCondition(filter);
    const orderBy = await generateOrderByClause(sort);
    const limite = `limit ${take} offset ${skip}`;

    const rows = await Contrato.listaContratos(filtroCadena, orderBy, limite);
    const result = await Contrato.countContratos(filtroCadena);
    const count = parseInt(result[0].count);
    const totalPages = Math.ceil(count / take);

    res.status(200).json({
      success: true,
      message: "lista obtenido exitosamente.",
      totalCount: count,
      pageSize: skip,
      totalPages: totalPages,
      data: rows,
    });

    const run = async (req, res) => {
      const t = await sequelize.transaction();
      try {
        await migrateAssetDerecognition(t);

        await t.commit();
      } catch (error) {
        console.log(error);
        await t.rollback();
      }
    };
  } catch (e) {
    next(e);
  }
};

const excel = async (req, res, next) => {
  try {
    const { skip, take, requireTotalCount, sort, filter } = req.query;

    const filtroCadena = await generateFilterCondition(filter);
    const orderBy = await generateOrderByClause(sort);

    const rows = await Contrato.listaContratos(filtroCadena, orderBy);
    console.log(rows, 'orden');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Contratos');
    // Agregar encabezados
    worksheet.addRow([
      "Nro",
      "Exp.",
      "Cliente",
      "CI",
      "Gestion",
      "Correlativo",
      "Codigo",
      "Fecha Contrato",
      "Prestación",
      "Saldo",
      "Precio",
      "Estado",
      "fecha_recepcion",
      "FECHA SUSPENCION",
      "FECHA CERTIFICACION",
      "fecha_verifiacion",
      "fecha_firma",
      "Promotor",
      "Departamento",
      "Titular",
      "Suplente",
      "Recomendación",
      "Usuario Creación",
    ]);

    rows.forEach((x, i) => {
      worksheet.addRow([
        i + 1,
        x.nro_expediente,
        x.cliente,
        x.ci,
        x.anio,
        x.correlativo,
        x.codigo_contrato,
        x.fecha_contrato,
        x.prestacion,
        x.saldo,
        x.total,
        x.estado_text,
        x.fecha_recepcion,
        x.fecha_suspencion,
        x.fecha_certificacion,
        x.fecha_verificacion,
        x.fecha_firma,
        x.promotor,
        x.departamento,
        x.titular,
        x.suplente,
        x.recomendaciones,
        x.creado_por,
      ]);
    });

    // Configurar respuesta
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="datos.xlsx"');

    // Enviar archivo de Excel
    workbook.xlsx.write(res)
      .then(() => {
        res.end();
      });
  } catch (error) {
    res.status(500).json({ msg: "Ocurrió un error" });
  }
}

const store = async (req, res, next) => {
  const {
    codigo_contrato,
    fk_cliente,
    fk_prestacion,
    fk_user_firma,
    total,
    requisitos_contrato,
    dh_primerg,
    dh_tercerg,
    departamento,
    fk_titular,
    fk_suplente,
    procesos_tareas,
    anio,
    fecha_contrato,
    count,
    created_at,
    sucursal_id,
  } = req.body;
  // const t = await sequelize.transaction();
  const db = require("../models");
  const t = await db.sequelize.transaction();

  try {

    const cliente = await Clientes.findOne({ where: { id: fk_cliente } });
    var correlativo = await Correlativo.findOne({
      where: { fk_prestacion: fk_prestacion, gestion: anio },
    });
    if (correlativo) {
      var corr = correlativo.correlativo + 1;
      await correlativo.update(
        {
          correlativo: corr,
        },
        {
          transaction: t,
        }
      );
    } else {
      const newCorrelativo = await Correlativo.create(
        {
          fk_prestacion: fk_prestacion,
          correlativo: 1,
          gestion: anio,
          created_by: 1,
        },
        {
          transaction: t,
        }
      );
      corr = 1;
    }
    if (cliente.nro_expediente === null) {
      const count = await Clientes.max("nro_expediente");
      await cliente.update({
        nro_expediente: count + 1,
      });
    }

    const { sigla } = await Departamento.findOne({
      where: { id: departamento },
    });
    let nuevo_contrato_correlativo = zeroPad(corr, 4);
    // zeroPad
    let last_codigo = `${sigla}-${cliente.ci}-${codigo_contrato}-${nuevo_contrato_correlativo}/${anio}`;

    const newContrato = await Contrato.create(
      {
        codigo_contrato: last_codigo,
        fk_cliente,
        fk_prestacion,
        created_by: req.user.id,
        fk_user_firma,
        finalizado: false,
        departamento,
        dh_primerg,
        dh_tercerg,
        total,
        fk_titular,
        fk_suplente,
        correlativo: corr,
        anio,
        fecha_contrato,
      },
      {
        transaction: t,
      }
    );
    for (const rc of requisitos_contrato) {
      for (const r of rc.requisitos) {
        await Contrato_Requisito.create(
          {
            fk_contrato: newContrato.id,
            fk_requisito: r.fk_requisito,
            entregado: r.entregado,
            correcto: true,
            observado: r.observacion,
            fk_tipo_cliente: rc.id,
            requisito: r.description,
          },
          {
            transaction: t,
          }
        );
      }
    }

    let where = {};

    if (sucursal_id) {
      where = {
        [Op.or]: [
          {
            fk_departamento: sucursal_id,
          },
          { fk_departamento: null },
        ],
      };
    }

    const feriados = await Feriado.findAll({
      where: {
        ...where,
      },
      include: [
        {
          model: Departamento,
        },
      ],
    });

    const normalizeFeriados = feriados.map((f) =>
      dayjs(f.fecha).format("YYYY-MM-DD")
    );

    let sw = true;

    for (const proceso of procesos_tareas) {
      for (const tarea of proceso.tareas) {
        if (tarea.prioridad === 1 && sw) {
          await ContratoProcesoTarea.create(
            {
              fk_tarea: tarea.id,
              fk_contrato: newContrato.id,
              fecha_inicio: dayjs().format("YYYY-MM-DD"),
              fecha_fin: await AdicionarDias(
                dayjs(),
                tarea.tiempo,
                normalizeFeriados
              ),
              estado: 1,
              fecha_conclusion: null,
              tarea: tarea.titulo,
              fk_proceso: proceso.id,
              fk_prestacion,
              fk_responsable: fk_titular,
            },
            {
              transaction: t,
            }
          );

        } else {
          await ContratoProcesoTarea.create(
            {
              fk_tarea: tarea.id,
              fk_contrato: newContrato.id,
              fecha_inicio: null,
              fecha_fin: null,
              estado: 0,
              fecha_conclusion: null,
              tarea: tarea.titulo,
              fk_proceso: proceso.id,
              fk_prestacion,
              fk_responsable: fk_titular,
            },
            {
              transaction: t,
            }
          );
        }

      }
      sw = false;
    }
    await t.commit();
    res.status(200).json(newContrato);
  } catch (e) {
    console.log(e);
    await t.rollback();
    next(e);
  }
};

const contratosCliente = async (req, res, next) => {
  const { id } = req.params;
  try {
    const contrato = await Contrato.findAll({
      where: { fk_cliente: id, ...req.query },
      include: [
        {
          model: Usuarios,
          as: "creado_por",
        },
      ],
    });

    res.status(200).json(contrato);
  } catch (e) {
    next(e);
  }
};

const store_titular_fechas = async (req, res, next) => {
  const {
    codigo_contrato,
    fk_titular,
    fk_suplente,
    fecha_recepcion,
    fecha_verificacion,
    fecha_firma,
    fecha_suspencion,
    fecha_certificacion,
  } = req.body;
  try {
    const contrato = await Contrato.findOne({
      where: { codigo_contrato },
    });

    const contratoUpdate = await contrato.update({
      fk_titular,
      fk_suplente,
      fecha_recepcion,
      fecha_verificacion,
      fecha_firma,
      fecha_suspencion,
      fecha_certificacion,
    });

    res.status(200).json(contratoUpdate);
  } catch (e) {
    next(e);
  }
};

const store_check_fechas = async (req, res, next) => {
  const {
    codigo_contrato,
    check_fecha_recepcion,
    check_fecha_verificacion,
    check_fecha_firma,
    check_fecha_suspencion,
    check_fecha_certificacion,
  } = req.body;
  try {
    const contrato = await Contrato.findOne({
      where: { codigo_contrato },
    });

    const contratoUpdate = await contrato.update({
      check_fecha_recepcion,
      check_fecha_firma,
      check_fecha_verificacion,
      check_fecha_suspencion,
      check_fecha_certificacion,
    });

    res.status(200).json(contratoUpdate);
  } catch (e) {
    next(e);
  }
};

const store_prestaciones = async (req, res, next) => {
  const {
    codigo_contrato,
    fsa,
    ccm,
    fs,
    fr,
    r_dignidad,
    a_reparto,
    a_sip,
    a_hijos,
    a_insalubre,
    // fecha_recepcion,
    // fecha_verificacion,
    // fecha_firma,
    // fecha_suspencion,
    // fecha_certificacion,
  } = req.body;
  console.log(req.body, 'datos fechas---');

  try {
    const contrato = await Contrato.findOne({
      where: { codigo_contrato },
    });

    const contratoUpdate = await contrato.update({
      fsa,
      ccm,
      fs,
      fr,
      r_dignidad,
      a_reparto,
      a_sip,
      a_hijos,
      a_insalubre,
      // fecha_recepcion,
      // fecha_verificacion,
      // fecha_firma,
      // fecha_suspencion,
      // fecha_certificacion,
    });

    res.status(200).json(contratoUpdate);
  } catch (e) {
    next(e);
  }
};

const store_cc_cliente = async (req, res, next) => {
  const { codigo_contrato, ccCliente, monto } = req.body;
  try {
    const contrato = await Contrato.findOne({
      where: { codigo_contrato },
    });

    const contratoUpdate = await contrato.update({
      tipo_cc: ccCliente,
      monto_cc: monto,
    });

    res.status(200).json(contratoUpdate);
  } catch (e) {
    next(e);
  }
};

const store_pago = async (req, res, next) => {
  const { fk_contrato, fk_libro_diario } = req.body;
  try {
    const pago = await ContratoPago.create({
      fk_contrato,
      fk_libro_diario,
      created_by: req.user.id,
      updated_by: req.user.id,
    });

    const pagoSelected = await ContratoPago.findOne({
      where: {
        id: pago.id,
      },
      include: [
        {
          model: Usuarios,
        },
        {
          model: LibroDiario,
          include: [
            { model: PagoEfectivo },
            {
              model: PagoDeposito,
              include: [
                {
                  model: CuentaBancaria,
                },
              ],
            },
          ],
        },
      ],
    });

    res.status(200).json(pagoSelected);
  } catch (e) {
    next(e);
  }
};

const finalizar_contrato = async (req, res, next) => {
  const { conclusiones, recomendaciones, cod, state } = req.body;
  try {
    const contratoOne = await Contrato.findOne({
      where: { codigo_contrato: cod },
    });

    const contrato_updated = await contratoOne.update({
      finalizado: true,
      state,
      conclusiones,
      recomendaciones,
      fecha_finalizacion: new Date(),
    });

    const contrato = await Contrato.findOne({
      where: {
        codigo_contrato: contrato_updated.codigo_contrato,
      },
      order: [
        [{ model: ContratoProcesoTarea }, "estado", "DESC"],
        [{ model: ContratoProcesoTarea }, "orden", "asc"],
        [{ model: ContratoProcesoTarea }, "fk_tarea", "asc"],
        [{ model: ContratoPago }, "created_at", "ASC"],
        [{ model: ContratoObservacion }, "created_at", "DESC"],
      ],
      include: [
        {
          model: Contrato_Requisito,
        },
        {
          model: Prestacion,
          include: [
            {
              model: Cuenta,
              attributes: ["id", "titulo", "ingreso", "fk_subgrupo_cuenta"],
            },
            {
              model: Servicio,
            },
          ],
        },
        {
          model: Usuarios,
          as: "titular",
        },
        {
          model: Usuarios,
          as: "suplente",
        },
        {
          model: Usuarios,
          as: "creado_por",
        },
        {
          model: ContratoPago,
          include: [
            {
              model: Usuarios,
            },
            {
              model: LibroDiario,
              include: [
                { model: PagoEfectivo },
                {
                  model: PagoDeposito,
                  include: [
                    {
                      model: CuentaBancaria,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          model: ContratoProcesoTarea,
          include: [
            {
              model: Tarea,
              as: "tarea_contrato",
            },
            {
              model: Archivo,
            },
            {
              model: Proceso,
            },
            {
              model: Usuarios,
              as: "responsable",
            },
          ],
        },
        {
          model: Clientes,
          include: [
            {
              model: Departamento,
            },
            {
              model: AfpCliente,
              include: [{ model: Afp }],
            },
          ],
        },
        {
          model: ContratoObservacion,
          include: [{ model: Usuarios, attributes: ["usuario"] }],
        },
      ],
    });
    res.status(200).json(contrato);

    // res.status(200).json(contrato_updated);
  } catch (e) {
    next(e);
  }
};

const revoke_pago = async (req, res, next) => {
  const { id } = req.params;
  try {
    const contrato = await ContratoPago.findOne({
      where: { id },
    });

    await contrato.destroy();
    await contrato.update({
      deleted_by: req.user.id,
    });

    res.status(200).json(contrato);
  } catch (e) {
    next(e);
  }
};

const contrato_tareas = async (req, res, next) => {
  const { fk_prestacion } = req.query;
  try {
    const contrato = await Contrato.findAll({
      where: {
        fk_prestacion,
        state: 0,
      },
      attributes: {
        include: [
          [
            sequelize.fn(
              "total_pagado_contrato",
              sequelize.col("contrato.codigo_contrato")
            ),
            "a_cuenta",
          ],
        ],
      },
      order: [
        ["correlativo", "DESC"],
        [
          ContratoProcesoTarea,
          { model: Tarea, as: "tarea_contrato" },
          "prioridad",
          "DESC",
        ],
        [ContratoProcesoTarea, "estado", "DESC"],
      ],
      include: [
        {
          model: ContratoProcesoTarea,
          include: [
            {
              model: Tarea,
              as: "tarea_contrato",
            },
            {
              model: Proceso,
            },
            {
              model: Usuarios,
              as: "responsable",
            },
          ],
        },
        { model: Clientes },
        { model: Departamento, as: "departamento_contrato" },
      ],
    });

    res.status(200).json(contrato);
  } catch (e) {
    next(e);
  }
};

const nueva_observacion = async (req, res, next) => {
  const { observacion, fk_contrato } = req.body;
  try {
    const new_observacion = await ContratoObservacion.create({
      observacion,
      fk_contrato,
      created_by: req.user.id,
    });

    const obs = await ContratoObservacion.findOne({
      where: {
        id: new_observacion.id,
      },
      include: [{ model: Usuarios, attributes: ["usuario"] }],
    });
    res.status(200).json(obs);
  } catch (e) {
    next(e);
  }
};

const actualizar_observacion = async (req, res, next) => {
  const { id, observacion } = req.body;
  try {
    const u_observacion = await ContratoObservacion.findOne({
      where: {
        id
      }
    });

    const obs = await u_observacion.update({
      observacion,
      updated_by: req.user.id,
    });

    const obs_complete = await ContratoObservacion.findOne({
      where: {
        id: obs.id
      },
      include: [{ model: Usuarios, attributes: ["usuario"] }],
    });

    res.status(200).json(obs_complete);
  } catch (e) {
    next(e);
  }
};

const eliminar_observacion = async (req, res, next) => {
  const { id } = req.params;
  try {
    const obs = await ContratoObservacion.findOne({
      where: {
        id
      }
    });

    await obs.destroy({
      force: true
    });

    res.status(200).json(obs);
  } catch (e) {
    next(e);
  }
};

const actualizarContrato = async (req, res, next) => {
  const { id, total } = req.body;
  try {
    const contrato = await Contrato.findOne({
      where: {
        id
      }
    });

    const contrato_up = await contrato.update({
      total,
      updated_by: req.user.id,
    });

    res.status(200).json(contrato_up);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  list,
  show,
  index,
  store,
  contratosCliente,
  store_prestaciones,
  store_titular_fechas,
  store_cc_cliente,
  store_pago,
  finalizar_contrato,
  revoke_pago,
  contrato_tareas,
  nueva_observacion,
  actualizar_observacion,
  eliminar_observacion,
  actualizarContrato,
  excel,
  tareas_seguimientos,
  store_check_fechas,
};

async function generateOrderByClause(sort) {
  let orderBy = "";
  if (sort) {
    const order = JSON.parse(sort);
    orderBy = `ORDER BY ${order[0].selector} ${order[0].desc ? 'DESC' : 'ASC'}`;
  } else {
    orderBy = `ORDER BY id DESC`;
  }
  return orderBy;
}

async function generateFilterCondition(filter) {
  let filtroCadena = "";
  if (filter) {
    const filtro = JSON.parse(filter);
    if (Array.isArray(filtro[0])) {
      filtroCadena = "WHERE " + filtro.reduce((acc, curr, index) => {
        if (typeof curr === 'string') {
          return acc + ' ' + curr + ' ';
        }
        const [field, operator, value] = curr;
        const columnName = field;
        let condition = '';
        switch (operator) {
          case 'contains':
            condition = `${columnName} ILIKE '%${value}%'`;
            break;
          case 'notcontains':
            condition = `${columnName} NOT ILIKE '%${value}%'`;
            break;
          case 'startswith':
            condition = `${columnName} ILIKE '${value}%'`;
            break;
          case 'endswith':
            condition = `${columnName} ILIKE '%${value}'`;
            break;
          case 'and':
            condition = `( ${columnName[0]} ${columnName[1]} '${columnName[2]}' and ${value[0]} ${value[1]} '${value[2]}' )`;
            break;
          default:
            condition = `${columnName} ${operator} '${value}'`;
            break;
        }
        if (index === 0) {
          return condition;
        }
        return `${acc} ${condition}`;
      }, '');
    } else {
      const [field, operator, value] = filtro;
      const columnName = field;
      let condition = '';
      switch (operator) {
        case 'contains':
          condition = `${columnName} ILIKE '%${value}%'`;
          break;
        case 'notcontains':
          condition = `${columnName} NOT ILIKE '%${value}%'`;
          break;
        case 'startswith':
          condition = `${columnName} ILIKE '${value}%'`;
          break;
        case 'endswith':
          condition = `${columnName} ILIKE '%${value}'`;
          break;
        case 'and':
          condition = `( ${columnName[0]} ${columnName[1]} '${columnName[2]}' and ${value[0]} ${value[1]} '${value[2]}' )`;
          break;
        default:
          condition = `${columnName} ${operator} '${value}'`;
          break;
      }
      filtroCadena = "WHERE " + condition;
    }
  }
  return filtroCadena;
}

async function reestablecerTareas() {
  const contratos = await Contrato.findAll({ where: { state: 0 } });

  for (const contrato of contratos) {
    console.log(contrato);
    const procesos = await Proceso.findAll({
      where: { fk_prestacion: contrato.fk_prestacion },
    });
    for (const proceso of procesos) {
      const tareas = await Tarea.findAll({
        where: { fk_proceso: proceso.id },
        order: [["prioridad", "DESC"]],
      });
      for (const tarea of tareas) {
        await ContratoProcesoTarea.create({
          tarea: tarea.titulo,
          estado: 0,
          fk_tarea: tarea.id,
          fk_contrato: contrato.id,
          fk_proceso: proceso.id,
          fk_prestacion: contrato.fk_prestacion,
        });
      }
    }
    console.log("Terminado");
  }
}

// reestablecerTareas();

async function reestablecerRequisitos() {
  const contratos = await Contrato.findAll({ where: { state: 0 } });

  for (const contrato of contratos) {
    console.log(contrato);
    const tipo_clientes = await TipoCliente.findAll({
      where: { fk_prestacion: contrato.fk_prestacion },
    });
    for (const tipo_cliente of tipo_clientes) {
      const requisitos = await Requisito.findAll({
        where: { fk_tipo_cliente: tipo_cliente.id },
      });
      for (const requisito of requisitos) {
        await Contrato_Requisito.create({
          requisito: requisito.description,
          entregado: false,
          correcto: false,
          observado: "",
          fk_tipo_cliente: tipo_cliente.id,
          fk_contrato: contrato.id,
          fk_requisito: requisito.id,
        });
      }
    }
    console.log("Terminado");
  }
}

// reestablecerRequisitos();

async function reasignarCodigoContrato() {
  const contratos = await Contrato.findAll();

  for (const contrato of contratos) {
    const cliente = await Clientes.findOne({
      where: { id: contrato.fk_cliente },
    });
    const { sigla } = await Departamento.findOne({
      where: { id: contrato.departamento },
    });
    const prestacion = await Prestacion.findOne({
      where: { id: contrato.fk_prestacion },
    });
    const codigo_contrato = `${prestacion.grupo}-${prestacion.codigo}`;

    const nuevo_contrato_correlativo = zeroPad(contrato.correlativo, 4);
    const last_codigo = `${sigla}-${cliente.ci}-${codigo_contrato}-${nuevo_contrato_correlativo}/${contrato.anio}`;

    await contrato.update({
      codigo_contrato: last_codigo,
    });
  }
  console.log("TERMINADO");
}

// reasignarCodigoContrato();
