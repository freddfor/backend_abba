"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("subgrupo_cuentas", [
      {
        id: 1,
        titulo: "INGRESOS DIFERIDOS POR ANTICIPO DE CLIENTES",
        ingreso: true,
        fk_grupo_cuenta: 1,
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        titulo: "INGRESOS POR SERVICIOS PRESTADOS",
        ingreso: true,
        fk_grupo_cuenta: 2,
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        titulo: "OTROS INGRESOS",
        ingreso: true,
        fk_grupo_cuenta: 2,
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        titulo: "GASTOS DE OPERACIÓN",
        ingreso: false,
        fk_grupo_cuenta: 3,
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 5,
        titulo: "HONORARIOS PROFESIONALES",
        ingreso: false,
        fk_grupo_cuenta: 3,
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 6,
        titulo: "BONIFICACION (Aguinaldos) Personal Permanente",
        ingreso: false,
        fk_grupo_cuenta: 3,
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 7,
        titulo: "HONORARIOS PROFESIONALES personal eventual",
        ingreso: false,
        fk_grupo_cuenta: 3,
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 8,
        titulo: "Comisiones de Promociones",
        ingreso: false,
        fk_grupo_cuenta: 3,
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 9,
        titulo: "CAJA CHICA",
        ingreso: false,
        fk_grupo_cuenta: 3,
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("subgrupo_cuentas", null, {});
  },
};
