"use strict";
const dayjs = require("dayjs");

let moreclientes = [];

for (let index = 3; index < 1000; index++) {
  moreclientes.push({
    ci: 1000 + index,
    nombres: "Freddy",
    apellidos: "Velasco",
    correo: `user${index}@gmail.com`,
    celular: "1234657",
    celular_ref: "1234657",
    fecha_nac: dayjs().add(index, 'day').format('YYYY-MM-DD'),
    lugar_trabajo: "El Alto",
    profesion: "Licenciado",
    fk_expedido: 1,
    fk_rubro: 1,
    fk_residencia: 1,
    fk_promotor: 1,
    created_by: 1,
    updated_by: 1,
    created_at: new Date(),
    updated_at: new Date(),
  });
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // return queryInterface.bulkInsert("clientes", [
      // {
      //   ci: "1000",
      //   extension: "",
      //   nombres: "Freddy",
      //   apellidos: "Velasco",
      //   correo: "fvelasco@gmail.com",
      //   celular: "1234657",
      //   celular_ref: "1234657",
      //   fecha_nac: "1999-01-01",
      //   lugar_trabajo: "El Alto",
      //   profesion: "Licenciado",
      //   fk_expedido: 1,
      //   fk_rubro: 1,
      //   fk_residencia: 1,
      //   fk_promotor: 1,
      //   created_by: 1,
      //   updated_by: 1,
      //   created_at: new Date(),
      //   updated_at: new Date(),
      // },
      // {
      //   ci: "1001",
      //   extension: "",
      //   nombres: "Remberto",
      //   apellidos: "Velasco",
      //   correo: "rvelasco@gmail.com",
      //   celular: "1234657",
      //   celular_ref: "1234657",
      //   fecha_nac: "1999-01-01",
      //   lugar_trabajo: "El Alto",
      //   profesion: "Licenciado",
      //   fk_expedido: 1,
      //   fk_rubro: 1,
      //   fk_residencia: 1,
      //   fk_promotor: 1,
      //   created_by: 1,
      //   updated_by: 1,
      //   created_at: new Date(),
      //   updated_at: new Date(),
      // },
      // {
      //   ci: "1002",
      //   extension: "",
      //   nombres: "Jose",
      //   apellidos: "Velasco",
      //   correo: "jvelasco@gmail.com",
      //   celular: "1234657",
      //   celular_ref: "1234657",
      //   fecha_nac: "1999-01-01",
      //   lugar_trabajo: "El Alto",
      //   profesion: "Profesor",
      //   fk_expedido: 1,
      //   fk_rubro: 1,
      //   fk_residencia: 1,
      //   fk_promotor: 1,
      //   created_by: 1,
      //   updated_by: 1,
      //   created_at: new Date(),
      //   updated_at: new Date(),
      // },
      // ...moreclientes,
    // ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("clientes", null, {});
  },
};
