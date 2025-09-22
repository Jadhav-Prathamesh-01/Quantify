<div align="center">
  <br />
    <a href="https://github.com/Jadhav-Prathamesh-01/Quantify" target="_blank">
      <img src="Assets/banner.png" alt="Project Banner" width="800">
    </a>
  <br />

  <div>
    <img src="https://img.shields.io/badge/-React-black?style=for-the-badge&logoColor=white&logo=react&color=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/-Node.js-black?style=for-the-badge&logoColor=white&logo=node.js&color=339933" alt="Node.js" />
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="TypeScript" />
    <img src="https://img.shields.io/badge/-PostgreSQL-black?style=for-the-badge&logoColor=white&logo=postgresql&color=4169E1" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/-Express-black?style=for-the-badge&logoColor=white&logo=express&color=000000" alt="Express" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="TailwindCSS" />
    <img src="https://img.shields.io/badge/-GSAP-black?style=for-the-badge&logoColor=white&logo=gsap&color=88CE02" alt="GSAP" />
  </div>

  <h3 align="center">Quantify - Advanced Business Rating & Review Management Platform</h3>

   <div align="center">
     A modern, full-stack business management platform featuring scroll-triggered animations, multi-role dashboards, and comprehensive review management system built with React Router v7, Express.js, and PostgreSQL.
    </div>
</div>

##  <a name="table">Table of Contents</a>

