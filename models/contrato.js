"use strict";

module.exports = (sequelize, DataTypes) => {
  const contrato = sequelize.define(
    "contrato",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      codigo_contrato: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
      },
      total: DataTypes.DOUBLE,
      departamento: DataTypes.INTEGER,
      dh_primerg: DataTypes.INTEGER,
      dh_tercerg: DataTypes.INTEGER,
      fsa: DataTypes.DOUBLE,
      ccm: DataTypes.DOUBLE,
      fs: DataTypes.DOUBLE,
      fr: DataTypes.DOUBLE,
      a_reparto: DataTypes.DOUBLE,
      a_sip: DataTypes.DOUBLE,
      a_hijos: DataTypes.DOUBLE,
      a_insalubre: DataTypes.DOUBLE,
      tipo_cc: DataTypes.INTEGER,
      monto_cc: DataTypes.DOUBLE,
      conclusiones: DataTypes.STRING,
      recomendaciones: DataTypes.STRING,
      fecha_finalizacion: DataTypes.DATE,
      finalizado: DataTypes.BOOLEAN,
      state: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      correlativo: DataTypes.INTEGER,
      fecha_contrato: DataTypes.DATE,
      anio: DataTypes.INTEGER,
      //AFP
      fecha_recepcion: DataTypes.DATE,
      fecha_firma: DataTypes.DATE,
      // CLIENTE
      fk_cliente: DataTypes.INTEGER,
      // PRESTACION
      fk_prestacion: DataTypes.INTEGER,
      // RESPONSABLES
      fk_titular: DataTypes.INTEGER,
      fk_suplente: DataTypes.INTEGER,
      created_by: DataTypes.INTEGER,
      updated_by: DataTypes.INTEGER,
      deleted_by: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
      r_dignidad: DataTypes.DOUBLE,
      fecha_verificacion: DataTypes.DATE,
      fecha_suspencion: DataTypes.DATE,
      fecha_certificacion: DataTypes.DATE,
    },
    {
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      tableName: 'contratos'
    }
  );


  contrato.listaContratos = (filtro, order, limit='') => {
    const query = `
    select * from (
    select c.id, c.codigo_contrato, c.anio, c.correlativo, concat(c.correlativo,'/',c.anio) as gestion ,c.total, 
saldo_contrato_actual(c.id) as saldo,
c.conclusiones ,c.recomendaciones, 
c.created_at,c.state,
CASE WHEN c.fecha_contrato IS NULL THEN null ELSE concat(c.fecha_contrato)  END AS fecha_contrato,
--concat(c.fecha_contrato) as fecha_contrato  ,
(case c.state 
when 0 then 'En Progreso' 
when 1 then 'Finalizado' 
when 2 then 'Anulado'
end) as estado_text,
c.fecha_recepcion,c.fecha_verificacion,c.fecha_firma,c.fecha_suspencion,c.fecha_certificacion,
cl.ci,concat(cl.nombres,' ',cl.apellidos) as cliente, cl.nro_expediente,
p.nombre as prestacion, 
concat(u.nombres,' ',u.apellidos) as titular,
concat(u2.nombres,' ',u2.apellidos) as suplente,
up.nombre as promotor,
u3.usuario as creado_por,
dep.nombre as departamento
from contratos c
inner join clientes cl on c.fk_cliente = cl.id
inner join prestaciones p on c.fk_prestacion = p.id
inner join usuarios u on c.fk_titular = u.id
inner join usuarios u2 on c.fk_suplente = u2.id 
inner join usuarios u3 on c.created_by = u3.id
inner join departamentos dep on c.departamento = dep.id
inner join promotores up on cl.fk_promotor = up.id
where c.deleted_at is null and c.deleted_at is null
) as v
${filtro}
${order}
${limit}
    `

    return sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
  }

  contrato.countContratos = (filtro) => {
    const query = `
    select count(*) from (
    select c.id, c.codigo_contrato, c.anio, c.correlativo, concat(c.correlativo,'/',c.anio) as gestion ,c.total, 
saldo_contrato_actual(c.id) as saldo,
c.conclusiones ,c.recomendaciones, 
c.created_at,c.state,
CASE WHEN c.fecha_contrato IS NULL THEN null ELSE concat(c.fecha_contrato)  END AS fecha_contrato,
--concat(c.fecha_contrato) as fecha_contrato  ,
(case c.state 
when 0 then 'En Progreso' 
when 1 then 'Finalizado' 
when 2 then 'Anulado'
end) as estado_text,
c.fecha_recepcion,c.fecha_verificacion,c.fecha_firma,
cl.ci,concat(cl.nombres,' ',cl.apellidos) as cliente, cl.nro_expediente,
p.nombre as prestacion, 
concat(u.nombres,' ',u.apellidos) as titular,
concat(u2.nombres,' ',u2.apellidos) as suplente,
up.nombre as promotor,
u3.usuario as creado_por,
dep.nombre as departamento
from contratos c
inner join clientes cl on c.fk_cliente = cl.id
inner join prestaciones p on c.fk_prestacion = p.id
inner join usuarios u on c.fk_titular = u.id
inner join usuarios u2 on c.fk_suplente = u2.id 
inner join usuarios u3 on c.created_by = u3.id
inner join departamentos dep on c.departamento = dep.id
inner join promotores up on cl.fk_promotor = up.id
where c.deleted_at is null and c.deleted_at is null
) as v
${filtro}
    `

    return sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
  }


  contrato.associate = function (models) {
    contrato.belongsTo(models.prestacion, {
      foreignKey: "fk_prestacion",
    });
    contrato.belongsToMany(models.requisito, {
      through: models.contrato_requisito,
      foreignKey: "fk_contrato",
      otherKey: "fk_requisito",
    });
    contrato.belongsTo(models.usuario, {
      foreignKey: "fk_titular",
      as: "titular",
    });
    contrato.belongsTo(models.usuario, {
      foreignKey: "fk_suplente",
      as: "suplente",
    });
    contrato.belongsTo(models.usuario, {
      foreignKey: "created_by",
      as: "creado_por",
    });
    contrato.belongsToMany(models.tarea, {
      through: models.contrato_proceso_tarea,
      foreignKey: "fk_contrato",
      otherKey: "fk_tarea",
    });
    contrato.hasMany(models.contrato_proceso_tarea, {
      foreignKey: "fk_contrato",
    });
    contrato.belongsTo(models.cliente, {
      foreignKey: "fk_cliente",
    });
    contrato.hasMany(models.contrato_pago, {
      foreignKey: "fk_contrato",
    });
    contrato.hasMany(models.contrato_observaciones, {
      foreignKey: "fk_contrato",
    });
    contrato.hasMany(models.contrato_requisito, {
      foreignKey: "fk_contrato",
    });
    contrato.belongsTo(models.departamento, {
      foreignKey: "departamento",
      as: "departamento_contrato",
    });
  };

  return contrato;
};
