const { response } = require("express")

const validateSingleImage = ( req, res, next ) => {
  if( !req.files || Object.keys(req.files).length === 0 || !req.files.file  ) {
    return res.status(400).json({ 
      success: false,
		  message: "No hay archivos para subir.",
     })
  }

  if( !req.files || req.files.file.length > 1) {
    return res.status(400).json({
      success: false,
		  message: "Solo debe subir un archivo.",
    })
  }

  next()
}

module.exports = {
  validateSingleImage
}
