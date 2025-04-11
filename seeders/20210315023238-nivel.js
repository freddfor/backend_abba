"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("niveles", [
      {
        nivel: "Administrador",
      },
      {
        nivel: "Procurador",
      },
      {
        nivel: "Reportes",
      },
      {
        nivel: "Cliente",
      },
      {
        nivel: "Secretaria",
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("niveles", null, {});
  },
};
