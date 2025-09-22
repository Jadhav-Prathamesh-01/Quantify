<div align="center">
  <br />
    <a href="https://github.com/Jadhav-Prathamesh-01/Quantify" target="_blank">
      <img src="../Assets/banner.png" alt="Backend API Banner" width="600">
    </a>
  <br />

  <div>
    <img src="https://img.shields.io/badge/-Node.js-black?style=for-the-badge&logoColor=white&logo=node.js&color=339933" alt="Node.js" />
    <img src="https://img.shields.io/badge/-Express-black?style=for-the-badge&logoColor=white&logo=express&color=000000" alt="Express" />
    <img src="https://img.shields.io/badge/-PostgreSQL-black?style=for-the-badge&logoColor=white&logo=postgresql&color=4169E1" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/-JWT-black?style=for-the-badge&logoColor=white&logo=jsonwebtokens&color=000000" alt="JWT" />
    <img src="https://img.shields.io/badge/-Cloudinary-black?style=for-the-badge&logoColor=white&logo=cloudinary&color=3448C5" alt="Cloudinary" />
    <img src="https://img.shields.io/badge/-bcrypt-black?style=for-the-badge&logoColor=white&logo=bcrypt&color=FF6B6B" alt="bcrypt" />
  </div>

  <h3 align="center">Quantify Backend API</h3>

   <div align="center">
     A robust, scalable backend API for the Quantify business rating platform built with Express.js, PostgreSQL, and modern authentication systems.
    </div>
</div>

##  <a name="table">Table of Contents</a>

