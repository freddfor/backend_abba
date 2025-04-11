"use strict";

module.exports = (sequelize, DataTypes) => {
  const tarea_seguimiento_archivo = sequelize.define(
    "tarea_seguimiento_archivo",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      fk_seguimiento_tarea: DataTypes.INTEGER,
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
      tableName: "tarea_seguimiento_archivos"
    }
  );

  tarea_seguimiento_archivo.associate = function (models) {
    tarea_seguimiento_archivo.belongsTo(models.tarea_seguimiento, {
      foreignKey: "fk_seguimiento_tarea",
    });
  };

  return tarea_seguimiento_archivo;
};
