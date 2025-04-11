const express = require("express");
const cors = require("cors");
const path = require("path");
const fileUpload = require("express-fileupload");
const { handleErrors } = require("./helpers/error-handler");
const morgan = require("morgan");
const nullParser = require("express-query-null");
class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      auth: "/api/v1/auth",
      afp: "/api/v1/afp",
      menus: "/api/v1/menu",
      usuarios: "/api/v1/usuario",
      clientes: "/api/v1/cliente",
      niveles: "/api/v1/nivel",
      consultas: "/api/v1/cliente/consultas",
      motivos: "/api/v1/motivos",
      prestaciones: "/api/v1/prestaciones",
      contratos: "/api/v1/contratos",
      promotores: "/api/v1/promotores",
      tareas: "/api/v1/tareas",
      listacontratostareas: "/api/v1/tareas/listacontratostareas",
      seguimientos_archivos: "/api/v1/archivos/seguimientos",
      tareas_archivos: "/api/v1/archivos/tareas",
      archivos: "/api/v1/archivos",
      procesos: "/api/v1/procesos",
      servicios: "/api/v1/servicios",
      procuradores: "/api/v1/procuradores",
      requerimientos: "/api/v1/requerimientos",
      tipoclientes: "/api/v1/tipoclientes",
      cuentas_bancarias: "/api/v1/cuentas_bancarias",
      seguimientos: "/api/v1/seguimientos",
      departamentos: "/api/v1/departamentos",
      feriados: "/api/v1/feriados",
      servicios: "/api/v1/servicios",
      cuentas_grupos: "/api/v1/cuentas/grupos",
      cuentas_subgrupos: "/api/v1/cuentas/subgrupos",
      cuentas: "/api/v1/cuentas",
      libro_diario: "/api/v1/libro_diario",
      rubros: "/api/v1/rubros",
      residencias: "/api/v1/residencias",
      google_drive: "/api/v1/google_drive",

      cliente_consultas: "/api/v1/cliente_consultas",
    };

    // Middlewares
    this.middlewares();

    // Rutas de mi aplicación
    this.routes();

    // Handling errors
    this.app.use(handleErrors);
  }

  middlewares() {
    // let whitelist = ['http://localhost:8080', 'https://frontend-abba.herokuapp.com']
    // let corsOptions = {
    //     origin: function (origin, callback) {
    //         if (whitelist.indexOf(origin) !== -1) {
    //             callback(null, true)
    //         } else {
    //             callback(new Error('Not allowed by CORS'))
    //         }
    //     }
    // }
    // CORS
    this.app.use(cors());

    //Morgan en entorno dev
    this.app.use(morgan("dev"));

    // Lectura y parseo del body
    this.app.use(express.json());

    // nulls
    this.app.use(nullParser());

    // Directorio Público
    this.app.use(express.static("public"));

    // Uploads
    this.app.use("/uploads", express.static("uploads"));

    // Fileupload - Carga de archivos
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use(this.paths.auth, require("./routes/auth.routes"));
    this.app.use(this.paths.afp, require("./routes/afp.routes"));
    this.app.use(this.paths.menus, require("./routes/menus.routes"));
    this.app.use(this.paths.usuarios, require("./routes/usuario.routes"));
    this.app.use(this.paths.clientes, require("./routes/cliente.routes"));
    this.app.use(this.paths.niveles, require("./routes/nivel.routes"));
    this.app.use(this.paths.consultas, require("./routes/consultas.routes"));
    this.app.use(this.paths.motivos, require("./routes/motivos.routes"));
    this.app.use(
      this.paths.prestaciones,
      require("./routes/prestaciones.routes")
    );
    this.app.use(this.paths.contratos, require("./routes/contratos.routes"));
    this.app.use(this.paths.promotores, require("./routes/promotores.routes"));
    this.app.use(this.paths.tareas, require("./routes/tareas.routes"));
    this.app.use(
      this.paths.tareas_archivos,
      require("./routes/tareas.archivos.routes")
    );
    this.app.use(this.paths.procesos, require("./routes/procesos.routes"));
    this.app.use(
      this.paths.procuradores,
      require("./routes/procuradores.routes")
    );
    this.app.use(
      this.paths.requerimientos,
      require("./routes/requerimientos.routes")
    );
    this.app.use(
      this.paths.tipoclientes,
      require("./routes/tipo_cliente.routes")
    );
    this.app.use(
      this.paths.cuentas_bancarias,
      require("./routes/cuentas_bancarias.routes")
    );
    this.app.use(
      this.paths.seguimientos,
      require("./routes/tareas.seguimientos.routes")
    );
    this.app.use(
      this.paths.seguimientos_archivos,
      require("./routes/tareas.seguimientos.archivos.routes")
    );
    this.app.use(this.paths.feriados, require("./routes/feriados.routes"));
    this.app.use(
      this.paths.departamentos,
      require("./routes/departamentos.routes")
    );
    this.app.use(this.paths.cuentas, require("./routes/cuentas.routes"));
    this.app.use(
      this.paths.cuentas_grupos,
      require("./routes/grupos_cuentas.routes")
    );
    this.app.use(
      this.paths.cuentas_subgrupos,
      require("./routes/subgrupos_cuentas.routes")
    );
    this.app.use(
      this.paths.libro_diario,
      require("./routes/libro_diario.routes")
    );
    this.app.use(this.paths.rubros, require("./routes/rubro.routes"));
    this.app.use(this.paths.residencias, require("./routes/residencia.routes"));
    this.app.use(this.paths.archivos, require("./routes/archivos.routes"));
    this.app.use(
      this.paths.google_drive,
      require("./routes/google_drive.routes")
    );
    this.app.use(this.paths.servicios, require("./routes/servicios.routes"));
    // servicios freddy
    this.app.use(
      this.paths.cliente_consultas,
      require("./routes/cliente_consultas.routes")
    );
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en puerto", this.port);
    });
  }
}

