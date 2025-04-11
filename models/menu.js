'use strict';

module.exports = (sequelize, DataTypes) => {
  const menu = sequelize.define('menu', {
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
    name: {
      allowNull: false,
      type: DataTypes.STRING(80)
    },
    description: {
      type: DataTypes.STRING(150)
    },
    link: {
      allowNull: true,
      type: DataTypes.STRING(150)
    },
    index: {
      type: DataTypes.INTEGER
    },
    append: {
      type: DataTypes.STRING(20)
    },
    append_class: {
      type: DataTypes.STRING(100)
    },
    class_name: {
      type: DataTypes.STRING(100)
    },
    is_icon_class: {
      type: DataTypes.BOOLEAN
    },
    icon: {
      type: DataTypes.STRING(50)
    },
    is_heading: {
      type: DataTypes.BOOLEAN
    },
    is_active: {
      default: true,
      type: DataTypes.BOOLEAN,
    },
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER,
    deleted_by: DataTypes.INTEGER,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    freezeTableName: true,
    tableName: 'menus'
  });

  menu.associate = function (models) {
    menu.hasMany(models.menu, {
      foreignKey: 'fk_menu',
      as: 'children',
    });
    menu.belongsTo(models.menu, {
      foreignKey: 'fk_menu',
      sourceKey: 'id',
      as: 'parent',
    })
  };

  return menu;
};