"use strict";

module.exports = (sequelize, DataTypes) => {
  const cuenta_bancaria = sequelize.define(
    "cuenta_bancaria",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      nro_cuenta: DataTypes.STRING,
      banco: DataTypes.STRING,
      titular: DataTypes.STRING,
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
      tableName: "cuenta_bancarias"
    }
  );

  cuenta_bancaria.associate = function (models) {
    cuenta_bancaria.hasMany(models.pago_deposito, {
      foreignKey: "fk_cuenta",
    });
  };

  return cuenta_bancaria;
};
