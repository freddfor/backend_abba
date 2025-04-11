"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("prestacion_requisitos", {
      fk_prestacion: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      fk_requisito: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("prestacion_requisitos");
  },
};
