"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("contrato_requisitos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      entregado: Sequelize.BOOLEAN,
      correcto: Sequelize.BOOLEAN,
      observado: Sequelize.STRING,
      requisito: Sequelize.STRING,
      fk_tipo_cliente: Sequelize.INTEGER,
      fk_contrato: Sequelize.INTEGER,
      fk_requisito: Sequelize.INTEGER
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("contrato_requisitos");
  },
};