// async function execUsers() {
//   const users = require("./clientes_csv");
//   const Clientes = require("./models").cliente;
//   const uuid = require("uuid");
//   const dayjs = require("dayjs");
//   const { Op, Sequelize: sequelize } = require("sequelize");
//   let counter = 1;
//   // console.log(users);
//   for (const user of users) {
//     const {
//       FECHA,
//       NRO_CARPETA,
//       ANIO,
//       CI,
//       NOMBRES,
//       NOMBRE,
//       APELLIDOS,
//       CELULAR,
//       CELULAR_REF,
//       SISTEMA,
//     } = user;

//     const cliente = await Clientes.findOne({
//       where: {
//         [Op.or]: [
//           sequelize.where(
//             sequelize.fn(
//               "concat",
//               sequelize.col("cliente.nombres"),
//               " ",
//               sequelize.col("cliente.apellidos")
//             ),
//             {
//               [sequelize.Op.like]: NOMBRES,
//             }
//           ),
//           { ci: `${CI}` },
//         ],
//       },
//       paranoid: false,
//     });

//     // const max = await Clientes.max("nro_expediente");
//     console.log(user);
//     // console.log(max, "MAXIMO");
//     console.log(cliente, "CLIENTE ENCONTRADO");
//     const tiene_carpeta = ANIO !== "" && NRO_CARPETA !== "";
//     debugger;
//     if (cliente) {
//       await cliente?.update({
//         nro_carpetas: tiene_carpeta
//           ? `${
//               cliente.nro_carpetas !== "" && cliente.nro_carpetas != null
//                 ? cliente.nro_carpetas + ","
//                 : ""
//             } ${ANIO}/${NRO_CARPETA}`
//           : cliente.nro_carpetas,
//         nro_expediente:
//           tiene_carpeta && !cliente.nro_expediente
//             ? counter++
//             : cliente.nro_expediente,
//       });
//       // if (tiene_carpeta && !cliente.nro_expediente) {
//       //   counter = counter + 1;
//       // }
//     } else {
//       await Clientes.create({
//         ci: CI === "" ? uuid.v4() : CI,
//         created_at: !dayjs(FECHA).isValid()
//           ? dayjs().format("YYYY-MM-DD")
//           : FECHA,
//         nombres: NOMBRE,
//         apellidos: APELLIDOS,
//         celular: parseInt(CELULAR) ? CELULAR : null,
//         celular_ref: `${CELULAR_REF}`,
//         nro_carpetas: tiene_carpeta ? `${ANIO}/${NRO_CARPETA}` : "",
//         nro_expediente: tiene_carpeta ? counter++ : null,
//         fk_expedido: 1,
//         fk_promotor: 1,
//         activo: true,
//       });
//     }
//     // if (tiene_carpeta) {
//     //   counter = counter + 1;
//     // }
//   }
//   console.log("Finalizado");
// }

// execUsers();

module.exports = Server;
