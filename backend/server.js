const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
require('dotenv').config({ path: './config.env' })

const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')
const productRoutes = require('./routes/products')
const categoryRoutes = require('./routes/categories')
const supplierRoutes = require('./routes/suppliers')
const inventoryRoutes = require('./routes/inventory')
const reportRoutes = require('./routes/reports')

const app = express()
const PORT = process.env.PORT || 5000

// Security middleware
app.use(helmet())

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'https://my-inventory-project-9dccf.web.app',
  'https://my-inventory-project-9dccf.firebaseapp.com',
  'https://v0-admin-inventory-system-3y9awla45-khod-eds-projects.vercel.app',
  // Add your production frontend domain here if different
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' 
    ? parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000  // 1000 requests per window in development
    : parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,  // 100 requests per window in production
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/api/', limiter)

// Compression middleware
app.use(compression())

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Inventory Management API is running - GitHub Actions Test',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  })
})

// Add a root route for clarity
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Inventory Management API. See /api/health for status.'
  });
});

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/suppliers', supplierRoutes)
app.use('/api/inventory', inventoryRoutes)
app.use('/api/reports', reportRoutes)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'
  
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

// Remove the app.listen block for Vercel compatibility
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`)
//   console.log(`📊 Environment: ${process.env.NODE_ENV}`)
//   console.log(`🔗 Health check: http://localhost:${PORT}/api/health`)
// });

module.exports = app; 