require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function createTestUser() {
  try {
    console.log('👤 Creating test user...');
    
    // Test user credentials
    const userData = {
      name: 'Test User Account Name',
      email: 'testuser@example.com',
      password: 'TestPass123!',
      address: '456 Test Avenue, Test City, TC 54321',
      role: 'user',
      status: 'active',
      phone: '9876543210'
    };

    // Check if user already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [userData.email]);
    
    if (existingUser.rows.length > 0) {
      console.log('❌ Test user already exists!');
      console.log('📧 Email:', userData.email);
      console.log('🔑 Password:', userData.password);
      process.exit(0);
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    // Insert test user
    const query = `
      INSERT INTO users (name, email, password, address, role, status, phone, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING id, name, email, role, status
    `;
    
    const values = [
      userData.name,
      userData.email,
      hashedPassword,
      userData.address,
      userData.role,
      userData.status,
      userData.phone
    ];

    const result = await pool.query(query, values);
    const user = result.rows[0];

    console.log('✅ Test user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 Test User Credentials:');
    console.log('📧 Email:', user.email);
    console.log('🔑 Password:', userData.password);
    console.log('👑 Role:', user.role);
    console.log('📊 Status:', user.status);
    console.log('🆔 User ID:', user.id);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🌐 You can now login at: http://localhost:5173/login');
    
  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    await pool.end();
  }
}

createTestUser();
