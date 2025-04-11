"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("contrato_proceso_tareas", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      fecha_inicio: Sequelize.DATEONLY,
      fecha_fin: Sequelize.DATEONLY,
      fecha_conclusion: Sequelize.DATEONLY,
      detalle: Sequelize.STRING,
      tarea: Sequelize.STRING,
      estado: Sequelize.INTEGER,
      fk_tarea: Sequelize.INTEGER,
      fk_contrato: Sequelize.INTEGER,
      fk_proceso: Sequelize.INTEGER,
      fk_prestacion: Sequelize.INTEGER,
      fk_responsable: Sequelize.INTEGER
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("contrato_proceso_tareas");
  },
};
