const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos  , validarArchivoSubir} = require('../middlewares');

const {cargarArchivo, actualizarImg , mostrarImagen , actualizarImgcloudinary} = require('../controllers/uploads')

const {coleccionesPermitidas} = require('../helpers')


const router = Router();

router.post('/',validarArchivoSubir, cargarArchivo );

router.put('/:coleccion/:id',[
    validarArchivoSubir,
    check('id' , `EL id debe ser de mongo`).isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c , ['usuarios', 'productos'])),
    validarCampos
],actualizarImgcloudinary)

router.get('/:coleccion/:id' , [

],mostrarImagen )




module.exports = router;