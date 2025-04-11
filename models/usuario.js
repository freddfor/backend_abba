"use strict";
var bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const usuario = sequelize.define(
    "usuario",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      usuario: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
      },
      password: DataTypes.STRING,
      nombres: {
        allowNull: false,
        type: DataTypes.STRING(50),
      },
      apellidos: {
        allowNull: false,
        type: DataTypes.STRING(50),
      },
      full_name: {
        type: DataTypes.VIRTUAL,
        get() {
          return [
            this.getDataValue("nombres") + " " + this.getDataValue("apellidos"),
          ].join();
        },
      },
      email: DataTypes.STRING,
      ci: DataTypes.STRING,
      celular: DataTypes.STRING,
      logins: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      last_login: DataTypes.DATE,
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      fk_nivel: DataTypes.INTEGER,
      created_by: DataTypes.INTEGER,
      updated_by: DataTypes.INTEGER,
      deleted_by: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      freezeTableName: true,
      tableName: "usuarios",
      classMethods: {},
      defaultScope: {
        attributes: {
          exclude: ["password"],
        },
      },
      scopes: {
        withPassword: {
          attributes: {},
        },
      },
    }
  );

  usuario.beforeSave((usuario, options) => {
    if (usuario.changed("password")) {
      usuario.password = bcrypt.hashSync(
        usuario.password,
        bcrypt.genSaltSync(10),
        null
      );
    }
  });

  usuario.associate = function (models) {
    usuario.belongsTo(models.nivel, {
      foreignKey: "fk_nivel",
      as: "nivel",
    });
    usuario.belongsTo(models.usuario, {
      as: "usuarioCreator",
      foreignKey: "created_by",
    });
    usuario.belongsTo(models.usuario, {
      as: "userEditor",
      foreignKey: "updated_by",
    });
    usuario.hasMany(models.contrato, {
      foreignKey: "fk_titular",
      as: "titular",
    });
    usuario.hasMany(models.contrato, {
      foreignKey: "fk_suplente",
      as: "suplente",
    });
    usuario.hasMany(models.contrato_proceso_tarea, {
      foreignKey: "fk_responsable",
      as: "responsable",
    });
    usuario.hasMany(models.contrato_pago, {
      foreignKey: "created_by",
    });
    usuario.hasMany(models.contrato_observaciones, {
      foreignKey: "created_by",
    });
  };

  return usuario;
};
