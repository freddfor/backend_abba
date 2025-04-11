"use strict";
var bcrypt = require("bcrypt");
const dayjs = require("dayjs");

module.exports = (sequelize, DataTypes) => {
  const cliente = sequelize.define(
    "cliente",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      ci: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
      },
      extension: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      nombres: DataTypes.STRING,
      apellidos: DataTypes.STRING,
      nombre_completo: {
        type: DataTypes.VIRTUAL,
        get() {
          return [
            this.getDataValue("ci") + " - " + this.getDataValue("nombres") + " " + this.getDataValue("apellidos"),
          ].join();
        },
      },
      correo: DataTypes.STRING,
      celular: DataTypes.INTEGER,
      celular_ref: DataTypes.STRING,
      fecha_nac: DataTypes.DATE,
      fecha_def: DataTypes.DATE,
      lugar_trabajo: DataTypes.STRING,
      profesion: DataTypes.STRING,
      fk_expedido: {
        type: DataTypes.INTEGER,
      },
      fk_residencia: DataTypes.INTEGER,
      fk_rubro: DataTypes.INTEGER,
      fk_promotor: DataTypes.INTEGER,
      fk_afp_cliente: DataTypes.INTEGER,
      activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      created_by: DataTypes.INTEGER,
      updated_by: DataTypes.INTEGER,
      deleted_by: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
      nro_expediente: DataTypes.INTEGER,
      nro_carpetas: DataTypes.STRING,
    },
    {
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      tableName: "clientes",
    }
  );

  cliente.listClientes = (filtro, order, limit='') => {
    const query = `
    select * from ( 
    select cl.*, CASE WHEN cl.activo THEN 'ACTIVO' ELSE 'INACTIVO' END AS estado,
    concat (cl.ci, ' ',d.sigla) as ci_exp, concat(cl.apellidos,' ',cl.nombres) as cliente,concat(fecha_nac, ' ','00:00:00') as fecha_nacimiento,  
    date_part('year',age(cl.fecha_nac))  as edad, r.nombre as rubro ,re.nombre as residencia ,p.nombre  as promotor,
		ac.cua, a.nombre as afp
    from clientes cl
    inner join departamentos d on cl.fk_expedido = d.id 
    left join rubros r on cl.fk_rubro = r.id 
    left join residencias re on cl.fk_residencia = re.id 
    left join promotores p on cl.fk_promotor = p.id 
		LEFT JOIN afp_clientes ac on cl.fk_afp_cliente = ac.id
		LEFT JOIN afps a on ac.fk_afp = a.id
    where cl.deleted_at is null and cl.deleted_at is null
    ) as v
    ${filtro}
    ${order}
    ${limit}
    `
    return sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT
    });
  }


  cliente.countClientes = (filtro) => {
    const query = `
    select count(*) from ( 
      select cl.*, CASE WHEN cl.activo THEN 'ACTIVO' ELSE 'INACTIVO' END AS estado,
      concat (cl.ci, ' ',d.sigla) as ci_exp, concat(cl.apellidos,' ',cl.nombres) as cliente,concat(fecha_nac, ' ','00:00:00') as fecha_nacimiento,  
      date_part('year',age(cl.fecha_nac))  as edad, r.nombre as rubro ,re.nombre as residencia ,p.nombre  as promotor,
      ac.cua, a.nombre as afp
      from clientes cl
      inner join departamentos d on cl.fk_expedido = d.id 
      left join rubros r on cl.fk_rubro = r.id 
      left join residencias re on cl.fk_residencia = re.id 
      left join promotores p on cl.fk_promotor = p.id 
      LEFT JOIN afp_clientes ac on cl.fk_afp_cliente = ac.id
      LEFT JOIN afps a on ac.fk_afp = a.id
      where cl.deleted_at is null and cl.deleted_at is null
    ) as v
    ${filtro}
    `
    return sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT
    });
  }

  cliente.associate = function (models) {
    cliente.hasMany(models.contrato, {
      foreignKey: "fk_cliente",
    });
    cliente.belongsToMany(models.motivo, {
      through: models.cliente_consulta,
      foreignKey: "fk_cliente",
      otherKey: "fk_motivo",
    });
    cliente.belongsTo(models.departamento, {
      foreignKey: "fk_expedido",
    });
    cliente.belongsTo(models.promotor, {
      foreignKey: "fk_promotor",
    });
    cliente.belongsTo(models.residencia, {
      foreignKey: "fk_residencia",
    });
    cliente.belongsTo(models.rubro, {
      foreignKey: "fk_rubro",
    });
    cliente.belongsTo(models.afp_cliente, {
      foreignKey: "fk_afp_cliente",
    });
  };

  return cliente;
};
