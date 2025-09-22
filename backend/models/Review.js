const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

class Review {
  static async create(userId, storeId, rating, reviewText) {
    const query = `
      INSERT INTO reviews (user_id, store_id, rating, review_text)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, store_id) 
      DO UPDATE SET rating = $3, review_text = $4, updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const values = [userId, storeId, rating, reviewText];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByStoreId(storeId) {
    const query = `
      SELECT r.*, u.name as user_name, u.email as user_email
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = $1
      ORDER BY r.created_at DESC
    `;
    const result = await pool.query(query, [storeId]);
    return result.rows;
  }

  static async findByUserId(userId) {
    const query = `
      SELECT r.*, s.store_name, s.image_url
      FROM reviews r
      JOIN stores s ON r.store_id = s.id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async getStoreRating(storeId) {
    const query = `
      SELECT 
        AVG(rating) as average_rating,
        COUNT(*) as total_reviews
      FROM reviews 
      WHERE store_id = $1
    `;
    const result = await pool.query(query, [storeId]);
    return result.rows[0];
  }

  static async updateStoreRating(storeId) {
    const ratingData = await this.getStoreRating(storeId);
    const averageRating = ratingData.average_rating ? parseFloat(ratingData.average_rating).toFixed(1) : 0;
    const totalReviews = parseInt(ratingData.total_reviews) || 0;

    const updateQuery = `
      UPDATE stores 
      SET rating = $1, total_reviews = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
    `;
    await pool.query(updateQuery, [averageRating, totalReviews, storeId]);
  }

  static async delete(userId, storeId) {
    const query = 'DELETE FROM reviews WHERE user_id = $1 AND store_id = $2';
    const result = await pool.query(query, [userId, storeId]);
    return result.rowCount > 0;
  }

  static async findAll() {
    const query = `
      SELECT r.*, u.name as user_name, u.email as user_email
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }
}

module.exports = Review;
