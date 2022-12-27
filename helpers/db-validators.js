const { Categoria, Usuario, Producto, Role } = require("../models");

const esRoleValido = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol ${rol} no está registrado en la BD`);
  }
};

const emailExiste = async (correo = "") => {
  // Verificar si el correo existe
  const existeEmail = await Usuario.findOne({ correo });
  if (existeEmail) {
    throw new Error(`El correo: ${correo}, ya está registrado`);
  }
};

const existeUsuarioPorId = async (id) => {
  // Verificar si el correo existe
  const existeUsuario = await Usuario.findById(id);
  if (!existeUsuario) {
    throw new Error(`El id no existe ${id}`);
  }
};

const existeCategoria = async (id) => {
  const categoria = await Categoria.findById(id);
  if (!categoria) throw new Error(`No existe la categoria con id ${id}`);
};

const existeProducto = async (id) => {
  const producto = await Producto.findById(id);

  if (!producto) throw new Error(`No existe el producto con id ${id}`);
};


// Validar colecciones permitidas
const coleccionesPermitidas = (coleccion ='' , colecciones = [])=>{

  const incluida = colecciones.includes(coleccion);
  if(!incluida) throw new Error(`La Coleccion ${coleccion} no e spermitida , colecciones ${colecciones}`)

  return true;
}

module.exports = {
  coleccionesPermitidas,
  esRoleValido,
  emailExiste,
  existeUsuarioPorId,
  existeCategoria,
  existeProducto,
};
