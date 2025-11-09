# ThinkPlus Education Technologies - Full-Stack EdTech Platform

A comprehensive full-stack web application for online education, specifically designed for IPMAT, CAT, and CLAT exam preparation. Built with modern technologies and best practices.

![ThinkPlus](https://img.shields.io/badge/ThinkPlus-Education-blue)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-18-339933)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248)

## 🚀 Features

### Core Features
- **Landing Page**: Modern, animated hero section with course showcase, testimonials, FAQ, and statistics
- **Authentication**: Secure authentication using Clerk with role-based access control
- **Student Dashboard**: Personalized dashboard with enrolled courses, progress tracking, and analytics
- **Course Management**: Complete course catalog with filters, detailed course pages, and enrollment
- **Learning Portal**: Video player, PDF viewer, progress tracking, and module completion
- **Admin Panel**: Course and user management, analytics dashboard
- **Progress Tracking**: Real-time progress tracking with visual charts and analytics
- **Test Module**: Quiz/test functionality with timer and results
- **Announcements**: System-wide announcements with targeting

### Technical Features
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI/UX**: Beautiful animations using Framer Motion, glassmorphism effects, gradient backgrounds
- **Performance Optimized**: Code splitting, lazy loading, optimized images
- **Security**: Rate limiting, CORS, Helmet.js, input validation
- **Docker Support**: Easy deployment with Docker Compose

## 🛠️ Tech Stack

### Frontend
- **React.js 18** with Vite
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Clerk** for authentication
- **Axios** for API calls
- **React Hook Form** + **Zod** for form validation
- **Lucide React** for icons
- **Recharts** for data visualization
- **React Hot Toast** for notifications
- **React Player** for video playback

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **Clerk SDK** for authentication
- **Helmet** for security
- **Express Rate Limit** for rate limiting
- **Morgan** for logging
- **CORS** for cross-origin requests

### DevOps
- **Docker** & **Docker Compose** for containerization
- **MongoDB** container for database

## 📁 Project Structure

```
thinkplus-edtech/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── ui/         # UI components (Button, Input, Card, etc.)
│   │   │   └── layout/     # Layout components (Navbar, Footer)
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service functions
│   │   ├── utils/          # Utility functions
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.js
├── server/                 # Express backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # MongoDB models
│   │   ├── middleware/     # Custom middleware
│   │   ├── config/         # Configuration files
│   │   ├── scripts/        # Utility scripts (seed, etc.)
│   │   └── server.js       # Server entry point
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml      # Docker Compose configuration
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose (for containerized setup)
- MongoDB (if not using Docker)
- Clerk account (for authentication)

### Option 1: Docker Setup (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd thinkplus-edtech
   ```

2. **Set up environment variables**
   
   Create `.env` files in both `client/` and `server/` directories:
   
   **client/.env:**
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```
   
   **server/.env:**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://mongo:27017/thinkplus
   CLERK_SECRET_KEY=your_clerk_secret_key
   CLERK_WEBHOOK_SECRET=your_webhook_secret
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret
   CORS_ORIGIN=http://localhost:5173
   ```

3. **Start with Docker Compose**
   ```bash
   docker-compose up --build
   ```

   This will start:
   - Frontend on http://localhost:5173
   - Backend API on http://localhost:5000
   - MongoDB on localhost:27017

4. **Seed the database** (optional)
   ```bash
   docker-compose exec server npm run seed
   ```

### Option 2: Local Development Setup

1. **Install dependencies**
   ```bash
   # Install client dependencies
   cd client
   npm install
   
   # Install server dependencies
   cd ../server
   npm install
   ```

2. **Set up MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Update `MONGODB_URI` in `server/.env`

3. **Set up Clerk Authentication**
   - Create a Clerk account at https://clerk.com
   - Create a new application
   - Copy the publishable key and secret key
   - Add them to your `.env` files

4. **Start the development servers**
   
   **Terminal 1 - Backend:**
   ```bash
   cd server
   npm run dev
   ```
   
   **Terminal 2 - Frontend:**
   ```bash
   cd client
   npm run dev
   ```

5. **Seed the database** (optional)
   ```bash
   cd server
   npm run seed
   ```

## 📚 API Documentation

### Authentication Routes
- `POST /api/auth/webhook` - Clerk webhook for user sync
- `POST /api/auth/sync` - Sync Clerk user with MongoDB
- `GET /api/auth/user/:clerkId` - Get user by Clerk ID

### Course Routes
- `GET /api/courses` - Get all courses (with filters)
- `GET /api/courses/:id` - Get single course
- `POST /api/courses` - Create course (admin only)
- `PUT /api/courses/:id` - Update course (admin only)
- `DELETE /api/courses/:id` - Delete course (admin only)
- `POST /api/courses/:id/enroll` - Enroll in course
- `GET /api/courses/:id/content` - Get course content (enrolled users)
- `POST /api/courses/:id/review` - Add course review
- `GET /api/courses/enrolled/:userId` - Get enrolled courses

### User Routes
- `GET /api/users/profile/:clerkId` - Get user profile
- `PUT /api/users/profile/:clerkId` - Update user profile
- `GET /api/users/:id/progress` - Get user progress
- `GET /api/users/:id/dashboard` - Get dashboard data
- `GET /api/users` - Get all users (admin only)
- `PUT /api/users/:id/role` - Update user role (admin only)

### Progress Routes
- `GET /api/progress/:userId/:courseId` - Get progress
- `POST /api/progress/:userId/:courseId/update` - Update progress
- `POST /api/progress/:userId/:courseId/video-complete` - Mark video complete
- `POST /api/progress/:userId/:courseId/module-complete` - Mark module complete

### Test Routes
- `GET /api/tests/course/:courseId` - Get course tests
- `GET /api/tests/:id` - Get single test
- `POST /api/tests` - Create test (admin only)
- `PUT /api/tests/:id` - Update test (admin only)
- `DELETE /api/tests/:id` - Delete test (admin only)
- `POST /api/tests/:id/submit` - Submit test
- `GET /api/tests/results/:userId/:testId` - Get test results
- `GET /api/tests/analytics/:testId` - Get test analytics (admin only)

### Announcement Routes
- `GET /api/announcements` - Get active announcements
- `GET /api/announcements/:id` - Get single announcement
- `POST /api/announcements` - Create announcement (admin only)
- `PUT /api/announcements/:id` - Update announcement (admin only)
- `DELETE /api/announcements/:id` - Delete announcement (admin only)

## 🎨 Design System

### Color Palette
- **Primary**: #667eea (Purple/Blue gradient start)
- **Secondary**: #764ba2 (Deep Purple gradient end)
- **Accent**: #f093fb (Light Pink)
- **Success**: #10b981 (Green)
- **Warning**: #f59e0b (Orange)
- **Error**: #ef4444 (Red)
- **Background**: #f8fafc (Light gray)
- **Card Background**: #ffffff (White)
- **Text Primary**: #1a202c (Dark)
- **Text Secondary**: #718096 (Gray)

### Typography
- **Headings**: Bold, gradient text for hero sections
- **Body**: Regular weight, readable sizes
- **Responsive**: Scales appropriately on all devices

### Components
- Reusable UI components with consistent styling
- Smooth animations using Framer Motion
- Glassmorphism effects for cards and modals
- Gradient backgrounds for CTAs and hero sections

## 🔐 Authentication & Authorization

The application uses Clerk for authentication with the following roles:
- **Student**: Default role, can enroll in courses and track progress
- **Instructor**: Can create and manage course content
- **Admin**: Full access to all features including user management

### Setting Up Clerk
1. Create a Clerk account
2. Create a new application
3. Configure authentication methods
4. Set up webhooks (optional but recommended)
5. Copy keys to `.env` files

## 📊 Database Models

### User
- clerkId, email, name, role, enrolledCourses, profileImage, phoneNumber

### Course
- title, description, examType, duration, price, discountedPrice, thumbnail, curriculum, instructor, videos, materials, enrolledCount, rating, reviews, isPublished

### Progress
- userId, courseId, completedModules, completedVideos, quizScores, overallProgress, lastAccessed

### Test
- courseId, title, description, questions, duration, totalMarks, passingMarks, attempts, isActive

### Announcement
- title, content, targetAudience, priority, isActive, createdBy, expiresAt

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Course browsing and filtering
- [ ] Course enrollment
- [ ] Video playback
- [ ] Progress tracking
- [ ] Test submission
- [ ] Admin panel functionality
- [ ] Responsive design on mobile/tablet/desktop

## 🚢 Deployment

### Production Build

**Frontend:**
```bash
cd client
npm run build
```

**Backend:**
```bash
cd server
npm start
```

### Environment Variables
Make sure to set all environment variables in your production environment:
- Update `VITE_API_URL` to your production API URL
- Set production MongoDB URI
- Configure Clerk production keys
- Set `NODE_ENV=production`

### Docker Production
```bash
docker-compose -f docker-compose.prod.yml up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- ThinkPlus Education Technologies

## 🙏 Acknowledgments

- Clerk for authentication
- TailwindCSS for styling
- Framer Motion for animations
- All the open-source libraries used in this project

## 📞 Support

For support, email info@thinkplus.com or create an issue in the repository.

## 🎯 Roadmap

- [ ] Payment integration (Razorpay/Stripe)
- [ ] Live class integration
- [ ] Mobile app
- [ ] Certificate generation
- [ ] Referral program
- [ ] Gamification features
- [ ] Advanced analytics
- [ ] Email notifications
- [ ] Discussion forums
- [ ] Study groups

---

**Built with ❤️ by ThinkPlus Education Technologies**




