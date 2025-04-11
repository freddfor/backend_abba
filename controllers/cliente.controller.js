const Promotores = require("../models").promotor;
const Clientes = require("../models").cliente;
const Prestacion = require("../models").prestacion;
const Proceso = require("../models").proceso;
const Promotor = require("../models").promotor;
const Departamento = require("../models").departamento;
const Rubro = require("../models").rubro;
const Afp = require("../models").afp;
const AfpCliente = require("../models").afp_cliente;
const Residencia = require("../models").residencia;
// const Motivos = require("../models").motivo;
const Contratos = require("../models").contrato;
const ContratoRequisitos = require("../models").contrato_requisito;
const ContratoProcesoTarea = require("../models").contrato_proceso_tarea;
const ClienteTareas = require("../models").cliente_tarea;
const ExcelJS = require('exceljs');
const ErrorResponse = require("../helpers/error-response");
const uuid = require("uuid");
const dayjs = require("dayjs");

const { Op, Sequelize: sequelize } = require("sequelize");

const { getPagingData, getPagination } = require("../helpers/pagination");
const { sortBuilder } = require("../helpers/sort");

const include_client = [
  { model: AfpCliente, include: [{ model: Afp }] },
  {
    model: Departamento,
    attributes: ["id", "nombre", "sigla"],
  },
  {
    model: Rubro,
    attributes: ["id", "nombre"],
  },
  {
    model: Residencia,
    attributes: ["id", "nombre"],
  },
  {
    model: Promotor,
    attributes: ["id", "nombre"],
  },
];
/**
 * Obtiene el listado de usuarios.
 * @route GET /api/v1/user
 * @author Carlos Ramirez <cramirez@miteleferico.bo>
 * @access Private/Admin
 * @version 1.0.0
 * @param {Request} req - Request of the api.
 * @param {Response} res - Response of the api.
 */
const index = async (req, res) => {
  let page = req.query["page"];
  let size = req.query["size"];
  let search = req.query["search"];

  const { filterField, filterValue, filterValueTwo } = req.query;

  const { sortBy, orderBy } = sortBuilder(
    req.query["sortBy"],
    req.query["orderBy"]
  );
  const { limit, offset } = getPagination(page, size);

  let where = {};
  let filtering = {};

  if (filterField === "fecha_nac") {
    filtering = {
      fecha_nac: {
        [Op.between]: [
          filterValue,
          dayjs(filterValueTwo).add(1, "day").format("YYYY-MM-DD"),
        ],
      },
    };
  }

  let whereSearch = {};

  if (search !== "" && search) {
    whereSearch = {
      [Op.or]: [
        { nombres: { [Op.iLike]: `%${search.toLowerCase()}%` } },
        { apellidos: { [Op.iLike]: `%${search.toLowerCase()}%` } },
        { correo: { [Op.iLike]: `%${search.toLowerCase()}%` } },
        { ci: { [Op.iLike]: `%${search.toLowerCase()}%` } },
        // { celular: { [Op.iLike]: `%${search}%` } },
        sequelize.where(
          sequelize.cast(sequelize.col("cliente.celular"), "varchar"),
          { [Op.iLike]: `%${search.toLowerCase()}%` }
        ),
      ],
    };
  }

  where = {
    where: {
      ...whereSearch,
      ...filtering,
      activo: true,
    },
  };

  const result = await Clientes.findAndCountAll({
    include: include_client,
    // attributes: {
    //   include: [
    //     [
    //       sequelize.fn("nro_contratos", false, sequelize.col("cliente.id")),
    //       "contratos_activos",
    //     ],
    //     [
    //       sequelize.fn("nro_contratos", true, sequelize.col("cliente.id")),
    //       "contratos_finalizados",
    //     ],
    //     [
    //       sequelize.fn("total_recaudado", sequelize.col("cliente.id")),
    //       "recaudado",
    //     ],
    //   ],
    // },
    // ...where,
    // order: [[sortBy, orderBy]],
    limit,
    offset,
  });

  const clientes = getPagingData(result, page, limit, offset);

  res.send(clientes);
};

