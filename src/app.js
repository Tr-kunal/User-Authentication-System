const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const { errorHandler } = require('./middleware/errorMiddleware');
const apiResponse = require('./utils/apiResponse');

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Security Middlewares
app.use(helmet()); // Set security HTTP headers
app.use(cors()); // Enable unrestricted CORS for local file:// testing
app.use(express.json()); // Body parser
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Cookie parser
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')); // Logger
}

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { success: false, message: 'Too many requests from this IP, please try again later.' }
});
app.use('/api/', limiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Base Route
app.get('/', (req, res) => {
    return apiResponse(res, 200, 'Authentication & User Profile API is running...');
});

// 404 Catcher
app.use((req, res, next) => {
    return apiResponse(res, 404, 'Endpoint Not Found');
});

// Centralized Error Handler
app.use(errorHandler);

module.exports = app;
