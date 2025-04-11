"use strict";

module.exports = (sequelize, DataTypes) => {
  const tipo_cliente_requisito = sequelize.define(
    "tipo_cliente_requisito",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      fk_tipo_cliente: DataTypes.INTEGER,
      fk_requisito: DataTypes.INTEGER,
    },
    {
      timestamps: false,
      tableName: "tipo_cliente_requisitos"
    }
  );

  tipo_cliente_requisito.associate = function (models) {
    tipo_cliente_requisito.belongsTo(models.requisito, {
      foreignKey: "fk_requisito",
    });

  };

  return tipo_cliente_requisito;
};
