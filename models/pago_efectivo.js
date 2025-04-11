"use strict";

module.exports = (sequelize, DataTypes) => {
  const pago_efectivo = sequelize.define(
    "pago_efectivo",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      nro_comprobante: DataTypes.STRING,
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
      tableName: "pago_efectivos"
    }
  );

  pago_efectivo.associate = function (models) {
    pago_efectivo.hasMany(models.libro_diario, {
      foreignKey: "fk_efectivo",
    });
  };

  return pago_efectivo;
};
