"use strict";

module.exports = (sequelize, DataTypes) => {
  const recovery_password = sequelize.define(
    "recovery_password",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      fk_user: DataTypes.INTEGER,
      // url: DataTypes.STRING,
      completed: DataTypes.BOOLEAN,
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
      tableName: "recovery_passwords"
    }
  );

  // recovery_password.associate = function (models) {
    
  // };

  return recovery_password;
};
