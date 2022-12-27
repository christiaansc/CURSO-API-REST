const dbValidators = require('../helpers/db-validators')
const generarJwt = require('../helpers/generar-jwt')
const googleVerify = require('../helpers/google-verify')
const subirArchivo = require('../helpers/subir-archivo')




module.exports = {
    ...dbValidators,
    ...generarJwt,
    ...googleVerify,
    ...subirArchivo
}

