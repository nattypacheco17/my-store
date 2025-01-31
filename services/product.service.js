/*const boom = require('boom');
const { faker } = require('@faker-js/faker');
const pool = require('../libs/postgres.pool');
class ProductsService {
  constructor() {
    this.products = [];
    this.generate();
    this.pool = pool;
    this.pool.on('error', (err) => console.error(err));
  }

  generate() {
    const limit = 100;
    for (let index = 0; index < limit; index++) {
      this.products.push({
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        price: parseInt(faker.commerce.price(), 10),
        image: faker.image.url(),
        isBlock: faker.datatype.boolean(),
      });
    }
  }

  async create(data) {
    const newProduct = {
      id: faker.string.uuid(),
      ...data,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  async find() {
    const query = 'SELECT * FROM tasks';
    const rst = await this.pool.query(query);
    return rst.rows;
  }

  async findOne(id) {
    const product = this.products.find((item) => item.id === id);
    if (!product) {
      throw boom.notFound('product not found');
    }
    if (product.isBlock) {
      throw boom.conflict('product is block');
    }
    return product;
  }

  async update(id, changes) {
    const index = this.products.findIndex((item) => item.id === id);
    if (index === -1) {
      throw boom.notFound('product not found');
    }
    const product = this.products[index];
    this.products[index] = {
      ...product,
      ...changes,
    };
    return this.products[index];
  }

  async delete(id) {
    const index = this.products.findIndex((item) => item.id === id);
    if (index === -1) {
      throw boom.notFound('product not found');
    }
    this.products.splice(index, 1);
    return { id };
  }
}

module.exports = ProductsService;
*/

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

class ProductsService {
  constructor() {
    this.pool = pool;
    this.pool.on('error', (err) => console.error(err));
  }

  async create(data) {
    const query = `
      INSERT INTO products (name, price, image, isBlock) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *;
    `;
    const values = [data.name, data.price, data.image, data.isBlock];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async find() {
    const query = 'SELECT * FROM products';
    const result = await this.pool.query(query);
    return result.rows;
  }

  async findOne(id) {
    const query = 'SELECT * FROM products WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    const product = result.rows[0];
    if (!product) {
      throw boom.notFound('Product not found');
    }
    if (product.isBlock) {
      throw boom.conflict('Product is blocked');
    }
    return product;
  }

  async update(id, changes) {
    const query = `
      UPDATE products 
      SET name = COALESCE($1, name), price = COALESCE($2, price), 
      image = COALESCE($3, image), isBlock = COALESCE($4, isBlock)
      WHERE id = $5 
      RETURNING *;
    `;
    const values = [changes.name, changes.price, changes.image, changes.isBlock, id];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async delete(id) {
    const query = 'DELETE FROM products WHERE id = $1 RETURNING *';
    const result = await this.pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = ProductsService;
