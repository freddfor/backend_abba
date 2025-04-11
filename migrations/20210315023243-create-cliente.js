"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("clientes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      ci: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      extension: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      nombres: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      apellidos: {
        type: Sequelize.STRING,
      },
      correo: {
        type: Sequelize.STRING,
      },
      celular: {
        type: Sequelize.INTEGER,
      },
      celular_ref: {
        type: Sequelize.INTEGER,
      },
      fecha_nac: {
        type: Sequelize.DATE,
      },
      fecha_def: {
        type: Sequelize.DATE,
      },
      lugar_trabajo: {
        type: Sequelize.STRING,
      },
      profesion: {
        type: Sequelize.STRING,
      },
      fk_expedido: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      fk_rubro: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      fk_residencia: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      fk_promotor: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      fk_afp_cliente: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      activo: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      created_by: {
        type: Sequelize.INTEGER,
      },
      updated_by: {
        type: Sequelize.INTEGER,
      },
      deleted_by: {
        type: Sequelize.INTEGER,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("clientes");
  },
};
