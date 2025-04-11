const Promotores = require('../models').promotor;

const index = async (_, res) => {
	const promotores = await Promotores.findAll();
	res.send(promotores);
};

const store = async (req, res, next) => {
	const { nombre } = req.body;
	try {
		let promotor = await Promotores.create({
			nombre
		});
		return res.status(200).send(promotor);
	} catch (e) {
		next(e);
	}
};

module.exports = {
	index,
	store
}