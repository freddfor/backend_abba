"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("tipo_cliente_requisitos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      fk_tipo_cliente: Sequelize.INTEGER,
      fk_requisito: Sequelize.INTEGER,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("tipo_cliente_requisitos");
  },
};
