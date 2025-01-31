const express = require('express');

const ProveedoresService = require('./../services/proveedor.service');
const validatorHandler = require('./../middlewares/validator.handler');
const {
  createProveedorSchema, 
  updateProveedorSchema, 
  getProveedorSchema 
} = require('./../schemas/proveedor.schema');

const router = express.Router();
const service = new ProveedoresService();

router.get('/', async (req, res, next) => {
  try {
    const proveedores = await service.find();
    res.json(proveedores);
  } catch (error) {
    next(error);
  }
});

router.get(
  '/:id',
  validatorHandler(getProveedorSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const proveedor = await service.findOne(id);
      res.json(proveedor);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/',
  validatorHandler(createProveedorSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newProveedor = await service.create(body);
      res.status(201).json(newProveedor);
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
  '/:id',
  validatorHandler(getProveedorSchema, 'params'),
  validatorHandler(updateProveedorSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const proveedor = await service.update(id, body);
      res.json(proveedor);
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  '/:id',
  validatorHandler(getProveedorSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await service.delete(id);
      res.status(201).json({ id });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
