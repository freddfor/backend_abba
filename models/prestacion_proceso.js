"use strict";

module.exports = (sequelize, DataTypes) => {
  const prestacion_proceso = sequelize.define(
    "prestacion_proceso",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      fk_prestacion: DataTypes.INTEGER,
      fk_proceso: DataTypes.INTEGER,
    },
    {
      timestamps: false,
      tableName: "prestacion_procesos"
    }
  );

  prestacion_proceso.associate = function (models) {
    prestacion_proceso.belongsTo(models.prestacion, {
      foreignKey: "fk_prestacion",
      // as: "prestacion_proceso",
    });
    prestacion_proceso.belongsTo(models.proceso, {
      foreignKey: "fk_proceso",
    });
  };

  return prestacion_proceso;
};
