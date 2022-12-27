const { response } = require("express");
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2

cloudinary.config(process.env.CLOUDINARY_URL);


const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require("../models");


const cargarArchivo = async (req, res = response) => {
  try {
    const nombre = await subirArchivo(req.files, ["txt", "md"], "textos");
    res.json({ nombre });
  } catch (error) {
    res.json({ error });
  }
};

const actualizarImg = async (req, res = response) => {
  const { coleccion, id } = req.params;
  let modelo;
  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo)
        return res
          .status(400)
          .json({ msg: `no existe un usuario con id ${id}` });
      break;

    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo)
        return res
          .status(400)
          .json({ msg: `no existe un producto con id ${id}` });
      break;

    default:
      return res.status(500).json({ msg: "Validacon no realizada" });
      break;
  }

  // Limpiar img previa 
  try {
    if (modelo.img) {
        // Borrar img del servidor 
        const pathImg = path.join(__dirname,'../uploads', coleccion, modelo.img );
        if(fs.existsSync(pathImg)){
            fs.unlinkSync(pathImg);
        }
    }
  } catch (error) {
      res.status(400).json({error})
  }

  const nombre = await subirArchivo(req.files, undefined, coleccion);
  modelo.img = nombre;

  await modelo.save();
  res.json({ modelo });
};

const mostrarImagen = async( req , res = response )=>{
  const {id, coleccion} = req.params;
  let modelo;
  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo)
        return res
          .status(400)
          .json({ msg: `no existe un usuario con id ${id}` });
      break;

    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo)
        return res
          .status(400)
          .json({ msg: `no existe un producto con id ${id}` });
      break;

    default:
      return res.status(500).json({ msg: "Validacon no realizada" });
  }

  // Limpiar img previa 
  try {
    if (modelo.img) {
        // Borrar img del servidor 
        const pathImg = path.join(__dirname,'../uploads', coleccion, modelo.img );
        if(fs.existsSync(pathImg)){
          return res.sendFile(pathImg)
        }
    }
  } catch (error) {
      res.status(400).json({error})
  }
  const pathNoImg = path.join(__dirname,'../assets/no-image.jpg')
  res.sendFile(pathNoImg);
}

const actualizarImgcloudinary = async (req, res = response) => {
  const { coleccion, id } = req.params;
  let modelo;
  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo)
        return res
          .status(400)
          .json({ msg: `no existe un usuario con id ${id}` });
      break;

    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo)
        return res
          .status(400)
          .json({ msg: `no existe un producto con id ${id}` });
      break;

    default:
      return res.status(500).json({ msg: "Validacon no realizada" });
      break;
  }

  // Limpiar img previa 
  try {
    if (modelo.img) {
        // Borrar img del servidor 
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length -1 ];
        [public_id] = nombre.split('.')

        cloudinary.uploader.destroy(public_id)
      
    }
  } catch (error) {
      res.status(400).json({error})
  }
  const {tempFilePath} = req.files.archivo;
  const {secure_url} = await cloudinary.uploader.upload(tempFilePath);

  // const nombre = await subirArchivo(req.files, undefined, coleccion);
  modelo.img = secure_url;
  await modelo.save();
  res.json({ modelo });
};

module.exports = {
  cargarArchivo,
  actualizarImg,
  mostrarImagen,
  actualizarImgcloudinary
};
