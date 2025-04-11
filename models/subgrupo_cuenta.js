"use strict";

module.exports = (sequelize, DataTypes) => {
  const subgrupo_cuenta = sequelize.define(
    "subgrupo_cuenta",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      titulo: DataTypes.STRING,
      ingreso: DataTypes.BOOLEAN,
      fk_grupo_cuenta: DataTypes.INTEGER,
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
      tableName: "subgrupo_cuentas"
    }
  );

  subgrupo_cuenta.associate = function (models) {
    subgrupo_cuenta.belongsTo(models.grupo_cuenta, {
      foreignKey: "fk_grupo_cuenta",
    });
    subgrupo_cuenta.hasMany(models.cuenta, {
      foreignKey: "fk_subgrupo_cuenta",
    });
  };

  return subgrupo_cuenta;
};
