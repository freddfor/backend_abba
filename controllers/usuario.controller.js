"use strict";
const bcryptjs = require("bcryptjs");
const Usuario = require("../models").usuario;
const Nivel = require("../models").nivel;
const Menu = require("../models").menu;
const RecoveryPassword = require("../models").recovery_password;
const { Op } = require("sequelize");
const { getPagingData, getPagination } = require("../helpers/pagination");
const ErrorResponse = require("../helpers/error-response");
const asyncHandler = require("../middlewares/async");
const { sortBuilder } = require("../helpers/sort");
const { sendEmail } = require("../helpers/send-mails");
// var bcrypt = require("bcrypt");

const Cryptr = require("cryptr");
const cryptr = new Cryptr("myTotalySecretKey");

/**
 * Obtiene el listado de usuarios.
 * @route GET /api/v1/user
 * @author Carlos Ramirez <cramirez@miteleferico.bo>
 * @access Private/Admin
 * @version 1.0.0
 * @param {Request} req - Request of the api.
 * @param {Response} res - Response of the api.
 */

const index = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const condition = null;
  //const condition = search ? { name: { [Op.iLike]: `%${search.toLowerCase()}%` } } : null;

  const datos = await Usuario.findAll({
    attributes: { exclude: ["deleted_by", "deleted_at"] },
    include: [
      {
        attributes: { exclude: ["deleted_by", "deleted_at"] },
        model: Nivel,
        as: "nivel",
      },
    ],
    where: condition,
  });

  res.status(200).json({
    success: true,
    message: "lista obtenido exitosamente.",
    data: datos,
  });
});

/**
 * Obtiene el un usuario por id
 * @route GET /api/v1/user/:id
 * @author Carlos Ramirez <cramirez@miteleferico.bo>
 * @access Private/Admin
 * @version 1.0.0
 * @param {Request} req - Request of the api.
 * @param {Response} res - Response of the api.
 */
const show = asyncHandler(async (req, res) => {
  const id = req.param("id");

  const user = await Usuario.findOne({
    where: { id: id },
    include: [
      {
        model: Nivel,
        as: "nivel",
        attributes: ["id", "nivel"],
      },
    ],
  });

  if (!user) {
    throw new ErrorResponse(5000);
  }
  return res.status(200).send(user);
});

/**
 * Guarda una nueva instancia de usuario
 * @route POST /api/v1/user
 * @author Carlos Ramirez <cramirez@miteleferico.bo>
 * @access Private/Admin
 * @version 1.0.0
 * @param {Request} req - Request of the api.
 * @param {Response} res - Response of the api.
 */
const store = asyncHandler(async (req, res) => {
  const {
    fk_nivel,
    usuario,
    nombres,
    apellidos,
    email,
    ci,
    celular,
    password,
  } = req.body;

  const user = await Usuario.create({
    fk_nivel: fk_nivel,
    usuario: usuario.trim(),
    password,
    nombres: nombres,
    apellidos: apellidos,
    email: email.trim(),
    ci: ci,
    celular: celular,
    last_login: new Date(),
    created_by: req.user.id,
    updated_by: req.user.id,
  });

  const nuevo = await Usuario.findOne({
    where: { id: user.id },
    include: [
      {
        model: Nivel,
        as: "nivel",
        attributes: ["id", "nivel"],
      },
    ],
  });

  return res.status(200).send(nuevo);
});

/**
 * Actualiza la información de un usuario existente
 * @route PUT /api/v1/user/:id
 * @author Carlos Ramirez <cramirez@miteleferico.bo>
 * @access Private/Admin
 * @version 1.0.0
 * @param {Request} req - Request of the api.
 * @param {Response} res - Response of the api.
 */
const update = asyncHandler(async (req, res) => {
  const id = req.param("id");
  const { fk_nivel, nombres, apellidos, email, ci, celular, usuario, password } =
    req.body;

    console.log("contraseña: ", password);
  const user = await Usuario.findOne({
    where: {
      id: id,
    },
  });

  if (!user) {
    throw new ErrorResponse(5000);
  }

  await user.update({
    fk_nivel: fk_nivel,
    nombres: nombres,
    apellidos: apellidos,
    email: email.trim(),
    ci: ci,
    celular: celular,
    updated_by: req.user.id,
    usuario: usuario.trim(),
    password
  });

  const actualizado = await Usuario.findOne({
    where: { id: user.id },
    include: [
      {
        model: Nivel,
        as: "nivel",
        attributes: ["id", "nivel"],
      },
    ],
  });

  return res.status(200).json(actualizado);
});

/**
 * Elimina la instancia de un usuario de manera lógica
 * @route DELETE /api/v1/user/:id
 * @author Carlos Ramirez <cramirez@miteleferico.bo>
 * @access Private/Admin
 * @version 1.0.0
 * @param {Request} req - Request of the api.
 * @param {Response} res - Response of the api.
 */
const destroy = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const user = await Usuario.findOne({
    where: {
      id,
    },
    include: [
      {
        model: Nivel,
        as: "nivel",
        attributes: ["id", "nivel"],
      },
    ],
  });
  if (!user) {
    throw new ErrorResponse(5000);
  }

  await user.update({
    is_active: false,
  });
  // await user.destroy();
  return res.status(200).send(user);
});

const baja = asyncHandler(async (req, res) => {
  console.log("ingreso a la alta");
  const id = req.params.id;
  const user = await Usuario.findOne({
    where: {
      id,
    },
    include: [
      {
        model: Nivel,
        as: "nivel",
        attributes: ["id", "nivel"],
      },
    ],
  });
  if (!user) {
    throw new ErrorResponse(5000);
  }

  await user.update({
    is_active: false,
  });
  // await user.destroy();
  return res.status(200).send(user);
});

