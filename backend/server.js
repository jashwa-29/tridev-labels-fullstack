const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

// Load env vars
dotenv.config();

// Import DB connection
const connectDB = require('./config/db');

// Import Error Handler
const errorHandler = require('./middleware/errorHandler');

// Connect to database
connectDB();

// Route files
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const specialsPromotionRoutes = require('./routes/specialsPromotionRoutes');
const quoteRoutes = require('./routes/Quote.routes');
const serviceRoutes = require('./routes/Service.routes');
const testimonialRoutes = require('./routes/testimonialRoutes');

const app = express();   

// 1. CORS - MUST BE FIRST to handle preflight and headers
const allowedOrigins = [
  'https://www.aestheticstudio.in',   
  'http://localhost:3000',
  'http://localhost:4000',
  'http://localhost:4001',
  'https://adminpanel.aestheticstudio.in',
  'https://tridev-labels.vercel.app',
  'http://localhost:5173', 
];    

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));   

// 2. Body Parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));  

// 3. Security Headers      
app.use(helmet({
  crossOriginResourcePolicy: false,
  crossOriginEmbedderPolicy: false,
})); 
    
// 4. Rate limiting - DISABLED
// const limiter = rateLimit({
//   windowMs: 10 * 60 * 1000, // 10 mins
//   max: 1000 
// });
// app.use('/api', limiter);
        
// 5. Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));    
}  

// 6. Sanitization
// app.use(mongoSanitize()); // Disabled due to Express 5 incompatibility
// app.use(xss()); // Disabled due to Express 5 incompatibility
// app.use(hpp()); // Disabled due to Express 5 incompatibility

// Set static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/specialsPromotions', specialsPromotionRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/testimonials', testimonialRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('<h2>🚀 Tridev Labels API is running successfully!</h2>');
});

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'production'} mode on port ${PORT}`.yellow.bold);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});   
