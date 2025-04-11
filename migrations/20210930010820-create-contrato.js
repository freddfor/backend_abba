"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("contratos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      codigo_contrato: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      total: Sequelize.DOUBLE,
      departamento: Sequelize.INTEGER,
      dh_primerg: Sequelize.INTEGER,
      dh_tercerg: Sequelize.INTEGER,
      fsa: Sequelize.DOUBLE,
      ccm: Sequelize.DOUBLE,
      fs: Sequelize.DOUBLE,
      fr: Sequelize.DOUBLE,
      a_reparto: Sequelize.DOUBLE,
      a_sip: Sequelize.DOUBLE,
      a_hijos: Sequelize.DOUBLE,
      a_insalubre: Sequelize.DOUBLE,
      tipo_cc: Sequelize.INTEGER,
      monto_cc: Sequelize.DOUBLE,
      conclusiones: Sequelize.STRING,
      recomendaciones: Sequelize.STRING,
      correlativo: Sequelize.INTEGER,
      anio: Sequelize.INTEGER,
      fecha_contrato: Sequelize.DATEONLY,
      fecha_finalizacion: Sequelize.DATE,
      finalizado: Sequelize.BOOLEAN,
      state: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      //AFP
      fecha_recepcion: Sequelize.DATEONLY,
      fecha_firma: Sequelize.DATEONLY,
      // CLIENTE
      fk_cliente: Sequelize.INTEGER,
      // PRESTACION
      fk_prestacion: Sequelize.INTEGER,
      // RESPONSABLES
      fk_titular: Sequelize.INTEGER,
      fk_suplente: Sequelize.INTEGER,
      created_by: { type: Sequelize.INTEGER, field: "created_by" },
      updated_by: { type: Sequelize.INTEGER, field: "updated_by" },
      deleted_by: { type: Sequelize.INTEGER, field: "deleted_by" },
      created_at: { type: Sequelize.DATE, field: "created_at" },
      updated_at: { type: Sequelize.DATE, field: "updated_at" },
      deleted_at: { type: Sequelize.DATE, field: "deleted_at" },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("contratos");
  },
};
