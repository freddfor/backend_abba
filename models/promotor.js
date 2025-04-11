"use strict";

module.exports = (sequelize, DataTypes) => {
  const promotor = sequelize.define(
    "promotor",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      nombre: DataTypes.STRING,
      nro_referencias: DataTypes.INTEGER,
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
      tableName: "promotores"
    }
  );

  //   promotor.associate = function (models) {
  //     promotor.belongsTo(models.nivel, {
  //       foreignKey: "fk_nivel",
  //       as: "nivel",
  //     });
  //   };

  return promotor;
};
