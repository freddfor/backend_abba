"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("libro_diarios", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      monto: Sequelize.DOUBLE,
      fecha: Sequelize.DATE,
      fk_cuenta: Sequelize.INTEGER,
      fk_deposito: Sequelize.INTEGER,
      fk_efectivo: Sequelize.INTEGER,
      created_by: { type: Sequelize.INTEGER, field: "created_by" },
      updated_by: { type: Sequelize.INTEGER, field: "updated_by" },
      deleted_by: { type: Sequelize.INTEGER, field: "deleted_by" },
      created_at: { type: Sequelize.DATE, field: "created_at" },
      updated_at: { type: Sequelize.DATE, field: "updated_at" },
      deleted_at: { type: Sequelize.DATE, field: "deleted_at" },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("libro_diarios");
  },
};
