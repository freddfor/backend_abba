"use strict";

const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("afps", [
      {
        nombre: "Previsión",
      },
      {
        nombre: "Futuro Bolivia",
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("afps", null, {});
  },
};
