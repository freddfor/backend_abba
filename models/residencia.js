"use strict";
var bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const residencia = sequelize.define(
    "residencia",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      nombre: DataTypes.STRING,
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
      freezeTableName: true,
      tableName: "residencias",
    }
  );

  residencia.associate = function (models) {
    residencia.belongsToMany(models.cliente, {
      through: "residencia_clientes",
      foreignKey: "fk_residencia",
      otherKey: "fk_cliente",
    });
  };

  return residencia;
};
