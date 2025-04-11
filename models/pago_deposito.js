"use strict";

module.exports = (sequelize, DataTypes) => {
  const pago_deposito = sequelize.define(
    "pago_deposito",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      fk_cuenta: DataTypes.INTEGER,
      nro_deposito: DataTypes.STRING,
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
      tableName: "pago_depositos"
    }
  );

  pago_deposito.associate = function (models) {
    pago_deposito.belongsTo(models.cuenta_bancaria, {
      foreignKey: "fk_cuenta",
    });
    // pago_deposito.hasMany(models.contrato_pago, {
    //   foreignKey: "fk_deposito",
    // });
    pago_deposito.hasMany(models.libro_diario, {
      foreignKey: "fk_deposito",
    });
  };

  return pago_deposito;
};
