"use strict";

module.exports = (sequelize, DataTypes) => {
  const archivo = sequelize.define(
    "archivo",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      drive_id: DataTypes.STRING,
      nombre_concatenado: DataTypes.STRING,
      nombre_completo: DataTypes.STRING,
      tipo_archivo: DataTypes.STRING,
      mime_type: DataTypes.STRING,
      tamanio: DataTypes.INTEGER,
      webContentLink: DataTypes.STRING,
      webViewLink: DataTypes.STRING,
      iconLink: DataTypes.STRING,
      hasThumbnail: DataTypes.STRING,
      thumbnailLink: DataTypes.STRING,
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
      tableName: "archivos",
    }
  );

  archivo.associate = function (models) {};

  return archivo;
};
