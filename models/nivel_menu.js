'use strict';

module.exports = (sequelize, DataTypes) => {
  const nivel_menu = sequelize.define('nivel_menu', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    fk_menu: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    fk_nivel: {
      allowNull: true,
      type: DataTypes.INTEGER
    }
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true,
    tableName: 'nivel_menus'
  });

  nivel_menu.associate = function (models) {
  };

  return nivel_menu;
};