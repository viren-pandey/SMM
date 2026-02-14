const { Queue } = require('bullmq');
const config = require('../config/env');
const logger = require('../utils/logger');

let orderQueue = null;

// Only initialize queue if Redis is properly configured
if (config.redis.host && config.redis.host !== 'dummy') {
    try {
        orderQueue = new Queue('orderQueue', {
            connection: {
                host: config.redis.host,
                port: config.redis.port,
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
            logger.error(`Order Queue Error: ${err.message}`);
        });

        logger.info('Order Queue initialized');
    } catch (error) {
        logger.warn(`Failed to initialize Order Queue: ${error.message}`);
    }
} else {
    logger.warn('Redis not configured. Order Queue disabled (Free Mode).');
}

module.exports = orderQueue;
