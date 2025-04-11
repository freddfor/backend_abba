"use strict";

module.exports = (sequelize, DataTypes) => {
  const tarea_archivo = sequelize.define(
    "tarea_archivo",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      fk_proceso_tarea: DataTypes.INTEGER,
      fk_archivo: DataTypes.INTEGER,
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
      tableName: "tarea_archivos"
    }
  );

  tarea_archivo.associate = function (models) {
    tarea_archivo.belongsTo(models.contrato_proceso_tarea, {
      foreignKey: "fk_proceso_tarea",
    });
  };

  return tarea_archivo;
};
