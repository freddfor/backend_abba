"use strict";

module.exports = (sequelize, DataTypes) => {
  const requisito = sequelize.define(
    "requisito",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      description: DataTypes.STRING,
      tipo: DataTypes.INTEGER,
      fk_tipo_cliente: DataTypes.INTEGER,
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
      tableName: "requisitos",
    }
  );

  requisito.associate = function (models) {
    // requisito.belongsToMany(models.prestacion, {
    //   through: models.prestacion_requisito,
    //   foreignKey: "fk_requisito",
    //   otherKey: "fk_prestacion",
    // });
    requisito.hasMany(models.prestacion_requisito, {
      foreignKey: "fk_requisito",
    });
    requisito.belongsTo(models.tipo_cliente, {
      foreignKey: 'fk_tipo_cliente'
    });
    // requisito.hasMany(models.tipo_cliente_requisito, {
    //   foreignKey: "fk_requisito",
    // });
  };

  return requisito;
};
