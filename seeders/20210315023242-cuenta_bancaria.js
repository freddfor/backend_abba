"use strict";

const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("cuenta_bancarias", [
      {
        nro_cuenta: "100000000515421",
        banco: "Banco Union",
        titular: "Nelica Blanco",
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nro_cuenta: "1000000005848421",
        banco: "Banco Sol",
        titular: "Nelica Blanco",
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nro_cuenta: "1000000005112321",
        banco: "Banco Union",
        titular: "Bertha Blanco",
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("cuenta_bancarias", null, {});
  },
};
