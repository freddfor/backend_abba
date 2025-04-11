"use strict";

module.exports = (sequelize, DataTypes) => {
  const tarea = sequelize.define(
    "tarea",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      titulo: DataTypes.STRING,
      tiempo: DataTypes.INTEGER,
      tiempo_retorno: DataTypes.INTEGER,
      estado: DataTypes.INTEGER,
      formulario: DataTypes.INTEGER,
      prioridad: DataTypes.INTEGER,
      fk_proceso: DataTypes.INTEGER,
      created_by: DataTypes.INTEGER,
      updated_by: DataTypes.INTEGER,
      deleted_by: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      tableName: "tareas",
    }
  );

  tarea.listaContratosTareas = (limit, offset, sort) => {
    const { sortdatafield, sortorder } = sort;
    const orderParams = {
      condigo_contrato: "c.codigo_contrato",
      cliente: "concat(cl.nombres,' ',cl.apellidos)",
      gestion: "concat(c.correlativo," / ",c.anio)",
      ci: "cl.ci",
      prestacion: "p2.nombre",
      proceso: "p.titulo",
      tarea: "cpt.tarea",
      detalle: "cpt.detalle",
      estado: "cpt.estado",
      estado_text: "estado_text",
      fecha_inicio: "cpt.fecha_inicio",
      fecha_fin: "cpt.fecha_fin",
      fecha_conclusion: "cpt.fecha_conclusion",
      responsable: "concat(u.nombres,' ',u.apellidos)",
      usuario: "u.usuario",
    };
    const query = `
    select c.codigo_contrato ,c.total,c.conclusiones ,c.recomendaciones ,
concat(c.correlativo,'/',c.anio) as gestion, c.fecha_contrato, c.fecha_finalizacion ,c.state as estado_contrato,c.fk_cliente, 
cl.ci, concat(cl.nombres,' ',cl.apellidos) as cliente,
cpt.*, p.titulo as proceso, p2.nombre as prestacion,
(case cpt.estado 
when 0 then 'No Iniciado' 
when 2 then 'Finalizado' 
when 1 then (case when cpt.fecha_fin < now() then 'Vencido' else 'En Progreso' end)
end) as estado_text,
concat(u.nombres,' ',u.apellidos) as responsable, u.usuario 
from contratos c 
inner join clientes cl on c.fk_cliente = cl.id
inner join contrato_proceso_tareas cpt on c.id = cpt.fk_contrato 
inner join procesos p on cpt.fk_proceso = p.id
inner join prestaciones p2 on cpt.fk_prestacion = p2.id
inner join usuarios u on cpt.fk_responsable = u.id 
where c.deleted_by isnull and c.deleted_at isnull
order by concat(c.correlativo,'/',c.anio) desc, cpt.fk_proceso, cpt.fk_tarea asc limit :limit offset :offset
    `;

    return sequelize.query(query, {
      replacements: {
        limit,
        offset,
        orderByField: orderParams[sortdatafield] ?? "c.codigo_contrato",
      },
      type: sequelize.QueryTypes.SELECT,
    });
  };

  tarea.listaTareas = (fk_prestacion,fk_usuario) => {
    let where = ''
    if(fk_usuario > 0){
      where = ' and fk_titular = '+fk_usuario
    }
    const query = `
    select c.codigo_contrato ,c.total,c.conclusiones ,c.recomendaciones , c.fk_titular,
concat(c.correlativo,'/',c.anio) as gestion, c.fecha_contrato, c.fecha_finalizacion ,c.state as estado_contrato,c.fk_cliente, 
cl.ci, concat(cl.nombres,' ',cl.apellidos) as cliente,
cpt.*,t.tiempo, p.titulo as proceso, p2.nombre as prestacion,
(case cpt.estado 
when 0 then 'No Iniciado' 
when 2 then 'Finalizado' 
when 1 then (case when cpt.fecha_fin < now() then 'Vencido' else 'En Progreso' end)
end) as estado_text,
concat(u.nombres,' ',u.apellidos) as responsable, u.usuario,t.prioridad  
from contratos c 
inner join clientes cl on c.fk_cliente = cl.id
inner join contrato_proceso_tareas cpt on c.id = cpt.fk_contrato
inner join tareas t on cpt.fk_tarea = t.id 
inner join procesos p on cpt.fk_proceso = p.id
inner join prestaciones p2 on cpt.fk_prestacion = p2.id
left join usuarios u on cpt.fk_responsable = u.id 
where c.deleted_by isnull and c.state = 0 and c.fk_prestacion = ${fk_prestacion} ${where}
    `;

    return sequelize.query(query, { 
      type: sequelize.QueryTypes.SELECT 
    });
  };


  tarea.associate = function (models) {
    tarea.belongsToMany(models.contrato, {
      through: models.contrato_proceso_tarea,
      foreignKey: "fk_tarea",
      otherKey: "fk_contrato",
    });
    tarea.hasMany(models.contrato_proceso_tarea, {
      foreignKey: "fk_tarea",
      as: "tarea_contrato",
    });
    // tarea.belongsToMany(models.proceso, {
    //   through: models.proceso_tarea,
    //   foreignKey: "fk_tarea",
    //   otherKey: "fk_proceso",
    // });
    tarea.belongsTo(models.proceso, {
      foreignKey: "fk_proceso",
    });
    tarea.hasMany(models.proceso_tarea, {
      foreignKey: "fk_tarea",
    });
    tarea.hasMany(models.tarea_seguimiento, {
      foreignKey: "fk_tarea",
    });
  };

  return tarea;
};
