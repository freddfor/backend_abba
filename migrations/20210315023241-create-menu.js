'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('menus', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            fk_menu: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'menus',
                    },
                    key: 'id'
                }
            },
            name: {
                allowNull: false,
                unique: true,
                type: Sequelize.STRING(80)
            },
            description: {
                type: Sequelize.STRING(150)
            },
            link: {
                type: Sequelize.STRING(150)
            },
            index: {
                type: Sequelize.INTEGER
            },
            append: {
                type: Sequelize.STRING(20)
            },
            append_class: {
                type: Sequelize.STRING(100)
            },
            class_name: {
                type: Sequelize.STRING(100)
            },
            is_icon_class: {
                type: Sequelize.BOOLEAN
            },
            icon: {
                type: Sequelize.STRING(50)
            },
            is_heading: {
                type: Sequelize.BOOLEAN
            },
            is_active: {
                type: Sequelize.BOOLEAN
            },
            created_by: {
                type: Sequelize.INTEGER
            },
            updated_by: {
                type: Sequelize.INTEGER
            },
            deleted_by: {
                type: Sequelize.INTEGER
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
            deleted_at: {
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('menus');
    }
};