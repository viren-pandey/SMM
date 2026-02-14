const { Queue } = require('bullmq');
const config = require('../config/env');
const logger = require('../utils/logger');

let orderQueue = null;

try {
    // In development, we can try to initialize but fail gracefully without spamming
    orderQueue = new Queue('orderQueue', {
        connection: {
            host: config.redis.host,
            port: config.redis.port,
            // Fail fast during development to avoid terminal spam
            maxRetriesPerRequest: config.env === 'development' ? 0 : 20,
        },
        defaultJobOptions: {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000,
            },
            removeOnComplete: true,
            removeOnFail: false,
        },
    });

    orderQueue.on('error', (err) => {
        // Silently handle connection errors in dev to keep terminal clean
        if (config.env === 'development') {
            // Log once but don't spam
            return;
        }
        logger.error(`Order Queue Error: ${err.message}`);
    });

    logger.info('Order Queue initialized');
} catch (error) {
    logger.warn(`Failed to initialize Order Queue: ${error.message}`);
}

module.exports = orderQueue;
