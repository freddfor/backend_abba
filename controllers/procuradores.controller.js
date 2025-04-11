const dayjs = require("dayjs");
const { Op, Sequelize: sequelize } = require("sequelize");

const ErrorResponse = require("../helpers/error-response");
const { generarJWT } = require("../helpers/generar-jwt");
const { AdicionarDias } = require("../helpers/sumarDias");
const Clientes = require("../models").cliente;
const Feriado = require("../models").feriado;
const Proceso = require("../models").proceso;
const Departamento = require("../models").departamento;
const Contrato = require("../models").contrato;
const Procuradores = require("../models").procurador;
const ContratoProcesoTarea = require("../models").contrato_proceso_tarea;
const Tarea = require("../models").tarea;
const TareaArchivo = require("../models").tarea_archivo;
const Archivo = require("../models").archivo;
const Usuarios = require("../models").usuario;

// const sequelize = require('sequelize');

const show_all = async (req, res, next) => {
  try {
    // const procuradores = await Usuarios.findAll({
    //   where: {
    //     fk_nivel: 1,
    //   },
    // });
    const procuradores = await Usuarios.findAll({
      where: { is_active: true },
      attributes: { exclude: ["deleted_by", "deleted_at"] },
    });

    res.status(200).json(procuradores);
  } catch (e) {
    next(e);
  }
};

const show_one = async (req, res, next) => {
  const { id } = req.params;
  try {
    const procurador = await Procuradores.findOne({
      where: { id, fk_nivel: 2 },
    });
    res.status(200).json(procurador);
  } catch (e) {
    next(e);
  }
};

