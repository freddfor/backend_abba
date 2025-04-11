"use strict";

module.exports = (sequelize, DataTypes) => {
  const nivel = sequelize.define(
    "nivel",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      nivel: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      descripcion: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: false,
      tableName: "niveles",
    }
  );

  nivel.associate = function (models) {
    nivel.hasMany(models.usuario, {
      foreignKey: "fk_nivel",
    });
  };

  nivel.associate = function (models) {
    nivel.belongsToMany(models.menu, {
      through: models.nivel_menu,
      foreignKey: "fk_nivel",
      otherKey: "fk_menu",
    });
  };
  return nivel;
};
