const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const colors = require('colors');

// Import configuration and routes
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',   // Create React App
    'http://localhost:5173',   // Vite dev server
    'http://localhost:4173',   // Vite preview
    'http://localhost:5000'    // Your existing API
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 200
}));

// Handle preflight requests - FIXED VERSION
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', true);
    return res.sendStatus(200);
  }
  next();
});

// Routes

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'VittaVardhan Authentication Server',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      profile: 'GET /api/auth/me',
      logout: 'POST /api/auth/logout',
      userProfile: 'GET /api/profile',
      updateProfile: 'PUT /api/profile',
      completeProfile: 'POST /api/profile/complete' // Add this line
    }
  });
});


app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'VittaVardhan Authentication Server',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      profile: 'GET /api/auth/me',
      logout: 'POST /api/auth/logout',
      userProfile: 'GET /api/profile', // Add this
      updateProfile: 'PUT /api/profile' // Add this
    }
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'VittaVardhan Auth API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Mount auth routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Handle 404 routes - REMOVED PROBLEMATIC WILDCARD
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server
const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`🔐 VittaVardhan Auth Server running on port ${PORT}`.yellow.bold);
  console.log(`🔐 Health check: http://localhost:${PORT}/api/health`.green);
  console.log(`🔐 Environment: ${process.env.NODE_ENV || 'development'}`.blue);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`.red);
  console.log('Shutting down due to uncaught exception');
  process.exit(1);
});

module.exports = app;
