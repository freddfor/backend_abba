"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("residencias", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nombre: { type: Sequelize.STRING },
      created_by: { type: Sequelize.INTEGER },
      updated_by: { type: Sequelize.INTEGER },
      deleted_by: { type: Sequelize.INTEGER },
      created_at: { type: Sequelize.DATE },
      updated_at: { type: Sequelize.DATE },
      deleted_at: { type: Sequelize.DATE },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("residencias");
  },
};
