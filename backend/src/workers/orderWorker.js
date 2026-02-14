const { Worker } = require('bullmq');
const config = require('../config/env');
const ProviderService = require('../services/ProviderService');
const Order = require('../models/Order');
const OrderService = require('../services/OrderService');
const logger = require('../utils/logger');

let orderWorker = null;

// Only start worker if Redis host is properly configured
if (config.redis.host && config.redis.host !== 'dummy') {
    try {
        orderWorker = new Worker(
            'orderQueue',
            async (job) => {
                const { orderId, provider, serviceData, link, quantity } = job.data;

                logger.info(`Processing order job: ${job.id} for Order: ${orderId}`);

                try {
                    const providerResponse = await ProviderService.placeOrder(provider, {
                        serviceId: serviceData.providerServiceId,
                        link,
                        quantity
                    });

                    if (providerResponse.order) {
                        await Order.findByIdAndUpdate(orderId, {
                            providerOrderId: providerResponse.order,
                            providerResponse: providerResponse,
                            status: 'processing'
                        });
                        logger.info(`Order ${orderId} successfully placed.`);
                    } else if (providerResponse.error) {
                        await OrderService.refundOrder(orderId, `Provider error: ${providerResponse.error}`);
                    }
                } catch (error) {
                    logger.error(`Order worker error: ${error.message}`);
                    throw error;
                }
            },
            {
                connection: {
                    host: config.redis.host,
                    port: config.redis.port,
                    maxRetriesPerRequest: config.env === 'development' ? 0 : 20,
                },
                concurrency: 5,
            }
        );

        orderWorker.on('completed', (job) => {
            logger.info(`Job ${job.id} completed`);
        });

        orderWorker.on('failed', (job, err) => {
            logger.error(`Job ${job.id} failed: ${err.message}`);
        });

        logger.info('Order Worker initialized');
    } catch (error) {
        logger.warn(`Failed to initialize Order Worker: ${error.message}`);
    }
} else {
    logger.warn('Redis not configured. Order Worker disabled (Free Mode).');
}

module.exports = orderWorker;
