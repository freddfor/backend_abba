


/**
 * This function through a switch case selector, checks the error type and how to react to it (on dev...)
 * @param {*} error receives an error JS type, which should have a .name attr, and also a .message attr
 */
const errorHandler = (error) => {
  switch (error.name) {
    case 'TypeError':
      console.log('[ERROR] Error on TypeError: ', error)
      break
    case 'SequelizeConnectionError':
      console.log('[ERROR] Error on SequelizeConnectionError: ', error)
      break
    default:
      console.log('[ERROR] Error on ' + error.name + ': ', error)
      break
  }
}

module.exports = {
  errorHandler
}