/**
 * Obtiene el un usuario por id
 * @route GET /api/v1/user/:id
 * @author Carlos Ramirez <cramirez@miteleferico.bo>
 * @access Private/Admin
 * @version 1.0.0
 * @param {Request} req - Request of the api.
 * @param {Response} res - Response of the api.
 */
const list = async (req, res, next) => {

  try {
    const { skip, take, requireTotalCount, sort, filter } = req.query;
    const filtroCadena = await generateFilterCondition(filter);
    const orderBy = await generateOrderByClause(sort);
    const limite = `limit ${take} offset ${skip}`;

    const rows = await Clientes.listClientes(filtroCadena, orderBy, limite);
    const result = await Clientes.countClientes(filtroCadena);
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
  } catch (e) {
    next(e);
  }
};

const excel = async (req, res, next) => {

  try {
    const { skip, take, requireTotalCount, sort, filter } = req.query;
    const filtroCadena = await generateFilterCondition(filter);
    const orderBy = await generateOrderByClause(sort);
    const rows = await Clientes.listClientes(filtroCadena, orderBy);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('clientes');
    // Agregar encabezados
    worksheet.addRow([
      "Nro",
      "Exp.",
      "Cliente",
      "CI",
      "Fecha Nacimiento",
      "Edad",
      "Celular",
      "Rubro",
      "AFP",
      "CUA",
      "Estado",
      "Fecha Creacion",
    ]);

    rows.forEach((x, i) => {
      worksheet.addRow([
        i + 1,
        x.nro_expediente,
        x.cliente,
        x.ci_exp,
        x.fecha_nac,
        x.edad,
        x.celular,
        x.rubro,
        x.afp,
        x.cua,
        x.estado,
        x.created_at,
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

const getEdad = fecha => {
  const actual = dayjs()
  const nacimiento = dayjs(fecha)
  return actual.diff(nacimiento, 'year')
}

const list_clientes = async (req, res, next) => {
  try {

    const clientes = await Clientes.findAll({
      attributes: ['id', 'nombres', 'apellidos', 'fecha_nac', 'ci', 'nro_expediente', 'nro_carpetas', 'celular', 'activo', 'created_at'],
      include: [{
        model: Departamento,
        attributes: ['sigla']
      },
        // {
        //   model: Contratos,
        //   attributes: ['codigo_contrato', [sequelize.fn('saldo_contrato_actual', sequelize.col('contratos.id')), 'saldo'],],
        //   required: false,
        //   include: [{
        //     model: ContratoProcesoTarea,
        //     attributes: ['tarea', 'estado'],
        //     include: {
        //       model: Proceso,
        //       attributes: ['titulo'],
        //     },
        //     required: false,
        //     where: { estado: 1 }
        //   },
        //   {
        //     model: Prestacion,
        //     attributes: ['nombre']
        //   }
        //   ]
        // },
        // {
        //   model: Rubro,
        //   attributes: ['nombre']
        // }
      ],
    });

    res.status(200).json(clientes.map((cliente) => {
      const c = cliente.dataValues;
      return {
        id: c.id,
        nro_expediente: c.nro_expediente,
        ci: c.ci,
        ci_exp: `${c.ci} ${c.departamento?.sigla}`,
        nombres: c.nombres,
        apellidos: c.apellidos,
        cliente: `${c.nombres} ${c.apellidos}`,
        fecha_nac: c.fecha_nac,
        edad: getEdad(c.fecha_nac),
        celular: c.celular,
        // proceso_activo: c.contratos.map(c => (c.contrato_proceso_tareas[0]?.proceso?.titulo ?? 'NO HAY UN PROCESO ACTIVO')),
        // prestacion_activa: c.contratos.map(c => (c.prestacion?.nombre)),
        // saldo: c.contratos.map(c => c.dataValues.saldo === 0 ? '<p style="color: #5499C7;">CANCELADO</p>' : c.dataValues.saldo),
        rubro: c.rubro?.nombre,
        cua: c.afpCliente?.cua,
        activo: c.activo,
        created_at: c.created_at
      }
    }));
    // res.status(200).json(clientes);
  } catch (e) {
    next(e);
  }
};


/**
 * Obtiene el un usuario por id
 * @route GET /api/v1/user/:id
//  * @author Carlos Ramirez <cramirez@miteleferico.bo>
 * @access Private/Admin
 * @version 1.0.0
 * @param {Request} req - Request of the api.
 * @param {Response} res - Response of the api.
 */
const show = async (req, res) => {
  const { id } = req.params;
  const cliente = await Clientes.findOne({
    where: {
      id,
    },
    include: include_client,
  });
  if (!cliente) {
    return res.status(400).send({ message: "El cliente no existe" });
  }

  res.status(200).send(cliente);
};

const search = async (req, res) => {
  const { ci } = req.params;
  const cliente = await Clientes.findOne({
    where: {
      ci,
    },
    include: include_client,
    // include: [
    //   ...include_client,
    //   {
    //     model: Motivos
    //   }
    // ],
  });

  if (!cliente) {
    return res.status(400).send({ message: "El cliente no existe" });
  }

  res.status(200).send(cliente);
};

/**
 * Guarda una nueva instancia de usuario
 * @route POST /api/v1/cliente
 * @author Dan Copa <dcopalupe@gmail.com>
 * @access Private/Admin
 * @version 1.0.0
 * @param {Request} req - Request of the api.
 * @param {Response} res - Response of the api.
 */
const store = async (req, res, next) => {
  const {
    ci,
    extension,
    nombres,
    apellidos,
    celular,
    celular_ref,
    fecha_nac,
    lugar_trabajo,
    profesion,
    fk_expedido,
    fk_rubro,
    fk_residencia,
    fk_promotor,
    cua,
    username,
    password,
    correo,
    fk_afp,
    activo,
  } = req.body;

  try {
    let afp_cliente = null;
    if (fk_afp) {
      afp_cliente = await AfpCliente.create({
        fk_afp,
        cua,
        correo,
        username,
        password,
        created_by: req.user.id,
        updated_by: req.user.id,
      });
    }

    const existeCliente = await Clientes.findOne({ where: { ci } });

    if (existeCliente) {
      throw new ErrorResponse(1323);
    }

    let cliente = await Clientes.create({
      ci,
      extension,
      nombres,
      apellidos,
      celular,
      celular_ref,
      fecha_nac,
      lugar_trabajo,
      profesion,
      fk_expedido,
      fk_rubro,
      fk_residencia,
      fk_promotor,
      activo,
      fk_afp_cliente: afp_cliente ? afp_cliente.id : null,
      created_by: req.user.id,
      updated_by: req.user.id,
    });

    const promotorUpdated = await Promotores.findOne({
      where: { id: fk_promotor },
    });

    await promotorUpdated.update({
      nro_referencias: promotorUpdated.nro_referencias + 1,
    });
    // if (fk_afp) {
    // 	const afp_cliente = await Afp.findOne({ where: { id: fk_afp } });
    // 	await cliente.addAFPs(afp_cliente, { through: { username, password } });
    // }
    // await cliente.addAFPs(afp_cliente);
    const nuevo_cliente = await Clientes.findOne({
      where: {
        id: cliente.id,
      },
      include: include_client,
    });

    return res
      .status(200)
      .send({ message: "Cliente guardado exitosamente", data: nuevo_cliente });
  } catch (e) {
    next(e);
  }
};

const storeAFP = async (req, res, next) => {
  const { id } = req.params;
  const { fk_afp, cua, correo, username, password } = req.body;
  try {
    const cliente = await Clientes.findOne({ where: { id } });

    const afp_cliente = await AfpCliente.create({
      fk_afp,
      cua,
      correo,
      username,
      password,
      created_by: req.user.id,
      updated_by: req.user.id,
    });

    await cliente.update({
      fk_afp_cliente: afp_cliente.id,
      updated_by: req.user.id,
    });

    const new_afp_cliente = await AfpCliente.findOne({
      where: { id: afp_cliente.id },
      include: [
        {
          model: Afp,
        },
      ],
    });

    return res.status(200).send({
      message: "Se agrego los datos de AFP",
      data: new_afp_cliente,
    });
  } catch (e) {
    next(e);
  }
};

/**
 * Actualiza la información de un usuario existente
 * @route PUT /api/v1/user/:id
 * @author Carlos Ramirez <cramirez@miteleferico.bo>
 * @access Private/Admin
 * @version 1.0.0
 * @param {Request} req - Request of the api.
 * @param {Response} res - Response of the api.
 */
const update = async (req, res, next) => {
  const {
    id,
    ci,
    extension,
    nombres,
    apellidos,
    celular,
    celular_ref,
    fecha_nac,
    lugar_trabajo,
    profesion,
    fk_expedido,
    fk_rubro,
    fk_residencia,
    fk_promotor,
    activo,
    cua,
    username,
    password,
    correo,
    fk_afp,
  } = req.body;

  try {
    const cliente = await Clientes.findOne({
      where: {
        id,
      },
    });

    const afpCliente = await AfpCliente.findOne({
      where: {
        id: cliente.fk_afp_cliente,
      },
    });

    let afp_cliente = null;
    if (afpCliente) {
      await afpCliente.update({
        fk_afp,
        cua,
        correo,
        username,
        password,
        updated_by: req.user.id,
      });
    } else if (fk_afp) {
      afp_cliente = await AfpCliente.create({
        fk_afp,
        cua,
        correo,
        username,
        password,
        created_by: req.user.id,
        updated_by: req.user.id,
      });
      await cliente.update({
        fk_afp_cliente: afp_cliente.id,
      });
    }

    if (!cliente) {
      throw new ErrorResponse(1309);
    }

    const clienteCarnet = await Clientes.findOne({
      where: {
        ci,
      },
    });

    if (clienteCarnet && ci !== cliente.ci) {
      throw new ErrorResponse(1323);
    }

    const promotorAntiguo = await Promotores.findOne({
      where: { id: cliente.fk_promotor },
    });
    if (promotorAntiguo.fk_promotor !== fk_promotor) {
      await promotorAntiguo.update({
        nro_referencias: promotorAntiguo.nro_referencias - 1,
      });
      const promotorActualizado = await Promotores.findOne({
        where: { id: fk_promotor },
      });
      await promotorActualizado.update({
        nro_referencias: promotorActualizado.nro_referencias + 1,
      });
    }
    // if (fk_afp) {
    // 	const afp_cliente = await Afp.findOne({ where: { id: fk_afp } });
    // 	await cliente.setAFPs(afp_cliente, { through: { username, password } });
    // }
    await cliente.update({
      ci,
      extension,
      nombres,
      apellidos,
      celular,
      celular_ref,
      fecha_nac,
      lugar_trabajo,
      profesion,
      activo,
      fk_expedido,
      fk_rubro,
      fk_residencia,
      fk_promotor,
      updated_by: req.user.id,
    });

    const actualizado_cliente = await Clientes.findOne({
      where: {
        id: cliente.id,
      },
      include: include_client,
    });

    return res.status(200).json({
      message: "Cliente actualizado exitosamente",
      data: actualizado_cliente,
    });
  } catch (e) {
    next(e);
  }
};

/**
 * Elimina la instancia de un usuario de manera lógica
 * @route DELETE /api/v1/user/:id
 * @author Carlos Ramirez <cramirez@miteleferico.bo>
 * @access Private/Admin
 * @version 1.0.0
 * @param {Request} req - Request of the api.
 * @param {Response} res - Response of the api.
 */
const destroy = async (req, res, next) => {
  const id = req.params.id;
  try {
    const datos = await Clientes.findOne({
      where: {
        id,
      },
    });
    if (!datos) {
      throw new ErrorResponse(5000);
    }
    await datos.update({
      ci: uuid.v4(),
      deleted_by: req.user.id,
    });
    // await datos.destroy({ force: true });
    await datos.destroy();
    return res.status(200).send(datos);
  } catch (e) {
    next(e);
  }
};

const get_observaciones = async (req, res, next) => {
  const { ci } = req.params;

  try {
    const cliente = await Clientes.findOne({ where: { ci } });
    const cliente_contrato = await Contratos.findAll({
      where: {
        fk_cliente: cliente.id,
      },
    });

    const codigos = cliente_contrato.map((c) => c.codigo_contrato);

    const requisitos_faltantes = await ContratoRequisitos.findAll({
      where: {
        fk_contrato: codigos,
        [Op.or]: [
          {
            observado: {
              [Op.ne]: "",
            },
          },
          { entregado: false },
        ],
      },
      order: [["observado", "DESC"]],
    });

    return res.status(200).send(requisitos_faltantes);
  } catch (e) {
    next(e);
  }
};

const store_tareas = async (req, res, next) => {
  const { descripcion, prioridad, completado, fk_cliente } = req.body;

  try {
    const cliente_tarea = await ClienteTareas.create({
      descripcion,
      prioridad,
      completado,
      fk_cliente,
      created_by: req.user.id,
    });

    return res.status(200).send(cliente_tarea);
  } catch (e) {
    next(e);
  }
};

const get_tareas = async (req, res, next) => {
  const { ci } = req.params;

  try {
    const cliente = await Clientes.findOne({ where: { ci } });
    const cliente_tareas = await ClienteTareas.findAll({
      where: {
        fk_cliente: cliente.id,
        completado: false,
      },
      order: [["prioridad", "ASC"]],
    });
    return res.status(200).send(cliente_tareas);
  } catch (e) {
    next(e);
  }
};

const update_tareas = async (req, res, next) => {
  const { id, descripcion, prioridad, completado, fk_cliente } = req.body;

  try {
    const cliente_tarea = await ClienteTareas.findOne({ where: { id } });

    const updated_tarea = await cliente_tarea.update({
      descripcion,
      prioridad,
      completado,
      fk_cliente,
      updated_by: req.user.id,
    });

    return res.status(200).send(updated_tarea);
  } catch (e) {
    next(e);
  }
};

const search_cliente = async (req, res) => {
  let search = req.query["search"];

  let whereSearch = {};
  if (search !== "") {
    whereSearch = {
      [Op.or]: [
        { nombres: { [Op.iLike]: `%${search.toLowerCase()}%` } },
        { apellidos: { [Op.iLike]: `%${search.toLowerCase()}%` } },
        { correo: { [Op.iLike]: `%${search.toLowerCase()}%` } },
        { ci: { [Op.iLike]: `%${search.toLowerCase()}%` } },
        // { celular: { [Op.iLike]: `%${search}%` } },
        sequelize.where(
          sequelize.cast(sequelize.col("cliente.celular"), "varchar"),
          { [Op.iLike]: `%${search.toLowerCase()}%` }
        ),
      ],
    };
  }

  const result = await Clientes.findAll({
    include: include_client,
    where: {
      ...whereSearch,
    },
  });

  res.send(result);
};


module.exports = {
  index,
  list,
  list_clientes,
  show,
  store,
  update,
  destroy,
  search,
  storeAFP,
  get_observaciones,
  store_tareas,
  get_tareas,
  update_tareas,
  search_cliente,
  excel
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

const contratos = require("./archivos/contratos");
const { zeroPad } = require("../helpers/zeropad");

async function crearContratos() {
  for (const contrato of contratos) {
    const cliente = await Clientes.findOne({ where: { ci: `${contrato.ci}` } });
    if (cliente) {
      const prestacion = await Prestacion.findOne({
        where: { id: contrato.PRESTACION },
      });
      const codigo_contrato = `${prestacion.grupo}-${prestacion.codigo}`;
      const { sigla } = await Departamento.findOne({
        where: { id: contrato.departamento },
      });
      const anio = dayjs(contrato.FECHA).isValid()
        ? dayjs(contrato.FECHA).format("YYYY")
        : dayjs().format("YYYY");
      const { count } = await Contratos.findAndCountAll({
        where: { fk_prestacion: contrato.PRESTACION },
        limit: 1,
      });
      const nuevo_contrato_correlativo = zeroPad(count + 1, 4);
      const last_codigo = `${sigla}-${cliente.ci}-${codigo_contrato}-${nuevo_contrato_correlativo}/${anio}`;

      await Contratos.create({
        fk_prestacion: contrato.PRESTACION,
        codigo_contrato: last_codigo,
        departamento: contrato.departamento,
        fsa: parseFloat(contrato.FSA) ? parseFloat(contrato.FSA) : 0,
        ccm: parseFloat(contrato.CCM) ? parseFloat(contrato.CCM) : 0,
        fs: parseFloat(contrato.FS) ? parseFloat(contrato.FS) : 0,
        fr: parseFloat(contrato.FR) ? parseFloat(contrato.FR) : 0,
        anio: anio,
        a_reparto: parseInt(contrato.SENASIR) ? parseInt(contrato.SENASIR) : 0,
        a_sip: parseInt(contrato.SIP) ? parseInt(contrato.SIP) : 0,
        a_hijos: parseInt(contrato.HIJOS) ? parseInt(contrato.HIJOS) : 0,
        a_insalubre: 0,
        correlativo: nuevo_contrato_correlativo,
        fecha_recepcion: dayjs(contrato.INICIO).isValid()
          ? dayjs(contrato.INICIO)
          : null,
        fecha_firma: dayjs(contrato.FINALIZACION).isValid()
          ? dayjs(contrato.FINALIZACION)
          : null,
        total:
          contrato.PRESTACION === 1
            ? 3200
            : contrato.PRESTACION === 2
              ? 2000
              : contrato.PRESTACION === 6
                ? 500
                : contrato.PRESTACION === 14
                  ? 1500
                  : contrato.PRESTACION === 10
                    ? 4500
                    : contrato.PRESTACION === 9
                      ? 4500
                      : 3200,
        fecha_contrato: dayjs(contrato.INICIO).isValid()
          ? dayjs(contrato.INICIO)
          : null,
        fecha_finalizacion: dayjs(contrato.FINALIZACION).isValid()
          ? dayjs(contrato.FINALIZACION)
          : dayjs(),
        created_at: dayjs(contrato.FECHA).isValid() ? contrato.FECHA : dayjs(),
        state:
          dayjs(contrato.INICIO).isValid() &&
            dayjs(contrato.FINALIZACION).isValid()
            ? 1
            : contrato.estado === ""
              ? 0
              : 2,
        fk_cliente: cliente.id,
        fk_titular: 1,
        fk_suplente: 1,
        created_by: 1,
      });
    }
  }
  console.log("TERMINADO");
}

// crearContratos();
async function actualizarClienteCorrelativo(params) {
  const contratos = await Contratos.findAll({});
  for (const contrato of contratos) {
    const cliente = await Clientes.findOne({
      where: { id: contrato.fk_cliente },
    });
    const { count } = await Clientes.findAndCountAll({
      where: { nro_expediente: { [Op.ne]: null } },
    });
    if (cliente.nro_expediente === null) {
      await cliente.update({ nro_expediente: count + 1 });
    }
  }
  console.log("TERMINADO");
}

// actualizarClienteCorrelativo();
