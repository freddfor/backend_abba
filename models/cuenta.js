"use strict";

module.exports = (sequelize, DataTypes) => {
  const cuenta = sequelize.define(
    "cuenta",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      titulo: DataTypes.STRING,
      ingreso: DataTypes.BOOLEAN,
      fk_subgrupo_cuenta: DataTypes.INTEGER,
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
      tableName: "cuentas"
    }
  );

  cuenta.associate = function (models) {
    cuenta.belongsTo(models.subgrupo_cuenta, {
      foreignKey: "fk_subgrupo_cuenta",
    });
    cuenta.hasMany(models.libro_diario, {
      foreignKey: "fk_cuenta",
    });
    cuenta.hasMany(models.motivo, {
      foreignKey: "fk_cuenta",
    });
    cuenta.hasMany(models.prestacion, {
      foreignKey: "fk_cuenta",
    });
  };

  return cuenta;
};
