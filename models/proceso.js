"use strict";

module.exports = (sequelize, DataTypes) => {
  const proceso = sequelize.define(
    "proceso",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      titulo: DataTypes.STRING,
      fk_prestacion: DataTypes.INTEGER,
      fk_proceso: DataTypes.INTEGER,
      tiempo_espera: DataTypes.INTEGER,
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
      tableName: "procesos",
    }
  );

  proceso.associate = function (models) {
    // proceso.belongsToMany(models.prestacion, {
    //   through: models.prestacion_proceso,
    //   foreignKey: "fk_proceso",
    //   otherKey: "fk_prestacion",
    // });
    proceso.belongsTo(models.prestacion, {
      foreignKey: "fk_prestacion",
    });
    // proceso.hasMany(models.prestacion_proceso, {
    //   foreignKey: "fk_proceso",
    // });
    // proceso.belongsToMany(models.tarea, {
    //   through: models.proceso_tarea,
    //   foreignKey: "fk_proceso",
    //   otherKey: "fk_tarea",
    // });
    proceso.hasMany(models.tarea, {
      foreignKey: "fk_proceso",
    });
    proceso.hasMany(models.proceso_tarea, {
      foreignKey: "fk_proceso",
    });
    proceso.hasMany(models.contrato_proceso_tarea, {
      foreignKey: "fk_proceso",
    });
  };

  return proceso;
};
