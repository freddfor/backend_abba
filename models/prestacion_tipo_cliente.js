"use strict";

module.exports = (sequelize, DataTypes) => {
  const prestacion_tipo_cliente = sequelize.define(
    "prestacion_tipo_cliente",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      fk_prestacion: DataTypes.INTEGER,
      fk_tipo_cliente: DataTypes.INTEGER,
    },
    {
      timestamps: false,
      tableName: "prestacion_tipo_clientes"
    }
  );

  prestacion_tipo_cliente.associate = function (models) {
    prestacion_tipo_cliente.belongsTo(models.tipo_cliente, {
      foreignKey: "fk_tipo_cliente",
    });
  };

  return prestacion_tipo_cliente;
};
