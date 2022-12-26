const { response } = require("express");
const { Categoria, Server } = require("../models");

const crearCategoria = async (req, res = response, next) => {
  const nombre = req.body.nombre.toUpperCase();

  try {
    const categoriaDb = await Categoria.findOne({ nombre });
    if (categoriaDb)
      res.status(400).json({ msg: `La categoria ${nombre} , ya existe` });
    // generar data para guardar
    const data = {
      nombre,
      usuario: req.usuario._id,
    };

    const categoria = new Categoria(data);
    await categoria.save();

    res.json(categoria);
  } catch (error) {
    next(error);
  }
};

const obtenerCategorias = async (req, res = response, next) => {
  try {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, categorias] = await Promise.all([
      Categoria.countDocuments(query),
      Categoria.find(query)
        .populate("usuario", "nombre")
        .skip(Number(desde))
        .limit(Number(limite)),
    ]);

    res.json({
      total,
      categorias,
    });
  } catch (error) {
    next(error);
  }
};

const obtenerUnaCategoria = async (req, res = response, next) => {
  try {
    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate(
      "usuario",
      "nombre"
    );

    res.json(categoria);
  } catch (error) {
    next(error);
  }
};

const actualizarCategoria = async (req, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  data.nombre = data.nombre.toUpperCase();
  data.usuario = req.usuario.id;

  try {
    const categoria = await Categoria.findByIdAndUpdate(id, data, {
      new: true,
    }).populate("usuario", "nombre");
    res.json(categoria);
  } catch (error) {
    next(error);
  }
};

const borrarCategoria = async (req, res = response, next) => {
  const { id } = req.params;

  try {
    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, {
      estado: false,
    }).populate('usuario', 'nombre');
    res.json(categoriaBorrada);
  } catch (error) {
    next(error);
  }
};
module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerUnaCategoria,
  actualizarCategoria,
  borrarCategoria,
};
