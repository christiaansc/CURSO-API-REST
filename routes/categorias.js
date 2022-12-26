const { Router } = require("express");
const { check } = require("express-validator");

const { validarJWT, validarCampos, esAdminRole } = require("../middlewares/");

const {existeCategoria} = require('../helpers/db-validators')

const {
  crearCategoria,
  obtenerCategorias,
  obtenerUnaCategoria,
  actualizarCategoria,
  borrarCategoria
} = require("../controllers/categorias");

// {{ url }}/api/categorias

const router = Router();

router.get("/:id",[
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos,
], obtenerUnaCategoria);

//obtener categorias - paginado - populate
// obtener todas las categorias - publico
router.get("/", obtenerCategorias);

// obtener una categoria -populate

// delete categoria - Estado :false

//crear categoria - cualquier persona con token valido
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearCategoria
);

//  actualizar - cualquiera con token valido
router.put("/:id",[
    validarJWT,
    check('nombre', 'Campo nombre es obligatorio').not().isEmpty(),
    validarCampos
], actualizarCategoria);

// Borrar una categoria -admin
router.delete("/:id",[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], borrarCategoria);

module.exports = router;
