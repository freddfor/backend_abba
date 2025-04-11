"use strict";

module.exports = (sequelize, DataTypes) => {
  const grupo_cuenta = sequelize.define(
    "grupo_cuenta",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      titulo: DataTypes.STRING,
      ingreso: DataTypes.BOOLEAN,
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
      tableName: "grupo_cuentas"
    }
  );

  grupo_cuenta.associate = function (models) {
    grupo_cuenta.hasMany(models.subgrupo_cuenta, {
      foreignKey: "fk_grupo_cuenta",
    });
  };

  return grupo_cuenta;
};
