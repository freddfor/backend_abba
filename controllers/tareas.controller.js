const Tarea = require("../models").tarea;
const ProcesoTarea = require("../models").proceso_tarea;
const ContratoProcesoTarea = require("../models").contrato_proceso_tarea;
const Archivo = require("../models").archivo;
const Usuarios = require("../models").usuario;
const Proceso = require("../models").proceso;
const Contrato = require("../models").contrato;
const Cliente = require("../models").cliente;
const TareaSeguimiento = require("../models").tarea_seguimiento;
const PrestacionProceso = require("../models").prestacion_proceso;
const Prestacion = require("../models").prestacion;

const ErrorResponse = require("../helpers/error-response");
const { getPagination, getPagingData } = require("../helpers/pagination");

const show_all = async (req, res, next) => {
  try {
    const tareas = await Tarea.findAll({
      where: {
        fk_proceso: null,
      },
    });
    res.status(200).json(tareas);
  } catch (e) {
    next(e);
  }
};

const show_one = async (req, res, next) => {
  const { id } = req.params;
  try {
    const tarea = await Tarea.findOne({
      where: { id },
      include: [
        {
          model: ProcesoTarea,
        },
      ],
    });

    res.status(200).json(tarea);
  } catch (e) {
    next(e);
  }
};

const store = async (req, res, next) => {
  const { titulo, tiempo, formulario, prioridad } = req.body;

  try {
    const tarea = await Tarea.create({
      titulo,
      tiempo,
      formulario,
      prioridad,
      created_by: req.user.id,
    });
    res.status(200).json(tarea);
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  const { id } = req.params;
  const { titulo, fk_prestacion, tiempo, formulario, prioridad } = req.body;
  try {
    const tarea = await Tarea.findOne({ where: { id } });
    await tarea.update({
      titulo,
      tiempo,
      formulario,
      prioridad,
      updated_by: req.user.id,
    });

    const tarea_updated = await Tarea.findOne({
      where: {
        id,
      },
      include: [
        {
          model: ProcesoTarea,
        },
      ],
    });

    res.status(200).json(tarea_updated);
  } catch (e) {
    next(e);
  }
};

const destroy = async (req, res, next) => {
  try {
    res.status(200).json("Not implemented yet");
  } catch (e) {
    next(e);
  }
};

const show_tarea_proceso = async (req, res, next) => {
  const { id } = req.params;
  try {
    const tareas = await ContratoProcesoTarea.findOne({
      where: {
        id,
      },
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
        {
          model: Contrato,
          include: [
            {
              model: Cliente,
            },
          ],
        },
        {
          model: TareaSeguimiento,
          include: [
            {
              model: Archivo,
            },
          ],
        },
      ],
    });
    res.status(200).json(tareas);
  } catch (e) {
    next(e);
  }
};

const store_proceso_tarea = async (req, res, next) => {
  const { fk_tarea, fk_proceso } = req.body;
  try {
    // const proceso_tarea = await ProcesoTarea.create({
    //   fk_tarea,
    //   fk_proceso,
    // });

    const tarea = await Tarea.findOne({ where: { id: fk_tarea } });

    await tarea.update({
      fk_proceso,
    });

    const response = await Tarea.findOne({
      where: {
        id: fk_tarea,
      },
      attributes: ["id", "titulo", "tiempo", "formulario", "fk_proceso"],
    });

    res.status(200).send({ ...response.dataValues });
  } catch (e) {
    next(e);
  }
};

const iniciar_tareas = async (req, res, next) => {
  const { id } = req.params;
  const { fk_responsable, fecha_inicio, fecha_fin } = req.body;
  try {
    const proceso_tarea = await ContratoProcesoTarea.findOne({
      where: {
        id,
      },
    });

    await proceso_tarea.update({
      fecha_inicio,
      fecha_fin,
      fk_responsable,
      estado: 1,
      updated_by: req.user.id,
    });

    const tarea_current = await ContratoProcesoTarea.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Tarea,
          as: "tarea_contrato",
        },
        {
          model: Usuarios,
          as: "responsable",
        },
        {
          model: Proceso,
        },
        {
          model: Archivo,
        },
      ],
    });

    res.status(200).json(tarea_current);
  } catch (e) {
    next(e);
  }
};

const actualizar_tareas = async (req, res, next) => {
  const {
    id,
    fk_responsable,
    fecha_inicio,
    fecha_fin,
    estado,
    tarea,
    fk_proceso,
  } = req.body;
  try {
    const proceso_tarea = await ContratoProcesoTarea.findOne({
      where: {
        id,
      },
    });

    await proceso_tarea.update({
      tarea,
      fecha_inicio,
      fecha_fin,
      fk_responsable,
      fk_proceso,
      estado,
      updated_by: req.user.id,
    });

    const tarea_current = await ContratoProcesoTarea.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Tarea,
          as: "tarea_contrato",
        },
        {
          model: Usuarios,
          as: "responsable",
        },
        {
          model: Proceso,
        },
        {
          model: Archivo,
        },
      ],
    });

    res.status(200).json(tarea_current);
  } catch (e) {
    next(e);
  }
};

