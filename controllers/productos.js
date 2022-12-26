const { response } = require("express");
const { Producto } = require("../models");

const crearProducto = async (req, res = response, next) => {
  const nombre = req.body.nombre.toUpperCase();
  const { estado ,usuario, ...body } = req.body;

  try {
    const productoBD = await Producto.findOne({ nombre });
    if (productoBD) {
      res.status(400).json({ msg: `El Producto  ${nombre} , ya existe` });
      // generar data para guardar
    } else {
      const data = {
        ...body,
        nombre,
        usuario: req.usuario._id,
      };

      const producto = new Producto(data);
      await producto.save();

      res.json(producto);
    }
  } catch (error) {
    next(error);
  }
};

const obtenerProductos = async (req, res, next) => {
  try {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, productos] = await Promise.all([
      Producto.countDocuments(query),
      Producto.find(query)
        .populate("usuario", "nombre")
        .populate("categoria", "nombre")
        .skip(Number(desde))
        .limit(Number(limite)),
    ]);

    res.json({
      total,
      productos,
    });
  } catch (error) {
    next(error);
  }
};
const obtenerUnProducto = async (req, res = response, next) => {
    try {
      const { id } = req.params;
      const producto = await Producto.findById(id).populate(
        "usuario",
        "nombre"
      );
  
      res.json(producto);
    } catch (error) {
      next(error);
    }
  };

const actualizarProducto = async (req, res = response, next) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;
  
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario.id;

    // console.log(data);
    try {
      const producto = await Producto.findByIdAndUpdate(id, data, {
        new: true,
      }).populate("usuario", "nombre")
      .populate('categoria', 'nombre');
      res.json(producto);
    } catch (error) {
      next(error);
    }
};

const borrarProducto = async (req, res = response, next) => {
    const { id } = req.params;
  
    try {
      const productoBorrado = await Producto.findByIdAndUpdate(id, {
        estado: false,
      }).populate('usuario', 'nombre')
        .populate('categoria','nombre');
      res.json(productoBorrado);
    } catch (error) {
      next(error);
    }
  };

module.exports = {
  actualizarProducto,
  borrarProducto,
  obtenerProductos,
  obtenerUnProducto,
  crearProducto,
};
