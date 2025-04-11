const Archivo = require("../models").archivo;

const { Duplex } = require("stream");
const GOOGLE_API_FOLDER_ID = "1nGJ3Q_gX7KmAx6HAx67Xwtr0hk0LyI6F";

const ErrorResponse = require("../helpers/error-response");
const fs = require("fs");
const carbone = require("carbone");
const dayjs = require("dayjs");
const path = require("path");
const { drive } = require("../helpers/google-drive-api");
const { NumeroALetras } = require("../helpers/numerosALetras");

function bufferToStream(myBuuffer) {
  let tmp = new Duplex();
  tmp.push(myBuuffer);
  tmp.push(null);
  return tmp;
}

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
    const tarea = await Archivo.findOne({ where: { id } });

    res.sendFile(path.join(__dirname, tarea.path));
  } catch (e) {
    next(e);
  }
};

const store = async (req, res, next) => {
  const { nombre_archivo, carpeta } = req.body;
  try {
    let archivos_subidos = [];
    // <carnet>_<codigo_contrato>_<fecha_hora>_<nombre_del_archivo>
    // pdf, jpg, jpeg, png, word, excel, power point.
    let uploadFiles = [];

    if (!req.files.archivos.length) {
      uploadFiles.push(req.files.archivos);
    } else {
      uploadFiles = req.files.archivos;
    }

    for (const archivo in uploadFiles) {
      if (Object.hasOwnProperty.call(uploadFiles, archivo)) {
        const nombre_concatenado =
          nombre_archivo +
          "_" +
          `${dayjs().format("YYYY-MM-DDTHmsSSS")}` +
          "_" +
          uploadFiles[archivo].name;

        const split = uploadFiles[archivo].name.split(".");
        const nombre_completo = split[0];
        const tipo_archivo = split[1];

        const fileupload = await drive.files.create({
          requestBody: {
            name: nombre_concatenado,
            mimeType: uploadFiles[archivo].mimetype,
            parents: [GOOGLE_API_FOLDER_ID],
          },
          media: {
            mimeType: uploadFiles[archivo].mimetype,
            body: fs.createReadStream(uploadFiles[archivo].tempFilePath),
          },
          fields:
            "id,name,mimeType,webContentLink,webViewLink,iconLink,size,hasThumbnail,thumbnailLink",
        });

        await drive.permissions.create({
          fileId: fileupload.data.id,
          requestBody: {
            role: "reader",
            type: "anyone",
          },
        });

        const permissions = await drive.files.get({
          fileId: fileupload.data.id,
          fields: "webViewLink, webContentLink",
        });

        console.log(fileupload.data);

        const archivo_subido = await Archivo.create({
          drive_id: fileupload.data.id,
          nombre_concatenado: fileupload.data.name,
          created_by: req.user.id,
          updated_by: req.user.id,
          tamanio: fileupload.data.size,
          nombre_completo,
          tipo_archivo,
          mime_type: fileupload.data.mimeType,
          webContentLink: permissions.data.webContentLink,
          webViewLink: permissions.data.webViewLink,
          iconLink: fileupload.data.iconLink,
          hasThumbnail: fileupload.data.hasThumbnail,
          thumbnailLink: fileupload.data.thumbnailLink,
        });

        archivos_subidos.push(archivo_subido);
      }
    }

    res.status(200).send(archivos_subidos);
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
    const archivo = await Archivo.findOne({
      where: {
        id,
      },
    });

    await drive.files.delete({ fileId: archivo.drive_id });

    await archivo.destroy();
    await archivo.update({
      deleted_by: req.user.id,
    });
    res.status(200).json(archivo);
  } catch (e) {
    next(e);
  }
};

const generar_contrato = (req, res, next) => {
  const { contrato, usuario } = req.body;
  console.log(contrato.cliente.nro_expediente);
  console.log(contrato);
  let requerimientosNormalize = [];
  for (const tipo_cliente in contrato.contrato_requisitos) {
    const element = contrato.contrato_requisitos[tipo_cliente];
    // console.log(element.requisitos[0]);
    requerimientosNormalize.push({
      cliente: element.cliente.titulo,
      requisitos: element.requisitos.map(r => ({ ...r, entregado: r.entregado ? 'Si' : 'No' }))
    });
  }

  let pagos_contrato = [];
  let primer_pago = 0
  let primer_saldo = 0
  for (let index = 0; index < contrato.contrato_pagos.length; index++) {
    const element = contrato.contrato_pagos[index]
    if (index === 0) {
      primer_pago = element.libro_diario.monto
      primer_saldo = element.saldo
    }
    pagos_contrato.push({ fecha: element.libro_diario.fecha, monto: element.libro_diario.monto, saldo: element.saldo })
  }

  // console.log(pagos_contrato);

  // console.log(requerimientosNormalize);
  var data = {
    prestacion: contrato.prestacion.nombre,
    cliente: contrato.cliente.nombres.toUpperCase() + ' ' + contrato.cliente.apellidos.toUpperCase(),
    afp: contrato.cliente.afp_cliente ? contrato.cliente.afp_cliente.afp.nombre.toUpperCase(): 'DESCONOCIDO',
    afp_username: contrato.cliente.afp_cliente?.username,
    afp_cua: contrato.cliente.afp_cliente?.cua,
    ci: `${contrato.cliente.ci} ${contrato.cliente.departamento.sigla}`,
    celular: contrato.cliente.celular,
    fecha_c: dayjs(contrato.created_at).format('DD/MM/YYYY'),
    codigo: contrato.cliente.nro_expediente,
    profesion: contrato.cliente.profesion,
    lugar_trabajo: contrato.cliente.lugar_trabajo,
    requerimientos: requerimientosNormalize,
    pagos: pagos_contrato,
    total: contrato.total,
    total_literal: `${NumeroALetras(parseInt(contrato.total)).toUpperCase()}`,
    sub_total: parseInt(contrato.total) - 1200,
    sub_total_literal: `${NumeroALetras(parseInt(contrato.total) - 1200).toUpperCase()}`,
    usuario_nombre: `${usuario.nombres} ${usuario.apellidos}`,
    usuario_ci: usuario.ci,
    fecha_actual: `${dayjs().format('DD')} de ${dayjs().format('MMMM')} de ${dayjs().format('YYYY')}`,
  };
  carbone.render(
    "./controllers/archivos/plantillas/contratos/contrato.docx",
    data,
    function (err, result) {
      if (err) {
        return console.log(err);
      }
      // write the result
      // const fileName = "plantilla_contrato.docx";
      // let fileContents = Buffer.from(result, "base64");
      // let savedFilePath = __dirname + fileName; // in some convenient temporary file folder
      // fs.writeFile(savedFilePath, fileContents, function () {
      //   res.status(200).download(savedFilePath, fileName);
      // });
      const fileData = result;
      const fileName = "hello_world.docx";
      const fileType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

      res.writeHead(200, {
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Type": fileType,
      });

      const download = Buffer.from(fileData, "base64");
      res.end(download);
    }
  );
};

module.exports = {
  show_all,
  show_one,
  store,
  update,
  destroy,
  generar_contrato,
};
