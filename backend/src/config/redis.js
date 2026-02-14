const Redis = require('ioredis');
const config = require('./env');
const logger = require('../utils/logger');

const redisOptions = {
    host: config.redis.host,
    port: config.redis.port,
    maxRetriesPerRequest: null, // Required by BullMQ
};

const redis = new Redis(redisOptions);

redis.on('connect', () => logger.info('Redis connected'));
redis.on('error', (err) => logger.error(`Redis connection error: ${err.message}`));

module.exports = redis;