1.  [Introduction](#introduction)
2.  [Tech Stack](#tech-stack)
3.  [Features](#features)
4.  [Quick Start](#quick-start)
5.  [Project Structure](#project-structure)
6.  [Screenshots](#screenshots)
7.  [Deployment](#deployment)
8.  [Contributing](#contributing)

## <a name="introduction"> Introduction</a>

Quantify is a production-grade business rating and review management platform that revolutionizes how businesses interact with customer feedback. Built with cutting-edge web technologies, it features stunning scroll-triggered animations, comprehensive role-based dashboards, and an intuitive user experience.

The platform provides three distinct user experiences:
- **Admin Panel**: Complete system oversight with user management and business analytics
- **Owner Dashboard**: Business management tools with performance insights and review monitoring  
- **User Portal**: Customer-facing interface for business discovery and review submission

### 🎬 Key Highlights
- **Scroll-Triggered Animations**: GSAP-powered hero section with frame-by-frame animation
- **Modern UI/UX**: Responsive design with smooth transitions and loading states
- **Real-time Data**: Live updates and interactive dashboards
- **Secure Authentication**: JWT-based authentication with role-based access control
- **Cloud Integration**: Cloudinary for image management and storage

## <a name="tech-stack"> Tech Stack</a>

**Frontend:**
- **React Router v7** - Modern routing with SSR capabilities
- **TypeScript** - Full type safety and enhanced developer experience
- **Tailwind CSS v4** - Utility-first CSS framework
- **GSAP** - Professional-grade animations and scroll triggers
- **Lottie React** - Smooth animations and micro-interactions
- **Vite** - Lightning-fast build tool and dev server

**Backend:**
- **Express.js** - Fast, unopinionated web framework
- **Node.js** - JavaScript runtime for server-side development
- **PostgreSQL** - Robust relational database
- **JWT** - Secure authentication and authorization
- **Cloudinary** - Cloud-based image and video management
- **bcryptjs** - Password hashing and security

**Development Tools:**
- **TypeScript** - Static type checking
- **ESLint & Prettier** - Code quality and formatting
- **Nodemon** - Development server with auto-restart
- **Docker** - Containerization support

## <a name="features"> Features</a>

### 🎨 Frontend Features

**Scroll-Triggered Animations**
- **Hero Section**: GSAP-powered frame-by-frame animation with scroll pinning
- **Smooth Transitions**: Fluid animations between sections
- **Loading States**: Elegant skeleton screens and loading indicators
- **Interactive Elements**: Hover effects and micro-interactions

**Modern UI/UX**
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component Library**: Reusable, well-structured React components
- **Accessibility**: WCAG-compliant design patterns
- **Performance**: Optimized bundle size and lazy loading

**User Experience**
- **Multi-Role Dashboards**: Tailored interfaces for different user types
- **Real-time Updates**: Live data synchronization
- **Toast Notifications**: User feedback and status updates
- **Form Validation**: Client-side and server-side validation

### 🔧 Backend Features

**Authentication & Security**
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Admin, Owner, and User roles
- **Password Security**: bcrypt hashing with salt rounds
- **CORS Configuration**: Secure cross-origin resource sharing

**API Architecture**
- **RESTful APIs**: Well-structured endpoint design
- **Error Handling**: Comprehensive error management
- **Data Validation**: Input sanitization and validation
- **Rate Limiting**: API protection and abuse prevention

**Database Management**
- **PostgreSQL**: Reliable relational database
- **Optimized Queries**: Efficient data retrieval
- **Data Relationships**: Proper foreign key constraints
- **Migration Support**: Database schema versioning

### 📊 Business Features

**Review Management**
- **Rating System**: 1-5 star rating with comments
- **Review Moderation**: Admin tools for content management
- **Analytics Dashboard**: Business performance insights
- **Search & Filter**: Advanced business discovery

**Store Management**
- **CRUD Operations**: Complete store lifecycle management
- **Image Upload**: Cloudinary integration for media
- **Business Profiles**: Comprehensive store information
- **Performance Metrics**: Revenue and customer analytics

## <a name="quick-start">🚀 Quick Start</a>

Follow these steps to set up the project locally on your machine.

### Prerequisites

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en) (v18 or higher)
- [npm](https://www.npmjs.com/) (Node Package Manager)
- [PostgreSQL](https://www.postgresql.org/) (Database)

### Cloning the Repository

```bash
git clone https://github.com/Jadhav-Prathamesh-01/Quantify.git
cd Quantify
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install backend dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a new file named `.env` in the backend directory and add the following:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/quantify_db?schema=public"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Server Configuration
PORT=3001

# CORS Configuration
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3001

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Production URLs (update these for production deployment)
# FRONTEND_URL_PROD=https://your-frontend-domain.com
# BACKEND_URL_PROD=https://your-backend-domain.com
```

4. Set up the database:
```bash
# Create the database (run in PostgreSQL)
createdb quantify_db

# Run the database setup script
node create-reviews-table.js
```

5. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Open a new terminal and navigate to the project root:
```bash
cd Quantify
```

2. Install frontend dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm run dev
```

### Access the Application

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3001](http://localhost:3001)

### Default Login Credentials

After setting up the database, you can create accounts through the registration system or use these test credentials:

- **Admin**: admin@quantifyrating.com / Admin@123
- **Store Owner**: storeowner@quantifyrating.com / Store@123
- **User**: user@quantifyrating.com / User@123

## <a name="project-structure"> Project Structure</a>

```
Quantify/
├── app/                          # Frontend React Router v7 app
│   ├── components/              # Reusable React components
│   │   ├── Hero.tsx            # GSAP-powered hero section
│   │   ├── Navbar.tsx          # Navigation component
│   │   ├── AdminPanel.tsx      # Admin dashboard
│   │   ├── StoreManagement.tsx # Store management interface
│   │   └── ...                 # Other components
│   ├── routes/                 # Route components
│   │   ├── home.tsx           # Homepage route
│   │   ├── login.tsx          # Authentication route
│   │   ├── profile.tsx        # User profile route
│   │   └── ...                # Other routes
│   ├── config/                # Configuration files
│   │   └── api.ts            # API configuration
│   └── root.tsx              # Root component
├── backend/                    # Express.js backend
│   ├── controllers/           # Route controllers
│   │   ├── authController.js  # Authentication logic
│   │   ├── adminController.js # Admin operations
│   │   ├── storeController.js # Store management
│   │   └── reviewController.js # Review management
│   ├── models/               # Database models
│   │   ├── User.js          # User model
│   │   ├── Store.js         # Store model
│   │   └── Review.js        # Review model
│   ├── routes/              # API routes
│   │   ├── auth.js         # Authentication routes
│   │   ├── admin.js        # Admin routes
│   │   ├── stores.js       # Store routes
│   │   └── reviews.js      # Review routes
│   ├── middleware/          # Custom middleware
│   │   └── auth.js         # JWT authentication
│   ├── config/             # Configuration files
│   │   ├── database.js     # Database configuration
│   │   └── cloudinary.js   # Cloudinary setup
│   └── server.js           # Main server file
├── public/                  # Static assets
│   ├── animations/         # Lottie animation files
│   ├── frames/            # Hero section frame images
│   └── ...               # Other static files
├── Assets/                # Project assets and screenshots
│   ├── banner.png        # Project banner
│   ├── homepage.png      # Homepage screenshot
│   ├── admin.png         # Admin dashboard screenshot
│   ├── owner.png         # Owner dashboard screenshot
│   └── user.png          # User portal screenshot
├── package.json          # Frontend dependencies
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## <a name="screenshots"> Screenshots</a>

### Main Homepage - Landing Page
<div align="center">
  <img src="Assets/homepage.png" alt="Quantify Homepage" width="800">
  <p><em>Welcome to Quantify - Modern business management platform with stunning scroll animations</em></p>
</div>

### Admin Dashboard
<div align="center">
  <img src="Assets/admin.png" alt="Admin Dashboard" width="800">
  <p><em>Comprehensive admin panel with user management, analytics, and system oversight</em></p>
</div>

### Owner Dashboard  
<div align="center">
  <img src="Assets/owner.png" alt="Owner Dashboard" width="800">
  <p><em>Business owner interface with performance metrics and review management</em></p>
</div>

### User Portal
<div align="center">
  <img src="Assets/user.png" alt="User Portal" width="800">
  <p><em>Customer-facing portal for business discovery and review submission</em></p>
</div>

## <a name="deployment"> Deployment</a>

### Backend Deployment (Render)

1. **Create a new Web Service on Render**
2. **Connect your GitHub repository**
3. **Configure Build Settings:**
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Environment**: Node.js

4. **Add Environment Variables on Render:**
```env
DATABASE_URL=your_postgresql_url_here
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=10000
NODE_ENV=production
FRONTEND_URL_PROD=https://your-app-name.vercel.app
BACKEND_URL_PROD=https://your-backend-name.onrender.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend Deployment (Vercel)

1. **Create a new project on Vercel**
2. **Connect your GitHub repository**
3. **Configure Build Settings:**
   - **Framework Preset**: React
   - **Build Command**: `npm run build`
   - **Output Directory**: `build/client`
   - **Install Command**: `npm install`

4. **Add Environment Variables on Vercel:**
```env
VITE_API_BASE_URL=https://your-backend-name.onrender.com
```

### Docker Deployment

The project includes a Dockerfile for containerized deployment:

```bash
# Build the Docker image
docker build -t quantify-app .

# Run the container
docker run -p 3000:3000 quantify-app
```

## Environment Configuration

### Backend Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection string | - | ✅ |
| `JWT_SECRET` | Secret key for JWT tokens | - | ✅ |
| `PORT` | Server port | 3001 | ❌ |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:5173 | ❌ |
| `BACKEND_URL` | Backend URL for CORS | http://localhost:3001 | ❌ |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | - | ✅ |
| `CLOUDINARY_API_KEY` | Cloudinary API key | - | ✅ |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | - | ✅ |

### Frontend Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_BASE_URL` | Backend API base URL | http://localhost:3001 | ❌ |

## <a name="contributing"> Contributing</a>

We welcome contributions to Quantify! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add some amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## Key Learning Outcomes

Building this project provides hands-on experience with:

- **Modern React Development**: React Router v7, TypeScript, and modern hooks
- **Advanced Animations**: GSAP ScrollTrigger and Lottie animations
- **Full-Stack Architecture**: Express.js backend with PostgreSQL database
- **Authentication Systems**: JWT implementation with role-based access control
- **Cloud Integration**: Cloudinary for media management
- **Modern CSS**: Tailwind CSS v4 with utility-first approach
- **API Development**: RESTful API design with comprehensive error handling
- **Database Design**: PostgreSQL with optimized queries and relationships
- **Deployment**: Production deployment with Vercel and Render

## Future Enhancements

- **Real-time Features**: WebSocket integration for live updates
- **Mobile App**: React Native mobile application
- **Advanced Analytics**: Machine learning insights and predictions
- **Payment Integration**: Stripe integration for premium features
- **Multi-language Support**: Internationalization (i18n)
- **Advanced Search**: Elasticsearch integration
- **Email Notifications**: Automated email system
- **API Documentation**: Swagger/OpenAPI documentation

---

<div align="center">
  <p>Built with ❤️ using modern web technologies</p>
  <p>
    <a href="#introduction">🔝 Back to top</a>
  </p>
</div>