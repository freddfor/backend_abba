"use strict";

module.exports = (sequelize, DataTypes) => {
  const libro_diario = sequelize.define(
    "libro_diario",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      monto: DataTypes.DOUBLE,
      fecha: DataTypes.DATE,
      glosa: DataTypes.STRING,
      fk_cuenta: DataTypes.INTEGER,
      fk_deposito: DataTypes.INTEGER,
      fk_efectivo: DataTypes.INTEGER,
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
      tableName: "libro_diarios"
    }
  );

  libro_diario.associate = function (models) {
    libro_diario.belongsTo(models.cuenta, {
      foreignKey: "fk_cuenta",
    });
    libro_diario.belongsTo(models.pago_deposito, {
      foreignKey: "fk_deposito",
    });
    libro_diario.belongsTo(models.pago_efectivo, {
      foreignKey: "fk_efectivo",
    });
    libro_diario.belongsTo(models.usuario, {
      foreignKey: "created_by",
      as: "user_created",
    });
    libro_diario.hasMany(models.contrato_pago, {
      foreignKey: "fk_libro_diario",  
    });
  };

  return libro_diario;
};
