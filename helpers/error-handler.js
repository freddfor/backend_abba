const errorCodes = require('../config/error-codes.json');

const handleErrors = (err, req, res, next) => {

  var errorCode = err.errorCode;
  var statusCode = 500;
  var message = 'Lo sentimos ha ocurrido un error'

  console.log(err.statusCode);

  if (!errorCode) {
    // excepciones no controladas 
    errorCode = 1000;
  } else {
    // exceptiones controladas
    errorCodes.forEach(error => {
      //console.log(error);
      if (err.errorCode == error.errorCode) {
        statusCode = error.statusCode,
        message = error.message
      }
    });
  }

  //TODO guardar en logs

  console.error(err)

  return res.status(statusCode).json({
    success: false,
    message: message,
    errorCode: errorCode
  });

};

module.exports = {
  handleErrors
}