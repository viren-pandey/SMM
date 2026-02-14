const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('./middleware/sanitize');
const hpp = require('hpp');
const config = require('./config/env');
const logger = require('./utils/logger');
const connectDB = require('./config/db');
const seedAdmin = require('./config/seeder');
const errorHandler = require('./middleware/error');
const { apiLimiter } = require('./middleware/rateLimiter');

// Background processes
require('./workers/orderWorker');
const syncServiceRates = require('./jobs/rateSyncJob');

// Connect to database
connectDB().then(async () => {
    // Seed admin
    await seedAdmin();
    // Start initial rate sync
    syncServiceRates();
});

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: [config.frontendUrl, 'http://localhost:3000', 'http://localhost:3001'],
        methods: ['GET', 'POST']
    }
});

// 1. Logging
if (config.env === 'development') {
    app.use(morgan('dev'));
}

// 2. Security Headers & CORS (Early for preflight)
app.use(helmet());
app.use(cors({
    origin: [config.frontendUrl, 'http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));

// 3. Body Parsing
app.use(express.json());
app.use(cookieParser());

// 4. Data Sanitization (Immediately after body parsing)
app.use(mongoSanitize);

// 5. Parameter Pollution Prevention
app.use(hpp());

// 6. Rate Limiting (After basic sanitization)
app.use(apiLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        env: config.env
    });
});

// Route files
const auth = require('./routes/auth');
const providers = require('./routes/providers');
const services = require('./routes/services');
const orders = require('./routes/orders');
const payments = require('./routes/payments');
const blogs = require('./routes/blogs');

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/providers', providers);
app.use('/api/v1/services', services);
app.use('/api/v1/orders', orders);
app.use('/api/v1/payments', payments);
app.use('/api/v1/blogs', blogs);
app.use('/api/v1/analytics', require('./routes/analytics'));
app.use('/api/v1/seo', require('./routes/seo'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/tickets', require('./routes/tickets'));
app.use('/api/v1/payment-providers', require('./routes/paymentProviders'));

app.get('/', (req, res) => {
    res.send('SMM Panel API is running...');
});

// Error handling middleware
app.use(errorHandler);

// Attach IO to request
app.use((req, res, next) => {
    req.io = io;
    next();
});

const PORT = config.port || 5000;

server.listen(
    PORT,
    () => logger.info(`Server running in ${config.env} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    logger.error(`Unhandled Rejection at: ${promise}, reason: ${err}`);
    // Close server & exit process
    // server.close(() => process.exit(1));
});

// Graceful shutdown
const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info('Server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error) => {
    logger.error(error);
    exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
        server.close();
    }
});

