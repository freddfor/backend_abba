const fs = require('fs')
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/**
 * Sube un array de archivos a la carpeta uploads.
 * @author Carlos Ramirez <cramirez@miteleferico.bo>
 * @param {Array} files array de archivos.
 */
const uploadFiles = async (files, validExtensions = ['png', 'jpg', 'jpeg', 'gif'], folder = '') => {
  
  try {  
    let filesSaved = [];
    for (file of files) {
      //const filename = await saveFile(file,validExtensions)
      filesSaved.push( saveFile(file,validExtensions) )
    }

    return await Promise.all(filesSaved)
    
  } catch (error) {
    //deleteFiles(filesSaved, folder)
    throw Error(error)
  }
}
/**
 * Convierte el archivo de req en array.
 * @author Carlos Ramirez <cramirez@miteleferico.bo>
 * @param {Request.files} files objeto o array de archivos.
 */
const filesRequestToArray = ( files ) => {
  if (Array.isArray(files)) {
    return files
  } else 
  {
    const filesArray = [] 
    filesArray.push(files)
    return filesArray
  }
}

/**
 * Guarda un archivo en la carpeta de uploads.
 * @author Carlos Ramirez <cramirez@miteleferico.bo>
 * @param {Object} files objeto del archivo.
 */
const saveFile = async ( file, validExtensions ) => {
  
  try {
    const filename = file.name.split('.');
    const extension = filename[filename.length - 1];

    if (!validExtensions.includes(extension)) {
      throw Error(`La extensión ${extension} no es permitida - ${extensionesValidas}`)
    }

    const newFileName = uuidv4() + '.' + extension;
    const folder = ''
    const uploadPath = path.join(__dirname, '../uploads/', folder, newFileName);
  
    await file.mv(uploadPath)

    return {
      file_name: newFileName,
      extension: '.' + extension,
      folder
    }

  } catch (error) {
    throw Error(error)
  }
}

/**
 * Elimina los archivos de la carpeta upload.
 * @author Carlos Ramirez <cramirez@miteleferico.bo>
 * @param {Array} files Array de strings con el nombre del archivo.
 * @param {String} folder String de la ruta donde se encuentra el array de archivos.
 */
const deleteFiles = ( files, folder ) => {
  try {
    for(filename of files) {
      const filePath = path.join(__dirname, '../uploads/', folder, filename) 
      fs.unlink(filePath, (err) => {
        console.error("error", err)
      })
    }  
  } catch (error) {
    console.error(error)
  }
}

module.exports = {
	uploadFiles,
  filesRequestToArray
}