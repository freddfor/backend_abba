const errorCodes = require('../config/error-codes.json');
const ErrorResponse = require('../helpers/error-response');
const Menu = require('../models').menu;
const asyncHandler = require('../middlewares/async');

/**
 ** Obtiene el listado de menus.
 * @route GET /api/v1/menu
 * @author Victor H. Quispe <vhquispe@miteleferico.bo>
 * @access Private/Admin
 * @version 1.0.0
 * @param {Request} req - Request of the api.
 * @param {Response} res - Response of the api.
 */
const index = asyncHandler(async (req, res, next) => {

	const menus = await Menu.findAll({
		
	});

	if (!menus) {
		throw new ErrorResponse(1105);
	}

	return res.status(200).json({
		success: true,
		message: "Exito",
		data: menus
	});
});

/**
 * Obtiene el registro de un menu por id
 * @route GET /api/v1/menu/:id
 * @author Victor H. Quispe <vhquispe@miteleferico.bo>
 * @access Private/Admin
 * @version 1.0.0
 * @param {Request} req - Request of the api.
 * @param {Response} res - Response of the api.
 */
const show = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const menu = await Menu.findOne({
		where: { id }
	});

	if (!menu) {
		throw new ErrorResponse(1105);
	}

	return res.status(200).json(menu);

});


/**
 * Guarda el registro de un menu por id
 * @route POST /api/v1/menu
 * @author Victor H. Quispe <vhquispe@miteleferico.bo>
 * @access Private/Admin
 * @version 1.0.0
 * @param {Request} req - Request of the api.
 * @param {Response} res - Response of the api.
 */
const store = asyncHandler(async (req, res) => {

	const { fk_menu, name, description, link, index, append, append_class, class_name, is_icon_class, is_heading, icon } = req.body;
	//const fk_user = req.user.id;
	const fk_user = 1

	const newMenu = await Menu.create({
		fk_menu: fk_menu,
		name: name,
		description: description,
		link: link,
		index: index,
		append: append,
		append_class: append_class,
		class_name: class_name,
		is_icon_class: is_icon_class,
		icon: icon,
		is_heading: is_heading,
		is_active: true,
		created_by: 1,
		updated_by: 1			//req.user.id
	});

	/* 	if (!newMenu) {
			throw new ErrorResponse(1105);
		}
	 */
	return res.status(201).json(newMenu);
});


/**
 ** Elimina la instancia de un menu de manera logica
 * @route DELETE /api/v1/menu/:id
 * @author Victor H. Quispe <vhquispe@miteleferico.bo>
 * @access Private/Admin
 * @version 1.0.0
 * @param {Request} req - Request of the api.
 * @param {Response} res - Response of the api.
 */
const destroy = asyncHandler(async (req, res) => {
	const { id } = req.params;

	const menus = await Menu.findOne({ where: { id } });
	//const fk_user = req.user.id;
	const fk_user = 1

	if (!menus) {
		throw new ErrorResponse(1105);
	}

	await menus.destroy();
	await menus.update({
		deleted_by: fk_user					//req.user.id
	});

	return res.status(200).send({ message: "Successfully deleted", })

});

/**
 * Actualiza el registro de un menu por id
 * @route PUT /api/v1/menu/:id
 * @author Victor H. Quispe <vhquispe@miteleferico.bo>
 * @access Private/Admin
 * @version 1.0.0
 * @param {Request} req - Request of the api.
 * @param {Response} res - Response of the api.
 */
const update = asyncHandler(async (req, res) => {
	const id = req.params.id;
	const { fk_menu, name, description, link, append, append_class, class_name, index, is_icon_class, is_heading, icon, is_active } = req.body;

	//const fk_user = req.user.id;
	const fk_user = 1

	const menus = await Menu.findOne({
		where: {
			id: id
		}
	});

	if (!menus) {
		throw new ErrorResponse(1105);
	}

	await menus.update({
		fk_menu,
		name,
		description,
		link,
		append,
		append_class,
		class_name,
		index,
		is_icon_class,
		icon,
		is_heading,
		is_active,
		updated_by: fk_user
	});

	return res.status(200).json(menus);
});

const getMenuAndSubmenus = async (req, res) => {
	/* const listMenu = await Submenu.findAll({
		include: Menu, 
		where: {
			baja_logica: 1
		}
	}); */
	try {
		const listMenu = await Menu.findAll({
			attributes: ['id', 'menu', 'descripcion', 'path', 'indice', 'icono'],
			include: {
				model: Submenu,
				attributes: ['id', 'fk_menu', 'submenu', 'descripcion', 'path', 'indice'],
				where: { baja_logica: 1 }
			},
			where: { baja_logica: 1 }
		});

		return res.json({
			message: 'List of Menu!',
			data: listMenu
		});
	} catch (error) {
		console.log(error);
	}
}

module.exports = {
	index,
	store,
	show,
	destroy,
	update,
	//getMenuAndSubmenus
}