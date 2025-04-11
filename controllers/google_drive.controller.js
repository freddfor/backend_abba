const ErrorResponse = require("../helpers/error-response");
const { drive } = require("../helpers/google-drive-api");

const show_all = async (req, res, next) => {
  try {
    drive.files.list(
      {
        pageSize: 10,
        fields: "nextPageToken, files(*)",
      },
      (err, response) => {
        if (err) return console.log("The API returned an error: " + err);
        const files = response.data.files;
        res.status(200).json(files);
      }
    );

  } catch (e) {
    next(e);
  }
};

const show_one = async (req, res, next) => {
  try {
  } catch (e) {
    next(e);
  }
};

const store = async (req, res, next) => {
  try {
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
  } catch (e) {
    next(e);
  }
};

const destroy = async (req, res, next) => {
  try {
  } catch (e) {
    next(e);
  }
};

module.exports = {
  show_all,
  show_one,
  store,
  update,
  destroy,
};
