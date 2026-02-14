const { Worker } = require('bullmq');
const config = require('../config/env');
const ProviderService = require('../services/ProviderService');
const Order = require('../models/Order');
const OrderService = require('../services/OrderService');
const logger = require('../utils/logger');

let orderWorker = null;

try {
    orderWorker = new Worker('orderQueue', async (job) => {
        const { orderId, provider, serviceData, link, quantity } = job.data;

        logger.info(`Processing order job: ${job.id} for Order: ${orderId}`);

        try {
            // 1. Send order to external provider API
            const providerResponse = await ProviderService.placeOrder(provider, {
                serviceId: serviceData.providerServiceId,
                link,
                quantity
            });

            // 2. Update order with provider response
            if (providerResponse.order) {
                await Order.findByIdAndUpdate(orderId, {
                    providerOrderId: providerResponse.order,
                    providerResponse: providerResponse,
                    status: 'processing'
                });
                logger.info(`Order ${orderId} successfully placed with provider. Provider ID: ${providerResponse.order}`);
            } else if (providerResponse.error) {
                // Provider returned an error - refund user
                logger.warn(`Provider returned error for Order ${orderId}: ${providerResponse.error}`);
                await OrderService.refundOrder(orderId, `Provider error: ${providerResponse.error}`);
            }
        } catch (error) {
            logger.error(`Order worker error for job ${job.id}: ${error.message}`);
            // If it's a transient error (e.g. network), we can let BullMQ retry based on job options
            throw error;
        }
    }, {
        connection: {
            host: config.redis.host,
            port: config.redis.port,
            maxRetriesPerRequest: config.env === 'development' ? 0 : 20,
        },
        concurrency: 5, // Process 5 orders concurrently
    });

    orderWorker.on('completed', (job) => {
        logger.info(`Job ${job.id} has completed!`);
    });

    orderWorker.on('failed', (job, err) => {
        logger.error(`Job ${job.id} has failed with ${err.message}`);
    });

    orderWorker.on('error', (err) => {
        // Silently handle connection errors in dev
        if (config.env !== 'development') {
            logger.error(`Order Worker Connection Error: ${err.message}`);
        }
    });

    logger.info('Order Worker initialized');
} catch (error) {
    logger.warn(`Failed to initialize Order Worker: ${error.message}`);
}

module.exports = orderWorker;
