require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function listUsers() {
  try {
    const result = await pool.query('SELECT id, name, email, role, status, store_name, created_at FROM users ORDER BY created_at');
    
    console.log('👥 All Users in Database:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    result.rows.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   👑 Role: ${user.role}`);
      console.log(`   📊 Status: ${user.status}`);
      if (user.store_name) console.log(`   🏪 Store: ${user.store_name}`);
      console.log(`   📅 Created: ${new Date(user.created_at).toLocaleString()}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

listUsers();
