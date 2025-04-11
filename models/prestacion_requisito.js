"use strict";

module.exports = (sequelize, DataTypes) => {
  const prestacion_requisito = sequelize.define(
    "prestacion_requisito",
    {
      fk_prestacion: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      fk_requisito: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
    },
    {
      timestamps: false,
      tableName: "prestacion_requisitos"
    }
  );

  prestacion_requisito.associate = function (models) {
    prestacion_requisito.belongsTo(models.requisito, {
      foreignKey: "fk_requisito",
    });
  };

  return prestacion_requisito;
};
