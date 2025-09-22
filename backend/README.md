# Quantify Rating Backend

Express.js backend API for the Quantify Rating application with PostgreSQL database integration.

## Features

- User registration and authentication
- Password hashing with bcrypt
- JWT token-based authentication
- PostgreSQL database with Neon
- Input validation
- CORS enabled for frontend integration

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the backend directory with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://neondb_owner:npg_H5mWuMqhf2co@ep-shiny-surf-a1v5vnsh-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=3001
NODE_ENV=development
```

### 3. Database Setup

The application will automatically create the `users` table on startup with the following schema:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  address TEXT,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'store')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  store_name VARCHAR(100),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Start the Server

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will start on port 3001 by default.

## API Endpoints

### Authentication

- `POST /api/register` - Register a new user
- `POST /api/login` - Login user
- `GET /api/profile` - Get user profile (requires authentication)

### Health Check

- `GET /health` - Server health check

## Validation Rules

### Registration
- **Name**: 20-60 characters
- **Email**: Valid email format
- **Password**: 8-16 characters, at least one uppercase letter and one special character
- **Address**: Maximum 400 characters
- **Phone**: Required for registration
- **Store Name**: Required for business owners

### Login
- **Email**: Required
- **Password**: Required

## Security Features

- Password hashing with bcrypt (12 salt rounds)
- JWT tokens for authentication
- CORS protection
- Input validation
- SQL injection protection with parameterized queries

## Frontend Integration

The backend is configured to work with the React frontend running on `http://localhost:5173`. Make sure both servers are running:

1. Backend: `http://localhost:3001`
2. Frontend: `http://localhost:5173`
