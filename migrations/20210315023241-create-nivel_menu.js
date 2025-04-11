'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('nivel_menus', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            fk_menu: {
                type: Sequelize.INTEGER,
            },
            fk_nivel: {
                type: Sequelize.INTEGER,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('nivel_menus');
    }
};