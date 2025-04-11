"use strict";

module.exports = (sequelize, DataTypes) => {
  const contrato_requisito = sequelize.define(
    "contrato_requisito",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.STRING,
      },
      entregado: DataTypes.BOOLEAN,
      correcto: DataTypes.BOOLEAN,
      observado: DataTypes.STRING,
      requisito: DataTypes.STRING,
      fk_tipo_cliente: DataTypes.INTEGER,
      fk_contrato: DataTypes.INTEGER,
      fk_requisito: DataTypes.INTEGER,
    },
    {
      timestamps: false,
      tableName: 'contrato_requisitos'
    }
  );

  contrato_requisito.associate = function (models) {
    contrato_requisito.belongsTo(models.contrato, {
      foreignKey: "fk_contrato",
    });
  };

  return contrato_requisito;
};
