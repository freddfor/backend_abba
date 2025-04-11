"use strict";

module.exports = (sequelize, DataTypes) => {
  const contrato_pago = sequelize.define(
    "contrato_pago",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      fk_contrato: DataTypes.INTEGER,
      fk_libro_diario: DataTypes.INTEGER,
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
      tableName: "contrato_pagos",
    }
  );

  contrato_pago.associate = function (models) {
    contrato_pago.belongsTo(models.contrato, {
      foreignKey: "fk_contrato",
    });
    contrato_pago.belongsTo(models.usuario, {
      foreignKey: "created_by",
    });
    // contrato_pago.belongsTo(models.pago_deposito, {
    //   foreignKey: "fk_deposito",
    // });
    // contrato_pago.belongsTo(models.pago_efectivo, {
    //   foreignKey: "fk_efectivo",
    // });
    contrato_pago.belongsTo(models.libro_diario, {
      foreignKey: "fk_libro_diario",
    });
  };

  return contrato_pago;
};
