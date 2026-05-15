"use strict";

module.exports = (sequelize, DataTypes) => {
  const contrato_estados = sequelize.define(
    "contrato_estados",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      fk_contrato: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      estado: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      conclusiones: DataTypes.TEXT,
      recomendaciones: DataTypes.TEXT,
      activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
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
      tableName: "contrato_estados",
    }
  );

  contrato_estados.associate = function (models) {
    contrato_estados.belongsTo(models.contrato, {
      foreignKey: "fk_contrato",
    });
    contrato_estados.belongsTo(models.usuario, {
      foreignKey: "created_by",
      as: "creado_por",
    });
    contrato_estados.belongsTo(models.usuario, {
      foreignKey: "updated_by",
      as: "actualizado_por",
    });
  };

  return contrato_estados;
};