const alta = asyncHandler(async (req, res) => {
  console.log("ingreso a la alta");
  const id = req.params.id;
  const user = await Usuario.findOne({
    where: {
      id,
    },
    include: [
      {
        model: Nivel,
        as: "nivel",
        attributes: ["id", "nivel"],
      },
    ],
  });
  if (!user) {
    throw new ErrorResponse(5000);
  }

  await user.update({
    is_active: true,
  });
  // await user.destroy();
  return res.status(200).send(user);
});


const show_menus_by_user = async (req, res, next) => {
  const { id } = req.user;
  // console.log(id, "ID MENUS");
  try {
    const usuario = await Usuario.findOne({
      where: {
        id,
      },
    });

    const nivel = await Nivel.findOne({
      where: {
        id: usuario.fk_nivel,
      },
      include: [
        {
          model: Menu,
        },
      ],
      order: [[Menu, "id", "asc"]],
    });

    res.status(200).json(nivel);
  } catch (e) {
    next(e);
  }
};

const verify_token = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Token Valido",
    });
  } catch (e) {
    next(e);
  }
};

const recovery_password = async (req, res, next) => {
  const { emailRecovery } = req.body;
  try {
    const usuario = await Usuario.findOne({
      where: {
        email: emailRecovery,
      },
    });
    if (!usuario) {
      throw new ErrorResponse(1324);
    }

    const recovery_item = await RecoveryPassword.create({
      fk_user: usuario.id,
      completed: false,
    });

    let linkRecovery = "";

    const idUsuarioCrypt = cryptr.encrypt(`${usuario.id}`);

    const idRecoveryCrypt = cryptr.encrypt(`${recovery_item.id}`);

    // linkRecovery = `${process.env.FRONTEND}/auth/recovery?id=${idUsuarioCrypt}&rid=${idRecoveryCrypt}`
    linkRecovery = `${process.env.FRONTEND_HEROKU}/auth/recovery?id=${idUsuarioCrypt}&rid=${idRecoveryCrypt}`;
    // await recovery_item.update({
    //   url: linkRecovery
    // });
    console.log(linkRecovery, "Link de recou", process.env.NODE_ENV);

    var mailOptions = {
      from: "abbaconsultora07@gmail.com",
      to: emailRecovery,
      subject: "Reestablecer contraseña",
      html: `<div>
      Estimado ${usuario.full_name}, Ha solicitado recuperar su contraseña, <br> si esta
      seguro de hacerlo favor haga click en el siguiente enlace:
      <a href="${linkRecovery}"> Recuperar Contraseña</a><br>
      Esto es una notificación del sistema, no responder a este correo.<br> Si tiene
      problemas para ingresar favor comunique al correo:
      luis.freddy.velasco@gmail.com
    </div>`,
    };

    sendEmail(mailOptions);

    res.status(200).json({
      success: true,
      message: `Se envio un correo a ${emailRecovery}`,
    });
  } catch (e) {
    next(e);
  }
};

const verificar_recovery = async (req, res, next) => {
  const { id, rid } = req.query;
  try {
    const idUser = cryptr.decrypt(id);
    const rIdRecovery = cryptr.decrypt(rid);

    console.log(idUser, rIdRecovery);

    const recovery = await RecoveryPassword.findOne({
      where: {
        id: rIdRecovery,
      },
    });

    if (recovery.completed) {
      throw new ErrorResponse(1325);
    }
    // const usuario = await Usuario.findOne({
    //   where: {
    //     email: emailRecovery
    //   }
    // });

    res.status(200).json({
      success: true,
      message: `El link aun esta disponible`,
    });
  } catch (e) {
    next(e);
  }
};

const reset_password = async (req, res, next) => {
  const { id, rid } = req.query;
  const { password } = req.body;
  try {
    const idUser = cryptr.decrypt(id);
    const rIdRecovery = cryptr.decrypt(rid);

    console.log(idUser, rIdRecovery);

    const usuario = await Usuario.findOne({
      where: {
        id: idUser,
      },
    });

    const recovery = await RecoveryPassword.findOne({
      where: { id: rIdRecovery },
    });

    await usuario.update({
      password,
    });

    // password: bcrypt.hashSync(
    //   password,
    //   bcrypt.genSaltSync(10),
    //   null
    // )

    await recovery.update({ completed: true });

    res.status(200).json({
      success: true,
      message: `Se actualizo la contraseña correctamente`,
    });
  } catch (e) {
    next(e);
  }
};

const cambiar_password = async (req, res, next) => {
  const { password, passwordActual } = req.body;
  try {
    console.log(passwordActual, 'contraseña actula ----');
    console.log(req.user.id, 'contraseña actula encriptada ----');
    // Verificar la contraseña
    // const validPassword = bcryptjs.compareSync(passwordActual, req.user.password);
    // if (!validPassword) {
    //   throw new ErrorResponse(1308);
    // }

    console.log(password,'contraseña');
    const usuario = await Usuario.findOne({
      where: {
        id: req.user.id,
      },
    });
    
    await usuario.update({
      password,
    });

    res.status(200).json({
      success: true,
      message: `Se actualizo la contraseña correctamente`,
    });
  } catch (e) {
    next(e);
  }
};

const myselfbytoken = asyncHandler(async (req, res) => {
  // console.log(req.user);

  const user = await Usuario.findOne({
    where: { id: req.user.id },
    include: [
      {
        model: Nivel,
        as: "nivel",
        attributes: ["id", "nivel"],
      },
    ],
  });

  if (!user) {
    throw new ErrorResponse(5000);
  }
  return res.status(200).send(user);
});

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
  baja,
  alta,
  show_menus_by_user,
  verify_token,
  recovery_password,
  verificar_recovery,
  reset_password,
  cambiar_password,
  myselfbytoken,
};
