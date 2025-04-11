const Proceso = require("../models").proceso;
const PrestacionProceso = require("../models").prestacion_proceso;
const Tarea = require("../models").tarea;
const Prestacion = require("../models").prestacion;

const ErrorResponse = require("../helpers/error-response");

const show_all = async (req, res, next) => {
  try {
    const procesos = await Proceso.findAll({ where: { fk_prestacion: null } });
    res.status(200).json(procesos);
  } catch (e) {
    next(e);
  }
};

const show_one = async (req, res, next) => {
  const { id } = req.params;
  try {
    const proceso = await Proceso.findOne({ where: { id } });
    res.status(200).json(proceso);
  } catch (e) {
    next(e);
  }
};

const store = async (req, res, next) => {
  const { titulo } = req.body;

  try {
    const new_proceso = await Proceso.create({
      titulo,
    });

    res.status(200).json(new_proceso);
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  const { id, titulo, fk_proceso, tiempo_espera } = req.body;
  try {
    const proceso = await Proceso.findOne({ where: { id } });
    await proceso.update({
      titulo,
      fk_proceso,
      tiempo_espera,
    });
    return res.status(200).send(req.body);
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

const show_by_prestacion = async (req, res, next) => {
  const { id } = req.params;
  try {
    const procesos = await Prestacion.findAll({
      where: {
        id,
      },
      include: [
        {
          model: Proceso,
          include: [
            {
              model: Tarea,
              attributes: ["id", "titulo", "tiempo", "formulario", "prioridad"],
            },
          ],
        },
      ],
      order: [
        [Proceso, "id", "ASC"],
        [Proceso, Tarea, "prioridad", "DESC"],
      ],
    });
    res.status(200).json(procesos);
  } catch (e) {
    next(e);
  }
};

const store_prestacion_proceso = async (req, res, next) => {
  const { fk_prestacion, fk_proceso } = req.body;
  console.log(req.body);
  try {
    const proceso = await Proceso.findOne({
      where: {
        id: fk_proceso,
      },
    });

    await proceso.update({
      fk_prestacion,
    });

    const response = await Proceso.findOne({
      where: {
        id: fk_proceso,
      },
      include: [
        {
          model: Tarea,
          attributes: ["id", "titulo", "tiempo", "formulario"],
        },
      ],
    });
    res.status(200).json({ ...response.dataValues });
  } catch (e) {
    next(e);
  }
};

const destroy_prestacion_proceso = async (req, res, next) => {
  // const { id } = req.params;
  try {
    // const prestacion_proceso = await PrestacionProceso.findOne({
    //   where: {
    //     id,
    //   },
    // });

    // prestacion_proceso.destroy();

    res.status(200).json(true);
  } catch (e) {
    next(e);
  }
};

const update_prestacion_proceso = async (req, res, next) => {
  const { fk_prestacion, fk_proceso } = req.body;
  try {
    // const prestacion_proceso = await PrestacionProceso.create({
    //   fk_prestacion,
    //   fk_proceso,
    // });

    const proceso = await Proceso.find({
      id: fk_proceso,
    });

    await proceso.update({
      fk_prestacion,
    });

    const response = await Proceso.findOne({
      where: {
        id: fk_proceso,
      },
      include: [
        {
          model: Tarea,
          attributes: ["id", "titulo", "tiempo", "formulario"],
        },
      ],
    });
    res.status(200).json({ ...response.dataValues });
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
  store_prestacion_proceso,
  update_prestacion_proceso,
  destroy_prestacion_proceso,
};

// async function runExec() {
//   const prestacion_proceso = await PrestacionProceso.findAll();
//   for (const pt of prestacion_proceso) {
//     const proceso = await Proceso.findOne({where: {id: pt.fk_proceso}});
//     proceso.update({fk_prestacion: pt.fk_prestacion});
//   }
//   console.log('finalizado');
// }
// runExec();
