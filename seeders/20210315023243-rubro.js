"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("rubros", [
      {
        nombre: "Magisterio",
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: "Salud",
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: "Policia",
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: "Militares",
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: "Empresa privada",
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: "Empresa Publica",
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: "Independiente",
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("rubros", null, {});
  },
};
