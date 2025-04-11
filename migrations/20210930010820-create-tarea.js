"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("tareas", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      titulo: Sequelize.STRING,
      tiempo_retorno: Sequelize.INTEGER,
      tiempo: Sequelize.INTEGER,
      estado: Sequelize.INTEGER,
      formulario: Sequelize.INTEGER,
      created_by: { type: Sequelize.INTEGER, field: "created_by" },
      updated_by: { type: Sequelize.INTEGER, field: "updated_by" },
      deleted_by: { type: Sequelize.INTEGER, field: "deleted_by" },
      created_at: { type: Sequelize.DATE, field: "created_at" },
      updated_at: { type: Sequelize.DATE, field: "updated_at" },
      deleted_at: { type: Sequelize.DATE, field: "deleted_at" },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("tareas");
  },
};
