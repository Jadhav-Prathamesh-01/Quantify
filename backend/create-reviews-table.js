require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function createReviewsTable() {
  try {
    console.log('Creating reviews table...');
    
    const query = `
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        store_id INTEGER NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        review_text TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
        UNIQUE(user_id, store_id)
      );
    `;
    
    await pool.query(query);
    console.log('✅ Reviews table created successfully!');
    
    // Create indexes for better performance
    await pool.query('CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_reviews_store_id ON reviews(store_id);');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);');
    
    console.log('✅ Indexes created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating reviews table:', error);
  } finally {
    await pool.end();
  }
}

createReviewsTable();
