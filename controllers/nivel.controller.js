"use strict";
const Nivel = require("../models").nivel;
const Menu = require("../models").menu;
const Usuarios = require("../models").usuario;
const NivelMenu = require("../models").nivel_menu;
const ErrorResponse = require("../helpers/error-response");
const asyncHandler = require("../middlewares/async");

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

  const datos = await Nivel.findAll({
    attributes: { exclude: ["deleted_by", "deleted_at"] },
    where: condition,
    include: [
      {
        model: Menu,
      },
    ],
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
// const show = asyncHandler(async (req, res) => {
//   const id = req.param("id");

//   const user = await Usuario.findOne({
//     where: { id: id },
//     include: [
//       {
//         model: Nivel,
//         as: 'nivel',
//         attributes: ['id', 'nivel']
//       }
//     ]
//   })

//   if (!user) {
//     throw new ErrorResponse(5000);
//   }
//   return res.status(200).send(user)
// })

// /**
//  * Guarda una nueva instancia de usuario
//  * @route POST /api/v1/user
//  * @author Carlos Ramirez <cramirez@miteleferico.bo>
//  * @access Private/Admin
//  * @version 1.0.0
//  * @param {Request} req - Request of the api.
//  * @param {Response} res - Response of the api.
//  */
// const store = asyncHandler(async (req, res) => {

//   const { fk_nivel, usuario, nombres, apellidos, email, ci, celular } = req.body;

//   const user = await Usuario.create({
//     fk_nivel: fk_nivel,
//     usuario: usuario,
//     password: '123456',
//     nombres: nombres,
//     apellidos: apellidos,
//     email: email,
//     ci: ci,
//     celular: celular,
//     last_login: new Date(),
//     created_by: req.user.id,
//     updated_by: req.user.id
//   });
//   return res.status(200).send(user);
// })

// /**
//  * Actualiza la información de un usuario existente
//  * @route PUT /api/v1/user/:id
//  * @author Carlos Ramirez <cramirez@miteleferico.bo>
//  * @access Private/Admin
//  * @version 1.0.0
//  * @param {Request} req - Request of the api.
//  * @param {Response} res - Response of the api.
//  */
// const update = asyncHandler(async (req, res) => {
//   const id = req.param("id");
//   const { fk_nivel, nombres, apellidos, email, ci, celular } = req.body;

//   const user = await Usuario.findOne({
//     where: {
//       id: id
//     }
//   });

//   if (!user) {
//     throw new ErrorResponse(5000);
//   }

//   await user.update({
//     fk_nivel: fk_nivel,
//     nombres: nombres,
//     apellidos: apellidos,
//     email: email,
//     ci: ci,
//     celular: celular,
//     updated_by: req.user.id
//   });

//   return res.status(200).json(user);
// })

// /**
//  * Elimina la instancia de un usuario de manera lógica
//  * @route DELETE /api/v1/user/:id
//  * @author Carlos Ramirez <cramirez@miteleferico.bo>
//  * @access Private/Admin
//  * @version 1.0.0
//  * @param {Request} req - Request of the api.
//  * @param {Response} res - Response of the api.
//  */
// const destroy = asyncHandler(async (req, res) => {
//   const id = req.params.id;

//   const user = await Usuario.findOne({
//     where: {
//       id
//     }
//   });

//   if (!user) {
//     throw new ErrorResponse(5000);
//   }

//   await user.destroy();
//   await user.update({
//     deleted_by: req.user.id
//   });

//   return res.status(200).send(user)
// })

const get_user_nivel = async (req, res, next) => {
  const { nivel } = req.query;
  try {
    const users = await Usuarios.findAll({
      where: {
        fk_nivel: nivel,
      },
    });

    res.status(200).json(users);
  } catch (e) {
    next(e);
  }
};

const menus_nivel = async (req, res, next) => {
  const { menus, fk_nivel } = req.body;
  try {
    for (const menu of menus) {
      let nivel_menu = await NivelMenu.findOne({
        where: {
          fk_nivel,
          fk_menu: menu.id
        }
      });

      if (nivel_menu) {
        if (!menu.checked) {
          await nivel_menu.destroy();
        }
      } else {
        if (menu.checked) {
          await NivelMenu.create({
            fk_menu: menu.id,
            fk_nivel
          });
        }
      }
    }

    const update_nivel = await Nivel.findOne({
      attributes: { exclude: ["deleted_by", "deleted_at"] },
      where: {
        id: fk_nivel
      },
      include: [
        {
          model: Menu,
        },
      ],
    });

    res.status(200).json(update_nivel);
  } catch (e) {
    next(e);
  }
};

const store = async (req, res, next) => {
  const { nivel, descripcion } = req.body;
  try {
    const new_nivel = await Nivel.create({
      nivel,
      descripcion,
      created_by: req.user.id,
      updated_by: req.user.id
    });

    const nivel_menu = await Nivel.findOne({
      attributes: { exclude: ["deleted_by", "deleted_at"] },
      where: {
        id: new_nivel.id
      },
      include: [
        {
          model: Menu,
        },
      ],
    });

    res.status(200).json(nivel_menu);
  } catch (e) {
    next(e);
  }
}

const update = async (req, res, next) => {
  const { id, nivel, descripcion } = req.body;
  try {
    const nnivel = await Nivel.findOne({
      where: {
        id
      }
    });

    await nnivel.update({
      nivel,
      descripcion,
      updated_by: req.user.id
    });

    const nunivel = await Nivel.findOne({
      attributes: { exclude: ["deleted_by", "deleted_at"] },
      where: {
        id
      },
      include: [
        {
          model: Menu,
        },
      ],
    });

    res.status(200).json(nunivel);
  } catch (e) {
    next(e);
  }
}

module.exports = {
  index,
  get_user_nivel,
  menus_nivel,
  store,
  update
};
