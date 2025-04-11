const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models').usuario;

const validateJwt = async( req = request, res = response, next ) => {

    const auth_header = req.headers.authorization;

    // if token header hasn't sent
    if ( !auth_header ) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    // if is not bearer token
    if (!auth_header.startsWith("Bearer ")){
        throw res.status(401).json({
            msg: 'Unauthorized'
        });	
    }

    try {
        const bearer_token = TokenArray = auth_header.substring(7, auth_header.length);

        // verifying jwt
        const { id } = await jwt.verify( bearer_token, process.env.SECRETORPRIVATEKEY );

        // if user is deleted or does not exist in db
        const user = await Usuario.findOne({ where: { id } });        
        if( !user ) {
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe en db'
            })
        }
        
        req.user = user;
        next();

    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg: 'Token no válido'
        })
    }
}

module.exports = {
    validateJwt
}