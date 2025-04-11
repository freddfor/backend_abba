"use strict";

module.exports = (sequelize, DataTypes) => {
  const tarea_seguimiento = sequelize.define(
    "tarea_seguimiento",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      descripcion: DataTypes.STRING,
      fk_tarea: DataTypes.INTEGER,
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
      tableName: "tarea_seguimientos"
    }
  );

  tarea_seguimiento.associate = function (models) {
    tarea_seguimiento.belongsTo(models.contrato_proceso_tarea, {
      foreignKey: "fk_tarea",
    });
    tarea_seguimiento.hasMany(models.tarea_seguimiento_archivo, {
      foreignKey: "fk_seguimiento_tarea",
    });
    tarea_seguimiento.belongsToMany(models.archivo, {
      through: models.tarea_seguimiento_archivo,
      foreignKey: "fk_seguimiento_tarea",
      otherKey: "fk_archivo",
    });
  };

  return tarea_seguimiento;
};
