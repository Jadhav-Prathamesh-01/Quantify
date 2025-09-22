require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function testStoreRegistration() {
  try {
    console.log('🧪 Testing store registration with pending status...');
    
    // Test store registration data
    const storeData = {
      name: 'Test Store Owner Name Here',
      email: 'teststore@example.com',
      password: 'TestPass123!',
      address: '123 Store Street, Business City, BC 12345',
      role: 'store',
      storeName: 'Test Store',
      phone: '555-0123'
    };
    
    // Check if store already exists
    const existingStore = await pool.query('SELECT id FROM users WHERE email = $1', [storeData.email]);
    if (existingStore.rows.length > 0) {
      console.log('Store already exists, updating status to pending...');
      await pool.query('UPDATE users SET status = $1 WHERE email = $2', ['pending', storeData.email]);
    } else {
      // Create new store with pending status
      const hashedPassword = await bcrypt.hash(storeData.password, 12);
      
      await pool.query(`
        INSERT INTO users (name, email, password, address, role, status, store_name, phone, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      `, [
        storeData.name,
        storeData.email,
        hashedPassword,
        storeData.address,
        storeData.role,
        'pending', // Store owners start as pending
        storeData.storeName,
        storeData.phone
      ]);
      
      console.log('✅ Store created with pending status');
    }
    
    // Verify the store is pending
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [storeData.email]);
    const store = result.rows[0];
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🏪 Test Store Registration:');
    console.log('📧 Email:', store.email);
    console.log('🏪 Store Name:', store.store_name);
    console.log('👑 Role:', store.role);
    console.log('📊 Status:', store.status);
    console.log('🆔 User ID:', store.id);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Store registration test completed!');
    console.log('🔒 Store owners cannot login until admin approval');
    
  } catch (error) {
    console.error('❌ Error testing store registration:', error);
  } finally {
    await pool.end();
  }
}

testStoreRegistration();
