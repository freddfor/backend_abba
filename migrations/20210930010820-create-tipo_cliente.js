"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("tipo_clientes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      titulo: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      created_by: { type: Sequelize.INTEGER, field: "created_by" },
      updated_by: { type: Sequelize.INTEGER, field: "updated_by" },
      deleted_by: { type: Sequelize.INTEGER, field: "deleted_by" },
      created_at: { type: Sequelize.DATE, field: "created_at" },
      updated_at: { type: Sequelize.DATE, field: "updated_at" },
      deleted_at: { type: Sequelize.DATE, field: "deleted_at" },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("tipo_clientes");
  },
};
