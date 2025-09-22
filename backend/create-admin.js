require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function createAdmin() {
  try {
    console.log('🔐 Creating admin user...');
    
    // Admin credentials
    const adminData = {
      name: 'Administrator User Account',
      email: 'admin@quantifyrating.com',
      password: 'AdminPass123!',
      address: '123 Admin Street, Admin City, AC 12345',
      role: 'store', // Admin as store owner with full privileges
      status: 'active',
      storeName: 'Quantify Rating Admin',
      phone: '1234567890'
    };

    // Check if admin already exists
    const existingAdmin = await pool.query('SELECT id FROM users WHERE email = $1', [adminData.email]);
    
    if (existingAdmin.rows.length > 0) {
      console.log('❌ Admin user already exists!');
      console.log('📧 Email:', adminData.email);
      console.log('🔑 Password:', adminData.password);
      process.exit(0);
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);

    // Insert admin user
    const query = `
      INSERT INTO users (name, email, password, address, role, status, store_name, phone, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING id, name, email, role, status, store_name
    `;
    
    const values = [
      adminData.name,
      adminData.email,
      hashedPassword,
      adminData.address,
      adminData.role,
      adminData.status,
      adminData.storeName,
      adminData.phone
    ];

    const result = await pool.query(query, values);
    const admin = result.rows[0];

    console.log('✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 Admin Credentials:');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password:', adminData.password);
    console.log('🏪 Store Name:', admin.store_name);
    console.log('👑 Role:', admin.role);
    console.log('📊 Status:', admin.status);
    console.log('🆔 User ID:', admin.id);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🌐 You can now login at: http://localhost:5173/login');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await pool.end();
  }
}

createAdmin();
