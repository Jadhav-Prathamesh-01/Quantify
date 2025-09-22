const pool = require('../config/database');

class Store {
  static async create(storeData) {
    const { 
      ownerId, 
      storeName, 
      description, 
      address, 
      phone, 
      email, 
      imageUrl, 
      category 
    } = storeData;
    
    const query = `
      INSERT INTO stores (owner_id, store_name, description, address, phone, email, image_url, category, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING id, store_name, description, address, phone, email, image_url, category, rating, total_reviews, status, created_at
    `;
    
    const values = [
      ownerId, 
      storeName, 
      description, 
      address, 
      phone, 
      email, 
      imageUrl, 
      category
    ];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByOwnerId(ownerId) {
    const query = 'SELECT * FROM stores WHERE owner_id = $1 ORDER BY created_at DESC';
    const values = [ownerId];
    
    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async findById(storeId) {
    const query = 'SELECT * FROM stores WHERE id = $1';
    const values = [storeId];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(storeId, updateData) {
    const { 
      storeName, 
      description, 
      address, 
      phone, 
      email, 
      imageUrl, 
      category 
    } = updateData;
    
    // Build dynamic query based on provided fields
    const fields = [];
    const values = [];
    let paramCount = 1;
    
    if (storeName !== undefined) {
      fields.push(`store_name = $${paramCount}`);
      values.push(storeName);
      paramCount++;
    }
    
    if (description !== undefined) {
      fields.push(`description = $${paramCount}`);
      values.push(description);
      paramCount++;
    }
    
    if (address !== undefined) {
      fields.push(`address = $${paramCount}`);
      values.push(address);
      paramCount++;
    }
    
    if (phone !== undefined) {
      fields.push(`phone = $${paramCount}`);
      values.push(phone);
      paramCount++;
    }
    
    if (email !== undefined) {
      fields.push(`email = $${paramCount}`);
      values.push(email);
      paramCount++;
    }
    
    if (imageUrl !== undefined) {
      fields.push(`image_url = $${paramCount}`);
      values.push(imageUrl);
      paramCount++;
    }
    
    if (category !== undefined) {
      fields.push(`category = $${paramCount}`);
      values.push(category);
      paramCount++;
    }
    
    if (fields.length === 0) {
      throw new Error('No fields to update');
    }
    
    // Add updated_at and store ID
    fields.push(`updated_at = NOW()`);
    values.push(storeId);
    
    const query = `
      UPDATE stores 
      SET ${fields.join(', ')} 
      WHERE id = $${paramCount}
      RETURNING id, store_name, description, address, phone, email, image_url, category, rating, total_reviews, status, created_at
    `;
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async delete(storeId) {
    const query = 'DELETE FROM stores WHERE id = $1 RETURNING id';
    const values = [storeId];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findAll() {
    const query = `
      SELECT s.*, u.name as owner_name, u.email as owner_email
      FROM stores s
      LEFT JOIN users u ON s.owner_id = u.id
      ORDER BY s.created_at DESC
    `;
    
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async findByStatus(status) {
    const query = 'SELECT * FROM stores WHERE status = $1 ORDER BY created_at DESC';
    const values = [status];
    
    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Store;
