const ErrorResponse = require("../helpers/error-response");
const TareaSeguimientoArchivo = require("../models").tarea_seguimiento_archivo;

const show_all = async (req, res, next) => {
  try {
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
  const { fk_seguimiento_tarea, archivos } = req.body;
  try {
    for (const { fk_archivo } of archivos) {
      await TareaSeguimientoArchivo.create({
        fk_seguimiento_tarea,
        fk_archivo,
        created_by: req.user.id,
      });
    }

    res.send({
      success: true,
      message: "Successfully",
    });
  } catch (e) {
    next(e);
  }
};

const store_increment = async (req, res, next) => {
  const { fk_seguimiento_tarea } = req.body;
  try {

    res.status(200).send({ success: true });
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
  } catch (e) {
    next(e);
  }
};

const destroy = async (req, res, next) => {
  const { id } = req.params;
  try {
    const tarea_archivo = await TareaSeguimientoArchivo.findOne({
      where: {
        id,
      },
    });
    await tarea_archivo.destroy();
    await tarea_archivo.update({
      deleted_by: req.user.id,
    });
    res.status(200).json(tarea_archivo);
  } catch (e) {
    next(e);
  }
};

const show_by_seguimiento_tarea = async (req, res, next) => {
  const { id } = req.params;
  try {
    const seguimientos_archivos = await TareaSeguimientoArchivo.findAll({
      where: {
        fk_seguimiento_tarea: id,
      },
    });

    res.status(200).send(seguimientos_archivos);
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
  store_increment,
  show_by_seguimiento_tarea,
};
