"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("grupo_cuentas", [
      {
        id: 1,
        titulo: "PASIVO",
        ingreso: true,
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        titulo: "INGRESOS",
        ingreso: true,
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        titulo: "EGRESOS",
        ingreso: false,
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("grupo_cuentas", null, {});
  },
};
