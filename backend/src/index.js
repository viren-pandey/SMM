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
    await seedAdmin();
    syncServiceRates();
});

const app = express();
const server = http.createServer(app);

/* =========================
   ✅ PROPER CORS CONFIG
========================= */

const allowedOrigins = [
    "https://cheapestsmmpanel.vercel.app",
    "http://localhost:3000",
    "http://localhost:3001"
];

app.use(helmet());

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));

app.options("*", cors({
    origin: allowedOrigins,
    credentials: true
}));

/* ========================= */

const io = socketio(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Logging
if (config.env === 'development') {
    app.use(morgan('dev'));
}

// Body parsing
app.use(express.json());
app.use(cookieParser());

// Security middlewares
app.use(mongoSanitize);
app.use(hpp);
app.use(apiLimiter);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        env: config.env
    });
});

// Routes
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/providers', require('./routes/providers'));
app.use('/api/v1/services', require('./routes/services'));
app.use('/api/v1/orders', require('./routes/orders'));
app.use('/api/v1/payments', require('./routes/payments'));
app.use('/api/v1/blogs', require('./routes/blogs'));
app.use('/api/v1/analytics', require('./routes/analytics'));
app.use('/api/v1/seo', require('./routes/seo'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/tickets', require('./routes/tickets'));
app.use('/api/v1/payment-providers', require('./routes/paymentProviders'));

app.get('/', (req, res) => {
    res.send('SMM Panel API is running...');
});

// Error handler
app.use(errorHandler);

const PORT = config.port || 5000;

server.listen(PORT, () =>
    logger.info(`Server running in ${config.env} mode on port ${PORT}`)
);

// Process handlers
process.on('unhandledRejection', (err) => {
    logger.error(`Unhandled Rejection: ${err.message}`);
});

process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.message}`);
});
