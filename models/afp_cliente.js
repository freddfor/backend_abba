"use strict";

module.exports = (sequelize, DataTypes) => {
  const afp_cliente = sequelize.define(
    "afp_cliente",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      cua: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      correo: DataTypes.STRING,
      fk_afp: DataTypes.INTEGER,
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
      tableName: "afp_clientes",
    }
  );

  afp_cliente.associate = function (models) {
    afp_cliente.hasMany(models.cliente, {
      foreignKey: "fk_afp_cliente",
    });
    afp_cliente.belongsTo(models.afp, {
      foreignKey: "fk_afp",
    });
  };

  return afp_cliente;
};
