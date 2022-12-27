const { Schema , model } = require('mongoose');



const produtoSchema = Schema({
    nombre:{
        type:String,
        required:['true', 'El nombre obligatorio'],
        unique:true
    },
    estado:{
        type:Boolean,
        default:true,
        required:true
    },
    usuario:{
        type:Schema.Types.ObjectId,
        ref:'Usuario',
        required:true
    },
    precio:{
        type:Number,
        default:0
    },
    categoria:{
        type:Schema.Types.ObjectId,
        ref:'Categoria',
        required:true
    },
    img:{type:String},
    descripcion:{type:String},
    disponible:{type:Boolean , default:true},



});
produtoSchema.methods.toJSON = function() {
    const { __v,estado,  ...data  } = this.toObject();
    return data;
}

module.exports = model('Producto', produtoSchema)