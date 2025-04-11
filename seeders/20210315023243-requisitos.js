"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("requisitos", [
      {
        description: "CARNET DE IDENTIDAD (6 FOTOCOPIAS)",
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        description: "CERTIFICADO DE NACIMIENTO ORIGINAL (3 FOTOCOPIAS)",
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        description:
          "AVC DEL SEGURO (FOTOCOPIA ANVERSO Y REVERSO) (3 FOTOCOPIAS)",
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        description: "EXTRACTO DE LA AFPS A LA CUAL PERTENECE (ACTUALIZADO)",
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        description:
          "FOTOCOPIA DE CERTIFICADO DE COMPENSACION DE COTIZACIONES, VALIDOS PARA PERSONAS QUE TRABAJARON ANTES DE 199 CON EL ANTERIOR SISTEMA SENAISR (3 FOTCOPIAS)",
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        description: "ACTUALIZACION DE DATOS EN LA AFP DEL ESTADO CIVIL",
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        description:
          "CERTIFICADO DE TRABAJO QUE INDIQUE 'ACTUALMENTE TRABAJA' ",
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        description: "CARNET DE IDENTIDAD (3 FOTOCOPIAS)",
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        description: "CERTIFICADO DE MATRIMONIO ORIGINAL (3 FOTOCOPIAS)",
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("requisitos", null, {});
  },
};
