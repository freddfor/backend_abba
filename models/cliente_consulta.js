"use strict";

module.exports = (sequelize, DataTypes) => {
  const cliente_consulta = sequelize.define(
    "cliente_consulta",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      descripcion: DataTypes.STRING,
      estado: DataTypes.INTEGER,
      fecha: DataTypes.DATE,
      observaciones: DataTypes.STRING,
      cancelado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      fk_motivo: DataTypes.INTEGER,
      fk_cliente: DataTypes.UUIDV4,
      fk_user: DataTypes.INTEGER,
      fk_libro_diario: DataTypes.INTEGER,
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
      tableName: "cliente_consultas",
    }
  );

  cliente_consulta.listaConsultas = (filtro, order, limit, offset) => {
    const query = `
    select * from (
    select cc.*,
(case cc.estado 
when 0 then 'NO ATENDIDO' 
when 1 then 'ATENDIDO' 
end) as estado_text,
cl.nro_expediente, m.motivo, concat(cl.nombres,' ',cl.apellidos) as cliente, cl.ci ,
concat(u.nombres,' ',u.apellidos) as asesor,
concat(u2.nombres,' ',u2.apellidos) as creado_por, u2.usuario,
coalesce (ld.monto,0) as monto
from cliente_consultas cc
inner join motivos m on cc.fk_motivo = m.id
inner join clientes cl on cc.fk_cliente = cl.id 
inner join usuarios u on cc.fk_user = u.id
inner join usuarios u2 on cc.created_by = u2.id 
left join libro_diarios ld on cc.fk_libro_diario = ld.id
where cc.deleted_at is null and cc.deleted_at is null
) as v
${filtro}
${order}
limit ${limit} offset ${offset}
    `;

    return sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
  };

  cliente_consulta.countConsultas = (filtro) => {
    const query = `
      select count(*) from (
        select cc.*,
(case cc.estado 
when 0 then 'NO ATENDIDO' 
when 1 then 'ATENDIDO' 
end) as estado_text,
cl.nro_expediente, m.motivo, concat(cl.nombres,' ',cl.apellidos) as cliente, cl.ci ,
concat(u.nombres,' ',u.apellidos) as asesor,
concat(u2.nombres,' ',u2.apellidos) as creado_por, u2.usuario,
coalesce (ld.monto,0) as monto
from cliente_consultas cc
inner join motivos m on cc.fk_motivo = m.id
inner join clientes cl on cc.fk_cliente = cl.id 
inner join usuarios u on cc.fk_user = u.id
inner join usuarios u2 on cc.created_by = u2.id 
left join libro_diarios ld on cc.fk_libro_diario = ld.id
where cc.deleted_at is null and cc.deleted_at is null
      ) v
      ${filtro}
      `
    return sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT
    });
  }

  cliente_consulta.listaConsultasUsuario = (fk_user) => {
    const query = `
select cc.*,
m.motivo, concat(cl.nombres,' ',cl.apellidos) as cliente,cl.fecha_nac, cl.ci , cl.celular, cl.correo,
r.nombre as rubro,
concat(u.nombres,' ',u.apellidos) as asesor,
concat(u2.nombres,' ',u2.apellidos) as creado_por, u2.usuario,
coalesce (ld.monto,0) as monto
from cliente_consultas cc
inner join motivos m on cc.fk_motivo = m.id
inner join clientes cl on cc.fk_cliente = cl.id 
inner join usuarios u on cc.fk_user = u.id
inner join usuarios u2 on cc.created_by = u2.id 
left join libro_diarios ld on cc.fk_libro_diario = ld.id
left join rubros r on cl.fk_rubro = r.id
where cc.deleted_at is null and cc.deleted_at is null and cc.fk_user = $fk_user and cast(cc.created_at as Date) = CURRENT_DATE 
order  by cc.created_at asc 
    `;
    return sequelize.query(query, {
      bind: { fk_user },
      type: sequelize.QueryTypes.SELECT,
    });
  };

  cliente_consulta.associate = function (models) {
    cliente_consulta.belongsTo(models.cliente, {
      foreignKey: "fk_cliente",
    });

    cliente_consulta.belongsTo(models.motivo, {
      foreignKey: "fk_motivo",
    });

    cliente_consulta.belongsTo(models.usuario, {
      foreignKey: "fk_user",
      as: "usuario",
    });

    cliente_consulta.belongsTo(models.usuario, {
      foreignKey: "created_by",
      as: "usuario_created",
    });
  };
  return cliente_consulta;
};
