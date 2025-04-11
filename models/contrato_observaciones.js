"use strict";

module.exports = (sequelize, DataTypes) => {
  const contrato_observaciones = sequelize.define(
    "contrato_observaciones",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      observacion: DataTypes.STRING,
      fk_contrato: DataTypes.INTEGER,
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
      tableName: "contrato_observaciones",
    }
  );

  contrato_observaciones.associate = function (models) {
    contrato_observaciones.belongsTo(models.contrato, {
      foreignKey: "fk_contrato",
    });
    contrato_observaciones.belongsTo(models.usuario, {
      foreignKey: "created_by",
    });
  };

  return contrato_observaciones;
};
