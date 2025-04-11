const Tarea = require("../models").tarea;
const ProcesoTarea = require("../models").proceso_tarea;
const ContratoProcesoTarea = require("../models").contrato_proceso_tarea;
const TareaArchivo = require("../models").tarea_archivo;
const Usuarios = require("../models").usuario;
const Proceso = require("../models").proceso;
const PrestacionProceso = require("../models").prestacion_proceso;
const Prestacion = require("../models").prestacion;

const ErrorResponse = require("../helpers/error-response");
const fs = require("fs").promises;
const dayjs = require("dayjs");
const path = require("path");

const show_all = async (req, res, next) => {
  try {
    res.sendFile(__dirname + "/archivos/tareas/" + "tarea 1.jpg");
  } catch (e) {
    next(e);
  }
};

const show_one = async (req, res, next) => {
  const { id } = req.params;
  try {
    const tarea = await TareaArchivo.findOne({ where: { id } });

    res.sendFile(path.join(__dirname, tarea.path));
  } catch (e) {
    next(e);
  }
};

const store = async (req, res, next) => {
  const { fk_proceso_tarea, archivos } = req.body;
  try {
    for (const { fk_archivo } of archivos) {
      console.log(fk_archivo, "FK_ARCHIVO");
      await TareaArchivo.create({
        fk_proceso_tarea,
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

const update = async (req, res, next) => {
  const { id } = req.params;
  const { titulo, fk_prestacion, tiempo, formulario } = req.body;
  try {
    const tarea = await Tarea.findOne({ where: { id } });
    await tarea.update({
      titulo,
      tiempo,
      formulario,
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
  const { id } = req.params;
  try {

    const tarea_archivo = await TareaArchivo.findOne({
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

const store_increment = async (req, res, next) => {
  const { codigo_contrato, carnet_cliente, fk_tarea } = req.body;
  try {
    // console.log(req.body);
    // <carnet>_<codigo_contrato>_<fecha_hora>_<nombre_del_archivo>
    // pdf, jpg, jpeg, png, word, excel, power point.
    let uploadFiles = [];
    let newTareas = [];
    let saveArchivos = [];

    if (!req.files.archivos.length) {
      uploadFiles.push(req.files.archivos);
    } else {
      uploadFiles = req.files.archivos;
    }

    uploadFiles.forEach(async (archivo) => {
      const nombre_concatenado =
        carnet_cliente +
        "_" +
        codigo_contrato.split("/")[0] +
        "-" +
        codigo_contrato.split("/")[1] +
        "_" +
        `${dayjs().format("YYYY-MM-DDTHmsSSS")}` +
        "_" +
        archivo.name;

      const split = archivo.name.split(".");
      const nombre_completo = split[0];
      const tipo_archivo = split[1];

      const ruta = path.join("/archivos/tareas/", nombre_concatenado);

      const nuevo_archivo = await TareaArchivo.create({
        nombre_concatenado,
        fk_tarea,
        path: ruta,
        created_by: req.user.id,
        updated_by: req.user.id,
        tamanio: archivo.size,
        nombre_completo,
        tipo_archivo,
        mime_type: archivo.mimetype,
      });

      archivo.mv(path.join(__dirname, ruta), function (err) {
        if (err) console.log(err);
        console.log("File uploaded!");
      });
    });

    res.status(200).send(newTareas);
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
};
