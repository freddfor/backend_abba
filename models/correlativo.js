"use strict";
module.exports = (sequelize, DataTypes) => {
  const correlativo = sequelize.define(
    "correlativo",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      fk_prestacion: DataTypes.INTEGER,
      correlativo: DataTypes.INTEGER,
      gestion: DataTypes.INTEGER,
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
      tableName: "correlativos",
    }
  );

  return correlativo;
};
