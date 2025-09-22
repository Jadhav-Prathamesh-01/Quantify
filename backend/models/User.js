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

  static async changePassword(userId, currentPassword, newPassword) {
    try {
      // First, get the user with their current password
      const query = 'SELECT id, password FROM users WHERE id = $1';
      const result = await pool.query(query, [userId]);
      
      if (result.rows.length === 0) {
        throw new Error('User not found');
      }
      
      const user = result.rows[0];
      
      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }
      
      // Hash new password
      const saltRounds = 12;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
      
      // Update password
      const updateQuery = 'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2 RETURNING id';
      await pool.query(updateQuery, [hashedNewPassword, userId]);
      
      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  static async updateProfile(userId, updateData) {
    try {
      const { name, email, phone, address, storeName, role, status } = updateData;
      
      // Build dynamic query based on provided fields
      const fields = [];
      const values = [];
      let paramCount = 1;
      
      if (name !== undefined) {
        fields.push(`name = $${paramCount}`);
        values.push(name);
        paramCount++;
      }
      
      if (email !== undefined) {
        fields.push(`email = $${paramCount}`);
        values.push(email);
        paramCount++;
      }
      
      if (phone !== undefined) {
        fields.push(`phone = $${paramCount}`);
        values.push(phone);
        paramCount++;
      }
      
      if (address !== undefined) {
        fields.push(`address = $${paramCount}`);
        values.push(address);
        paramCount++;
      }
      
      if (storeName !== undefined) {
        fields.push(`store_name = $${paramCount}`);
        values.push(storeName);
        paramCount++;
      }
      
      if (role !== undefined) {
        fields.push(`role = $${paramCount}`);
        values.push(role);
        paramCount++;
      }
      
      if (status !== undefined) {
        fields.push(`status = $${paramCount}`);
        values.push(status);
        paramCount++;
      }
      
      if (fields.length === 0) {
        throw new Error('No fields to update');
      }
      
      // Add updated_at and user ID
      fields.push(`updated_at = NOW()`);
      values.push(userId);
      
      const query = `
        UPDATE users 
        SET ${fields.join(', ')} 
        WHERE id = $${paramCount}
        RETURNING id, name, email, phone, address, role, status, store_name, created_at
      `;
      
      const result = await pool.query(query, values);
      
      if (result.rows.length === 0) {
        throw new Error('User not found');
      }
      
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async delete(userId) {
    try {
      const query = 'DELETE FROM users WHERE id = $1';
      const result = await pool.query(query, [userId]);
      
      if (result.rowCount === 0) {
        throw new Error('User not found');
      }
      
      return { success: true };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
