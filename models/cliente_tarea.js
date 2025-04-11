"use strict";
var bcrypt = require("bcrypt");
const dayjs = require("dayjs");

module.exports = (sequelize, DataTypes) => {
  const cliente_tarea = sequelize.define(
    "cliente_tarea",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      descripcion: DataTypes.STRING,
      prioridad: DataTypes.INTEGER,
      completado: DataTypes.BOOLEAN,
      fk_cliente: DataTypes.INTEGER,
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
      tableName: "cliente_tareas",
    }
  );

  cliente_tarea.associate = function (models) {
    
  };

  return cliente_tarea;
};
