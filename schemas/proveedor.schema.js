//proveedor.schema.js
const Joi = require('joi');
const id = Joi.number().integer();
const name = Joi.string().min(3).max(15);
const ruc = Joi.string().min(10).max(15);
const direccion = Joi.string().min(10).max(15);
const estado = Joi.boolean();

const createProveedorSchema = Joi.object({
  name: name.required(),
  ruc: ruc.required(),
  direccion: direccion.required(),
  estado: estado.required(),
});

const updateProveedorSchema = Joi.object({
  name: name, ruc: ruc,
  direccion: direccion, estado: estado,
});

const getProveedorSchema = Joi.object({
  id: id.required(),
});

module.exports = { 
  createProveedorSchema, 
  updateProveedorSchema, 
  getProveedorSchema 
};
