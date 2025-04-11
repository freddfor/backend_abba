"use strict";
var bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const rubro = sequelize.define(
    "rubro",
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
      tableName: "rubros",
    }
  );

  // rubro.associate = function (models) {
  // };

  return rubro;
};