const store_tarea_contrato = async (req, res, next) => {
  const { fk_responsable, fk_proceso, tarea, fk_prestacion, fk_contrato } =
    req.body;
  try {
    const proceso_tarea = await ContratoProcesoTarea.create({
      fk_tarea: tarea.id,
      estado: 0,
      tarea: tarea.titulo,
      fk_proceso,
      fk_prestacion,
      fk_responsable,
      fk_contrato,
    });

    const tarea_current = await ContratoProcesoTarea.findOne({
      where: {
        id: proceso_tarea.id,
      },
      include: [
        {
          model: Tarea,
          as: "tarea_contrato",
        },
        {
          model: Usuarios,
          as: "responsable",
        },
        {
          model: Proceso,
        },
        {
          model: Archivo,
        },
      ],
    });

    res.status(200).json(tarea_current);
  } catch (e) {
    next(e);
  }
};

const destroy_tarea_proceso = async (req, res, next) => {
  const { id } = req.params;
  try {
    const tarea_proceso = await ProcesoTarea.findOne({
      where: {
        id,
      },
    });

    console.log(tarea_proceso);

    await tarea_proceso.destroy();

    res.status(200).json(tarea_proceso);
  } catch (e) {
    next(e);
  }
};

const destroy_tarea_contrato = async (req, res, next) => {
  const { id } = req.params;
  try {
    const tarea_procurador = await ContratoProcesoTarea.findOne({
      where: {
        id,
      },
    });

    tarea_procurador.destroy();

    res.status(200).json(tarea_procurador);
  } catch (e) {
    next(e);
  }
};

const show_tarea_archivos = async (req, res, next) => {
  const { id } = req.params;
  // console.log(id);
  try {
    const tarea_archivos = await Archivo.findAll({
      where: {
        fk_tarea: id,
      },
    });

    res.status(200).json(tarea_archivos);
  } catch (e) {
    next(e);
  }
};

const store_tarea_contrato_lotes = async (req, res, next) => {
  const { fk_responsable, fk_proceso, tareas, fk_prestacion, fk_contrato } =
    req.body;
  try {
    let tareas_lotes = [];

    const result = await PrestacionProceso.findOne({
      where: {
        fk_prestacion,
        fk_proceso,
      },
    });

    for (const tarea of tareas) {
      const proceso_tarea = await ContratoProcesoTarea.create({
        fk_tarea: tarea.id,
        estado: 0,
        tarea: tarea.titulo,
        fk_proceso,
        fk_prestacion,
        fk_responsable,
        fk_contrato,
        orden: result.id,
      });

      const tarea_current = await ContratoProcesoTarea.findOne({
        where: {
          id: proceso_tarea.id,
        },
        include: [
          {
            model: Tarea,
            as: "tarea_contrato",
          },
          {
            model: Usuarios,
            as: "responsable",
          },
          {
            model: Proceso,
          },
          {
            model: Archivo,
          },
        ],
      });

      tareas_lotes.push(tarea_current);
    }

    res.status(200).json(tareas_lotes);
  } catch (e) {
    next(e);
  }
};

const lista_contratos_tareas = async (req, res, next) => {
  try {
    let page = req.query["pagenum"];
    const { sortdatafield, sortorder } = req.query;
    let size = req.query["pagesize"];
    let search = req.query["search"];
    const { limit, offset } = getPagination(page, size);
    console.log(limit, offset, "LIMIT AND OFFSET");
    const response = await Tarea.listaContratosTareas(limit, offset, {
      sortdatafield,
      sortorder,
    });
    const count = await Contrato.count();
    res.status(200).json({ rows: response, totalItems: count });
  } catch (e) {
    next(e);
  }
};

const lista_tareas = async (req, res, next) => {
  const { fk_prestacion } = req.query;
  try {
    let fk_usuario = 0;
    if(req.user.fk_nivel == 2){
      fk_usuario = req.user.id
    }
    const response = await Tarea.listaTareas(fk_prestacion,fk_usuario);
    res.status(200).json({ rows: response });
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
  show_tarea_proceso,
  store_proceso_tarea,
  iniciar_tareas,
  actualizar_tareas,
  store_tarea_contrato,
  destroy_tarea_proceso,
  destroy_tarea_contrato,
  show_tarea_archivos,
  store_tarea_contrato_lotes,
  lista_contratos_tareas,
  lista_tareas
};

// async function runExec() {
//   const proceso_tarea = await ProcesoTarea.findAll();
//   for (const pt of proceso_tarea) {
//     const tarea = await Tarea.findOne({where: {id: pt.fk_tarea}});
//     tarea.update({fk_proceso: pt.fk_proceso});
//   }
// }
// runExec();
