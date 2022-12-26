const { response } = require("express");
const { Usuario, Categoria, Producto } = require("../models");
const { ObjectId } = require("mongoose").Types;
const coleccionesPermitidas = ["usuarios", "productos", "categorias", "roles"];

const buscarUsuarios = async (termino = "", res = response) => {
  const esMongoID = ObjectId.isValid(termino); // true
  if (esMongoID) {
    const usuario = await Usuario.findById(termino);
    return res.json({
      results: usuario ? [usuario] : [],
    });
  }
  const regex = new RegExp(termino, "i");
  const usuarios = await Usuario.find({
    $or: [{ nombre: regex }, { correo: regex }],
    $and: [{ estado: true }],
  });
  res.json({
    results: usuarios,
  });
};

const buscarCategorias = async (termino = "", res = response) => {
  const esMongoID = ObjectId.isValid(termino); // true
  if (esMongoID) {
    const categoria = await Categoria.findById(termino);
    return res.json({
      results: categoria ? [categoria] : [],
    });
  }
  const regex = new RegExp(termino, "i");
  const categorias = await Categoria.find({ nombre: regex, estado: true });
  res.json({
    results: categorias,
  });
};

const buscarProductos = async (termino = "", res = response) => {
  const esMongoID = ObjectId.isValid(termino); // true
  if (esMongoID) {
    const producto = await Producto.findById(termino)
                                        .populate('categoria','nombre');
    return res.json({
      results: producto ? [producto] : [],
    });
  }
  const regex = new RegExp(termino, "i");
  const productos = await Producto.find({ nombre: regex, estado: true })
                                    .populate('categoria','nombre');
  res.json({
    results: productos,
  });
};
const buscar = async (req, res = response, next) => {
  const { coleccion, termino } = req.params;

  if (!coleccionesPermitidas.includes(coleccion)) {
    res.status(400).json({
      msg: `Las collecciones permitidas son ${coleccionesPermitidas}`,
    });
  }
  switch (coleccion) {
    case "usuarios":
      buscarUsuarios(termino, res);
      break;
    case "categorias":
      buscarCategorias(termino, res);

      break;
    case "productos":
      buscarProductos(termino, res);
      break;
    default:
      res.status(500).json({
        msg: "NSe me ha olvidado esta busqueda",
      });
      break;
  }
};

module.exports = {
  buscar,
};
