require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function fixAdminRole() {
  try {
    console.log('🔧 Fixing admin role...');
    
    // First, update the database schema to allow 'admin' role
    await pool.query(`
      ALTER TABLE users 
      DROP CONSTRAINT IF EXISTS users_role_check;
    `);
    
    await pool.query(`
      ALTER TABLE users 
      ADD CONSTRAINT users_role_check 
      CHECK (role IN ('user', 'store', 'admin'));
    `);
    
    console.log('✅ Database schema updated to include admin role');
    
    // Update the existing admin user to have 'admin' role
    await pool.query(`
      UPDATE users 
      SET role = 'admin', updated_at = NOW() 
      WHERE email = 'admin@quantifyrating.com'
    `);
    
    console.log('✅ Admin user role updated to admin');
    
    // Verify the changes
    const result = await pool.query(`
      SELECT id, name, email, role, status, store_name 
      FROM users 
      WHERE email = 'admin@quantifyrating.com'
    `);
    
    if (result.rows.length > 0) {
      const admin = result.rows[0];
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('👑 Updated Admin Credentials:');
      console.log('📧 Email:', admin.email);
      console.log('🔑 Password: AdminPass123!');
      console.log('👑 Role:', admin.role);
      console.log('📊 Status:', admin.status);
      console.log('🏪 Store Name:', admin.store_name);
      console.log('🆔 User ID:', admin.id);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
    
  } catch (error) {
    console.error('❌ Error fixing admin role:', error);
  } finally {
    await pool.end();
  }
}

fixAdminRole();
