const Afp = require("../models").afp;

const dayjs = require("dayjs");

const { Op, Sequelize: sequelize } = require("sequelize");

const show_all = async (req, res, next) => {
  try {
    const afps = await Afp.findAll({
      attributes: ["id", "nombre"],
    });
    return res.status(200).send(afps);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  show_all,
  // store,
  // update,
  // destroy,
};
