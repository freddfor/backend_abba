"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("cliente_consultas", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      descripcion: Sequelize.STRING,
      estado: Sequelize.INTEGER,
      fecha: Sequelize.DATE,
      observaciones: Sequelize.STRING,
      fk_motivo: Sequelize.INTEGER,
      fk_cliente: Sequelize.INTEGER,
      fk_user: Sequelize.INTEGER,
      fk_libro_diario: Sequelize.INTEGER,
      cancelado: Sequelize.BOOLEAN,
      created_by: { type: Sequelize.INTEGER, field: "created_by" },
      updated_by: { type: Sequelize.INTEGER, field: "updated_by" },
      deleted_by: { type: Sequelize.INTEGER, field: "deleted_by" },
      created_at: { type: Sequelize.DATE, field: "created_at" },
      updated_at: { type: Sequelize.DATE, field: "updated_at" },
      deleted_at: { type: Sequelize.DATE, field: "deleted_at" },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("cliente_consultas");
  },
};
