"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("usuarios", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      usuario: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      password: Sequelize.STRING,
      nombres: {
        allowNull: false,
        type: Sequelize.STRING(50),
      },
      apellidos: {
        allowNull: false,
        type: Sequelize.STRING(50),
      },
      email: Sequelize.STRING,
      ci: Sequelize.STRING,
      celular: Sequelize.STRING,
      logins: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      last_login: Sequelize.DATE,
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      fk_nivel: Sequelize.INTEGER,
      created_by: { type: Sequelize.INTEGER, field: "created_by" },
      updated_by: { type: Sequelize.INTEGER, field: "updated_by" },
      deleted_by: { type: Sequelize.INTEGER, field: "deleted_by" },
      created_at: { type: Sequelize.DATE, field: "created_at" },
      updated_at: { type: Sequelize.DATE, field: "updated_at" },
      deleted_at: { type: Sequelize.DATE, field: "deleted_at" },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("usuarios");
  },
};
