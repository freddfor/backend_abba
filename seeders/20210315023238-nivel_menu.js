"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("nivel_menus", [
      {
        fk_nivel: 1,
        fk_menu: 1,
      },
      {
        fk_nivel: 1,
        fk_menu: 2,
      },
      {
        fk_nivel: 1,
        fk_menu: 3,
      },
      {
        fk_nivel: 1,
        fk_menu: 4,
      },
      {
        fk_nivel: 1,
        fk_menu: 5,
      },
      {
        fk_nivel: 1,
        fk_menu: 6,
      },
      {
        fk_nivel: 1,
        fk_menu: 7,
      },
      {
        fk_nivel: 1,
        fk_menu: 8,
      },
      {
        fk_nivel: 1,
        fk_menu: 9,
      },
      {
        fk_nivel: 1,
        fk_menu: 10,
      },
      {
        fk_nivel: 1,
        fk_menu: 11,
      },
      {
        fk_nivel: 1,
        fk_menu: 12,
      },
      {
        fk_nivel: 1,
        fk_menu: 13,
      },
      {
        fk_nivel: 1,
        fk_menu: 14,
      },
      {
        fk_nivel: 1,
        fk_menu: 15,
      },
      {
        fk_nivel: 1,
        fk_menu: 16,
      },
      {
        fk_nivel: 1,
        fk_menu: 17,
      },
      {
        fk_nivel: 1,
        fk_menu: 18,
      },
      {
        fk_nivel: 1,
        fk_menu: 19,
      },
      {
        fk_nivel: 1,
        fk_menu: 20,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("nivel_menus", null, {});
  },
};
