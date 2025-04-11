"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("archivos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      drive_id: Sequelize.STRING,
      nombre_concatenado: Sequelize.STRING,
      nombre_completo: Sequelize.STRING,
      tipo_archivo: Sequelize.STRING,
      mime_type: Sequelize.STRING,
      tamanio: Sequelize.INTEGER,
      webContentLink: Sequelize.STRING,
      webViewLink: Sequelize.STRING,
      iconLink: Sequelize.STRING,
      hasThumbnail: Sequelize.STRING,
      thumbnailLink: Sequelize.STRING,
      created_by: { type: Sequelize.INTEGER, field: "created_by" },
      updated_by: { type: Sequelize.INTEGER, field: "updated_by" },
      deleted_by: { type: Sequelize.INTEGER, field: "deleted_by" },
      created_at: { type: Sequelize.DATE, field: "created_at" },
      updated_at: { type: Sequelize.DATE, field: "updated_at" },
      deleted_at: { type: Sequelize.DATE, field: "deleted_at" },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("archivos");
  },
};
