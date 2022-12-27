const { response } = require("express");

const validarArchivoSubir = (req, res = response, nex) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) 
     return res.status(400).json({msg:"No hay archivos que subir. - archivo "});
     nex();
};

module.exports = {
  validarArchivoSubir,
};
