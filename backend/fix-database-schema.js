require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function fixDatabaseSchema() {
  try {
    console.log('🔧 Fixing database schema to include pending status...');
    
    // Drop the existing constraint
    await pool.query(`
      ALTER TABLE users 
      DROP CONSTRAINT IF EXISTS users_status_check;
    `);
    
    // Add the new constraint with pending status
    await pool.query(`
      ALTER TABLE users 
      ADD CONSTRAINT users_status_check 
      CHECK (status IN ('active', 'inactive', 'suspended', 'pending'));
    `);
    
    console.log('✅ Database schema updated successfully');
    
    // Test the constraint
    await pool.query(`
      INSERT INTO users (name, email, password, address, role, status, store_name, phone, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
    `, [
      'Test User',
      'test@example.com',
      'hashedpassword',
      'Test Address',
      'user',
      'pending',
      null,
      '1234567890'
    ]);
    
    console.log('✅ Pending status constraint test passed');
    
    // Clean up test data
    await pool.query('DELETE FROM users WHERE email = $1', ['test@example.com']);
    console.log('✅ Test data cleaned up');
    
  } catch (error) {
    console.error('❌ Error fixing database schema:', error);
  } finally {
    await pool.end();
  }
}

fixDatabaseSchema();
