"use strict";

module.exports = (sequelize, DataTypes) => {
  const departamento = sequelize.define(
    "departamento",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      nombre: DataTypes.STRING,
      sigla: DataTypes.STRING,
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
      tableName: "departamentos",
    }
  );

  departamento.associate = function (models) {
    departamento.hasMany(models.feriado, {
      foreignKey: "fk_departamento",
    });
    departamento.hasMany(models.contrato, {
      foreignKey: "departamento",
      as: "departamento_contrato",
    });
  };

  return departamento;
};