1.  [Introduction](#introduction)
2.  [Tech Stack](#tech-stack)
3.  [API Endpoints](#api-endpoints)
4.  [Database Schema](#database-schema)
5.  [Authentication](#authentication)
6.  [Quick Start](#quick-start)
7.  [Configuration](#configuration)
8.  [Deployment](#deployment)

## <a name="introduction"> Introduction</a>

The Quantify Backend API is a comprehensive RESTful API that powers the entire Quantify platform. Built with Express.js and PostgreSQL, it provides secure authentication, role-based access control, and robust data management for businesses, users, and reviews.

### 🚀 Key Features
- **JWT Authentication**: Secure token-based authentication system
- **Role-Based Access Control**: Admin, Owner, and User permission levels
- **RESTful API Design**: Well-structured, intuitive endpoints
- **PostgreSQL Database**: Reliable, scalable data storage
- **Cloudinary Integration**: Cloud-based image and media management
- **Comprehensive Error Handling**: Detailed error responses and logging
- **CORS Configuration**: Secure cross-origin resource sharing

## <a name="tech-stack"> Tech Stack</a>

**Core Technologies:**
- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Fast, unopinionated web framework
- **PostgreSQL** - Robust relational database
- **JavaScript** - Server-side programming language

**Authentication & Security:**
- **JWT (jsonwebtoken)** - JSON Web Token implementation
- **bcryptjs** - Password hashing and security
- **CORS** - Cross-Origin Resource Sharing middleware

**Database & Storage:**
- **PostgreSQL** - Primary database
- **pg** - PostgreSQL client for Node.js
- **Cloudinary** - Cloud-based image and video management

**Development Tools:**
- **Nodemon** - Development server with auto-restart
- **dotenv** - Environment variable management
- **Multer** - File upload handling

## <a name="api-endpoints"> API Endpoints</a>

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/register` | Register a new user | Public |
| POST | `/login` | User login | Public |
| POST | `/logout` | User logout | Private |
| GET | `/profile` | Get user profile | Private |
| PUT | `/profile` | Update user profile | Private |

### Admin Routes (`/api/admin`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/users` | Get all users | Admin |
| GET | `/users/:id` | Get user by ID | Admin |
| PUT | `/users/:id` | Update user | Admin |
| DELETE | `/users/:id` | Delete user | Admin |
| GET | `/stores` | Get all stores | Admin |
| GET | `/reviews` | Get all reviews | Admin |
| PUT | `/reviews/:id` | Update review status | Admin |
| DELETE | `/reviews/:id` | Delete review | Admin |

### Store Routes (`/api/stores`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all stores | Public |
| GET | `/:id` | Get store by ID | Public |
| POST | `/` | Create new store | Owner/Admin |
| PUT | `/:id` | Update store | Owner/Admin |
| DELETE | `/:id` | Delete store | Owner/Admin |
| GET | `/owner/:ownerId` | Get stores by owner | Owner/Admin |

### Review Routes (`/api/reviews`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all reviews | Public |
| GET | `/:id` | Get review by ID | Public |
| POST | `/` | Create new review | User |
| PUT | `/:id` | Update review | User/Admin |
| DELETE | `/:id` | Delete review | User/Admin |
| GET | `/store/:storeId` | Get reviews by store | Public |
| GET | `/user/:userId` | Get reviews by user | User/Admin |

## <a name="database-schema"> Database Schema</a>

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'owner', 'admin')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Stores Table
```sql
CREATE TABLE stores (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  website VARCHAR(255),
  image_url VARCHAR(500),
  owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Reviews Table
```sql
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  flagged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## <a name="authentication"> Authentication</a>

### JWT Token Structure
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "role": "user|owner|admin",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Role-Based Access Control

**User Role:**
- Create and manage own reviews
- View all stores and reviews
- Update own profile

**Owner Role:**
- All User permissions
- Create and manage stores
- View store analytics
- Manage store reviews

**Admin Role:**
- All Owner permissions
- Manage all users
- Manage all stores
- Moderate all reviews
- Access admin analytics

### Authentication Middleware
```javascript
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};
```

## <a name="quick-start"> Quick Start</a>

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Jadhav-Prathamesh-01/Quantify.git
cd Quantify/backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Set up the database:**
```bash
# Create PostgreSQL database
createdb quantify_db

# Run database setup
node create-reviews-table.js
```

5. **Start the development server:**
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

### Default Login Credentials

After setting up the database, you can use these test credentials:

- **Admin**: admin@quantifyrating.com / Admin@123
- **Store Owner**: storeowner@quantifyrating.com / Store@123
- **User**: user@quantifyrating.com / User@123

## <a name="configuration"> Configuration</a>

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/quantify_db?schema=public"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="24h"

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3001

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Production URLs
FRONTEND_URL_PROD=https://your-frontend-domain.com
BACKEND_URL_PROD=https://your-backend-domain.com
```

### Database Configuration

The application uses PostgreSQL with the following connection settings:

```javascript
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'quantify_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};
```

## <a name="deployment"> Deployment</a>

### Render Deployment

1. **Connect your GitHub repository to Render**
2. **Create a new Web Service**
3. **Configure build settings:**
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node.js

4. **Add environment variables:**
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: Your JWT secret key
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: Your Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret

### Docker Deployment

Create a `Dockerfile` in the backend directory:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t quantify-backend .
docker run -p 3001:3001 quantify-backend
```

### Environment-Specific Configuration

**Development:**
- Hot reloading with nodemon
- Detailed error messages
- CORS enabled for localhost

**Production:**
- Optimized performance
- Error logging
- CORS configured for production domains
- SSL/TLS encryption

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": "Additional error details"
  }
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Tokens**: Secure authentication tokens
- **CORS Protection**: Configurable cross-origin policies
- **Input Validation**: Request data sanitization
- **SQL Injection Prevention**: Parameterized queries
- **Rate Limiting**: API abuse prevention (configurable)

## Monitoring and Logging

- **Error Logging**: Comprehensive error tracking
- **Request Logging**: API request monitoring
- **Performance Metrics**: Response time tracking
- **Health Checks**: API status monitoring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Built with ❤️ using Node.js and Express.js</p>
  <p>
    <a href="#introduction">🔝 Back to top</a>
  </p>
</div>