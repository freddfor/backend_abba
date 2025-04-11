"use strict";

module.exports = (sequelize, DataTypes) => {
  const feriado = sequelize.define(
    "feriado",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      fecha: DataTypes.DATE,
      descripcion: DataTypes.STRING,
      fk_departamento: DataTypes.INTEGER,
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
      tableName: "feriados"
    }
  );

  feriado.associate = function (models) {
    feriado.belongsTo(models.departamento, {
      foreignKey: "fk_departamento",
    });
  };

  return feriado;
};
