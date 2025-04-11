//'use strict';
//import {asset_type} from './asset_type'
module.exports = (sequelize, DataTypes) => {
  const failure_type = sequelize.define('failure_type', {
    fk_asset_type: {
      type: DataTypes.INTEGER,      
      allowNull: false,
      references: {
        model: 'asset_type',
        key: 'id'
      }
    },
    desc: {
      allowNull: false,
      type: DataTypes.STRING(50),
    },

    // Campos de actualizacion
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER,
    deleted_by: DataTypes.INTEGER,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE

  }, {
    timestamps: true,
    paranoid: true,
    // Campos que para registro de fechas
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    //tableName: 'failure_types'
  });

  return failure_type;
};