"use strict";

module.exports = (sequelize, DataTypes) => {
  const motivo = sequelize.define(
    "motivo",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      motivo: DataTypes.STRING,
      monto: DataTypes.DOUBLE,
      fk_cuenta: DataTypes.INTEGER,
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
      tableName: "motivos",
    }
  );

  motivo.associate = function (models) {
    motivo.belongsToMany(models.cliente, {
      through: models.cliente_consulta,
      foreignKey: "fk_motivo",
      otherKey: "fk_cliente",
    });
    motivo.hasMany(models.cliente_consulta, {
      foreignKey: "fk_motivo",
    });
    motivo.belongsTo(models.cuenta, {
      foreignKey: "fk_cuenta",
    });
  };

  return motivo;
};
