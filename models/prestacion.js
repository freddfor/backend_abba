"use strict";

module.exports = (sequelize, DataTypes) => {
  const prestacion = sequelize.define(
    "prestacion",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      nombre: DataTypes.STRING,
      grupo: DataTypes.STRING,
      codigo: DataTypes.STRING,
      monto: DataTypes.DOUBLE,
      fk_servicio: DataTypes.INTEGER,
      fk_cuenta: DataTypes.INTEGER,
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
      tableName: "prestaciones",
    }
  );

  prestacion.prestacionProcesoTareas = (fk_prestacion) => {
    const query = `
    select pp.id, pt.fk_proceso , pt.fk_tarea, t.titulo
from prestacion_procesos pp 
inner join proceso_tareas pt on pp.fk_proceso = pt.fk_proceso 
inner join tareas t on pt.fk_tarea = t.id
where pp.fk_prestacion = $fk_prestacion
order by pp.id asc 
    `;
    return sequelize.query(query, {
      bind: { fk_prestacion },
      type: sequelize.QueryTypes.SELECT,
    });
  };

  prestacion.associate = function (models) {
    prestacion.belongsToMany(models.requisito, {
      through: models.prestacion_requisito,
      foreignKey: "fk_prestacion",
      otherKey: "fk_requisito",
    });
    prestacion.belongsToMany(models.proceso, {
      through: models.prestacion_proceso,
      foreignKey: "fk_prestacion",
      otherKey: "fk_proceso",
    });
    // prestacion.hasMany(models.prestacion_proceso, {
    //   foreignKey: "fk_prestacion",
    //   // as: "prestacion_proceso",
    // });
    prestacion.hasMany(models.proceso, {
      foreignKey: "fk_prestacion",
    });
    prestacion.hasMany(models.contrato, {
      foreignKey: "fk_prestacion",
    });
    // prestacion.belongsToMany(models.tipo_cliente, {
    //   through: models.prestacion_tipo_cliente,
    //   foreignKey: "fk_prestacion",
    //   otherKey: "fk_tipo_cliente",
    // });
    prestacion.hasMany(models.tipo_cliente, {
      foreignKey: "fk_prestacion",
    });
    prestacion.belongsTo(models.servicio, {
      foreignKey: "fk_servicio",
    });
    prestacion.belongsTo(models.cuenta, {
      foreignKey: "fk_cuenta",
    });
  };

  return prestacion;
};
