"use strict";

const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("departamentos", [
      {
        nombre: "La Paz",
        sigla: "LP",
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: "Oruro",
        sigla: "OR",
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: "Cochabamba",
        sigla: "CB",
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: "Beni",
        sigla: "BE",
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: "Tarija",
        sigla: "TJ",
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: "Chuquisaca",
        sigla: "CH",
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: "Pando",
        sigla: "PD",
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: "Santa Cruz",
        sigla: "SC",
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: "Potosi",
        sigla: "PT",
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("departamentos", null, {});
  },
};
