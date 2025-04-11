"use strict";

module.exports = (sequelize, DataTypes) => {
  const tipo_cliente = sequelize.define(
    "tipo_cliente",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      titulo: DataTypes.STRING,
      fk_prestacion: DataTypes.INTEGER,
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
      tableName: "tipo_clientes",
    }
  );

  tipo_cliente.associate = function (models) {
    // tipo_cliente.belongsToMany(models.requisito, {
    //   through: models.tipo_cliente_requisito,
    //   foreignKey: "fk_tipo_cliente",
    //   otherKey: "fk_requisito",
    // });
    // tipo_cliente.belongsToMany(models.prestacion, {
    //   through: models.prestacion_tipo_cliente,
    //   foreignKey: "fk_tipo_cliente",
    //   otherKey: "fk_prestacion",
    // });
    // tipo_cliente.hasMany(models.prestacion_tipo_cliente, {
    //   foreignKey: "fk_tipo_cliente",
    // });
    tipo_cliente.belongsTo(models.prestacion, {
      foreignKey: "fk_prestacion",
    });
    tipo_cliente.hasMany(models.requisito, {
      foreignKey: "fk_tipo_cliente",
    });
  };

  return tipo_cliente;
};
