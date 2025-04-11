"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("servicios", [
      {
        nombre: "AREA DE JUBILACION",
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: "AREA DE LEGAL",
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("servicios", null, {});
  },
};
