"use strict";

module.exports = (sequelize, DataTypes) => {
  const proceso_tarea = sequelize.define(
    "proceso_tarea",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      fk_proceso: DataTypes.INTEGER,
      fk_tarea: DataTypes.INTEGER,
    },
    {
      timestamps: false,
      tableName: "proceso_tareas"
    }
  );

  proceso_tarea.associate = function (models) {
    proceso_tarea.belongsTo(models.proceso, {
      foreignKey: "fk_proceso"
    });
    proceso_tarea.belongsTo(models.tarea, {
      foreignKey: "fk_tarea",
    });
  };

  return proceso_tarea;
};
