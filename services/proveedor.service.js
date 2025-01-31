const { Pool } = require('pg');
const boom = require('boom');
const { faker } = require('@faker-js/faker');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'espe',
  password: 'espe',
  database: 'myStore',
});

class ProveedoresService {
  constructor() {
    this.pool = pool;
    this.pool.on('error', (err) => console.error(err));
  }


  async create(data) {
    const query = `
      INSERT INTO proveedores (name, ruc, direccion, estado) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *;
    `;
    const values = [data.name, data.ruc, data.direccion, data.estado];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }


  async find() {
    const query = 'SELECT * FROM proveedores';
    const result = await this.pool.query(query);
    return result.rows;
  }

  async findOne(id) {
    const query = 'SELECT * FROM proveedores WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    const product = result.rows[0];
    if (!product) {
      throw boom.notFound('proveedores not found');
    }
    if (product.isBlock) {
      throw boom.conflict('proveedores is blocked');
    }
    return product;
  }

  async update(id, changes) {
    const query = `
      UPDATE proveedores 
      SET name = COALESCE($1, name), ruc = COALESCE($2, ruc), 
      direccion = COALESCE($3, direccion), estado = COALESCE($4, estado)
      WHERE id = $5 
      RETURNING *;
    `;
    const values = [changes.name, changes.ruc, changes.direccion, changes.estado, id];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }


  async delete(id) {
    const query = 'DELETE FROM proveedores WHERE id = $1 RETURNING *';
    const result = await this.pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = ProveedoresService;