const store = async (req, res, next) => {
  const { nombres, apellidos, ci, celular, usuario, password, email } =
    req.body;
  try {
    const user = await Usuarios.findOne({ where: { email } });
    if (user && usuario == user.usuario) {
      throw new ErrorResponse(1323);
    }

    const newUser = await Usuarios.create({
      usuario,
      password,
      nombres,
      apellidos,
      email,
      fk_nivel: 2,
      baja_logica: false,
      ci,
      celular,
      created_by: req.user.id,
      updated_by: req.user.id,
    });

    const token = await generarJWT(newUser.id);

    res.status(200).json({
      success: true,
      message: "Usuario creado exitosamente",
      data: {
        user: newUser,
        token,
      },
    });
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  const { id, nombres, apellidos, carnet, celular, email, password, username } =
    req.body;

  try {
    const procurador = await Usuarios.findOne({ where: { id } });
    const procuradorUpdated = await procurador.update({
      nombres,
      apellidos,
      carnet,
      celular,
      email,
      password,
      username,
      updated_by: req.user.id,
      baja_logica: false,
    });
    // console.log("update password");
    res.status(200).json(procuradorUpdated);
  } catch (e) {
    next(e);
  }
};



const destroy = async (req, res, next) => {
  const { id } = req.params;
  try {
    const procurador = await Usuarios.findOne({ where: { id } });
    const procuradorDeleted = await procurador.update({
      updated_by: req.user.id,
      baja_logica: true,
    });
    res.status(200).json(procuradorDeleted);
  } catch (e) {
    next(e);
  }
};

const show_tasks_month = async (req, res, next) => {
  const { mes, anio, estado } = req.query;
  try {
    const procurador = await ContratoProcesoTarea.findAll({
      where: {
        estado,
        [Op.and]: [
          { fk_responsable: req.user.id },
          sequelize.where(
            sequelize.literal(
              'extract(MONTH FROM "contrato_proceso_tarea"."fecha_inicio")'
            ),
            "=",
            mes
          ),
          sequelize.where(
            sequelize.literal(
              'extract(YEAR FROM "contrato_proceso_tarea"."fecha_inicio")'
            ),
            "=",
            anio
          ),
        ],
      },
      order: [["estado", "DESC"]],
      include: [
        {
          model: Contrato,
          where: {
            state: 0
          },
          include: [
            {
              model: Clientes,
            },
          ],
        },
        {
          model: Archivo,
        },
        {
          model: Tarea,
          as: "tarea_contrato",
        },
      ],
    });
    res.status(200).json(procurador);
  } catch (e) {
    next(e);
  }
};

const show_tasks = async (req, res, next) => {
  const { estado, fecha, filtro } = req.query;
  console.log(estado, fecha, filtro, 'datos ----');
  try {
    let orderBy;
    if (estado === 1) {
      orderBy = ["fecha_fin", "ASC"];
    } else {
      orderBy = ["fecha_conclusion", "DESC"];
    }
    const procurador = await ContratoProcesoTarea.findAll({
      where: {
        fk_responsable: req.user.id,
        estado,
        [Op.and]: [
          sequelize.where(
            sequelize.fn("date", sequelize.col("fecha_inicio")), "<=", fecha
          ),
          sequelize.where(
            sequelize.fn("date", sequelize.col("fecha_fin")), ">=", fecha
          ),
          {
            [Op.or]: [
              sequelize.where(
                sequelize.fn("lower", sequelize.col("tarea")),
                "like",
                `%${filtro.toLowerCase()}%`
              ),
              sequelize.where(
                sequelize.fn("lower", sequelize.col("contrato.codigo_contrato")),
                "like",
                `%${filtro.toLowerCase()}%`
              ),
              sequelize.where(
                sequelize.fn("lower", sequelize.col("contrato.cliente.nombres")),
                "like",
                `%${filtro.toLowerCase()}%`
              ),
              sequelize.where(
                sequelize.fn("lower", sequelize.col("contrato.cliente.apellidos")),
                "like",
                `%${filtro.toLowerCase()}%`
              ),
            ],
          },
        ],
      },
      order: [orderBy],
      include: [
        {
          model: Contrato,
          where: {
            state: 0,
          },
          include: [
            {
              model: Clientes,
            },
          ],
        },
        {
          model: Archivo,
        },
        {
          model: Tarea,
          as: "tarea_contrato",
        },
      ],
    });


    // const procurador = await ContratoProcesoTarea.findAll({
    //   where: {
    //     fk_responsable: req.user.id,
    //     estado,
    //     [Op.and]: [
    //       sequelize.where(
    //         sequelize.fn("date", sequelize.col("fecha_inicio")), "<=", fecha
    //       ),
    //       sequelize.where(
    //         sequelize.fn("date", sequelize.col("fecha_fin")), ">=", fecha
    //       ),
    //     ],
    //     [Op.or]: [
    //       {
    //         tarea: {
    //           [Op.iLike]: `%${filtro}%`
    //         },
    //       },
    //     ],
    //   },
    //   order: [orderBy],
    //   include: [
    //     {
    //       model: Contrato,
    //       where: {
    //         state: 0,
    //       },
    //       include: [
    //         {
    //           model: Clientes,
    //         },
    //       ],
    //     },
    //     {
    //       model: Archivo,
    //     },
    //     {
    //       model: Tarea,
    //       as: "tarea_contrato",
    //     },
    //   ],
    // });
    res.status(200).json(procurador);
  } catch (e) {
    next(e);
  }
};

const complete_task = async (req, res, next) => {
  const { id } = req.params;
  const { detalle, sucursal_id } = req.body;
  try {
    const procurador_tarea = await ContratoProcesoTarea.findOne({
      where: { id },
      include: [{ model: Tarea, as: "tarea_contrato" }, { model: Proceso }],
    });

    if (procurador_tarea.tarea_contrato.prioridad === 1) {
      const { fk_proceso, tiempo_espera } = procurador_tarea.proceso;
      const tareas = await ContratoProcesoTarea.findAll({
        where: { fk_proceso, fk_contrato: procurador_tarea.fk_contrato },
        include: [{ model: Tarea, as: "tarea_contrato" }, { model: Proceso }],
      });

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

      for (const tarea of tareas) {
        if (tarea.tarea_contrato.prioridad === 1) {
          const inicio = await AdicionarDias(
            dayjs(),
            tiempo_espera,
            normalizeFeriados
          );
          const fin = await AdicionarDias(
            dayjs(inicio),
            tarea.tarea_contrato.tiempo,
            normalizeFeriados
          );

          // console.log(normalizeFeriados, "normalizeFeriados");
          // console.log(tiempo_espera, "tiempo_espera");
          // console.log(inicio, "inicio");
          // console.log(fin, "fin");
          await tarea.update({
            estado: 1,
            fecha_inicio: inicio,
            fecha_fin: fin,
            fk_responsable: req.user.id,
          });
        }
      }
    }

    const procuradorUpdated = await procurador_tarea.update({
      estado: 2,
      fecha_conclusion: new Date(),
      detalle,
    });
    res.status(200).json(procuradorUpdated);
  } catch (e) {
    next(e);
  }
};

const update_task = async (req, res, next) => {
  const { id, detalle } = req.body;
  try {
    const procurador_tarea = await ContratoProcesoTarea.findOne({
      where: { id },
    });

    const updated_tarea = await procurador_tarea.update({
      detalle,
    });

    res.status(200).json(updated_tarea);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  show_all,
  show_one,
  show_tasks,
  show_tasks_month,
  store,
  update,
  destroy,
  complete_task,
  update_task,
};
