"use strict";

module.exports = (sequelize, DataTypes) => {
  const contrato_proceso_tarea = sequelize.define(
    "contrato_proceso_tarea",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      fecha_inicio: DataTypes.DATE,
      fecha_fin: DataTypes.DATE,
      fecha_conclusion: DataTypes.DATE,
      detalle: DataTypes.STRING,
      tarea: DataTypes.STRING,
      estado: DataTypes.INTEGER,
      fk_tarea: DataTypes.INTEGER,
      fk_contrato: DataTypes.INTEGER,
      fk_proceso: DataTypes.INTEGER,
      fk_prestacion: DataTypes.INTEGER,
      fk_responsable: DataTypes.INTEGER,
      orden: DataTypes.INTEGER,
    },
    {
      timestamps: false,
      tableName: "contrato_proceso_tareas",
    }
  );

  

  contrato_proceso_tarea.associate = function (models) {
    // contrato_proceso_tarea.hasMany(models.tarea_archivo, {
    //   foreignKey: "fk_tarea",
    // });
    contrato_proceso_tarea.belongsToMany(models.archivo, {
      through: models.tarea_archivo,
      foreignKey: "fk_proceso_tarea",
      otherKey: "fk_archivo",
    });
    contrato_proceso_tarea.belongsTo(models.tarea, {
      foreignKey: "fk_tarea",
      as: "tarea_contrato",
    });
    contrato_proceso_tarea.belongsTo(models.proceso, {
      foreignKey: "fk_proceso",
    });
    contrato_proceso_tarea.belongsTo(models.usuario, {
      foreignKey: "fk_responsable",
      as: "responsable",
    });
    contrato_proceso_tarea.belongsTo(models.contrato, {
      foreignKey: "fk_contrato",
    });
    contrato_proceso_tarea.hasMany(models.tarea_seguimiento, {
      foreignKey: "fk_tarea",
    });
  };

  return contrato_proceso_tarea;
};
