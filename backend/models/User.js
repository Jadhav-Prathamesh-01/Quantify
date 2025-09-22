const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const { name, email, password, address, role, status, storeName, phone } = userData;
    
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const query = `
      INSERT INTO users (name, email, password, address, role, status, store_name, phone, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING id, name, email, address, role, status, store_name, phone, created_at
    `;
    
    const values = [name, email, hashedPassword, address, role, status, storeName || null, phone];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    const query = 'SELECT id, name, email, address, role, status, store_name, phone, created_at FROM users WHERE id = $1';
    const values = [id];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async checkEmailExists(email) {
    const query = 'SELECT id FROM users WHERE email = $1';
    const values = [email];
    
    try {
      const result = await pool.query(query, values);
      return result.rows.length > 0;
    } catch (error) {
      throw error;
    }
  }

  static async findByStatus(status) {
    const query = 'SELECT id, name, email, address, role, status, store_name, phone, created_at FROM users WHERE status = $1 ORDER BY created_at DESC';
    const values = [status];
    
    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async updateStatus(id, status) {
    const query = 'UPDATE users SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING id, name, email, status, store_name';
    const values = [status, id];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findAll() {
    const query = 'SELECT id, name, email, address, role, status, store_name, phone, created_at FROM users ORDER BY created_at DESC';
    
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
