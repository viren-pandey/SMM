const Order = require('../models/Order');
const User = require('../models/User');
const Service = require('../models/Service');
const Transaction = require('../models/Transaction');
const orderQueue = require('../queues/orderQueue');
const ProviderService = require('./ProviderService');
const ErrorResponse = require('../utils/errorResponse');
const logger = require('../utils/logger');
const mongoose = require('mongoose');

class OrderService {
    /**
     * Place an order
     * @param {string} userId - ID of the user placing the order
     * @param {Object} orderData - { serviceId, link, quantity }
     */
    static async placeOrder(userId, orderData) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const { serviceId, link, quantity } = orderData;

            // 1. Validate service
            const service = await Service.findById(serviceId).populate('provider').session(session);
            if (!service || service.status !== 'active') {
                throw new ErrorResponse('Service not found or inactive', 404);
            }

            // 2. Validate quantity
            if (quantity < service.minOrder || quantity > service.maxOrder) {
                throw new ErrorResponse(`Quantity must be between ${service.minOrder} and ${service.maxOrder}`, 400);
            }

            // 3. Calculate charge
            const charge = parseFloat((service.sellingPrice * (quantity / 1000)).toFixed(4));

            // 4. Check user balance and deduct atomically using $inc with a check
            // Note: We use findOneAndUpdate to ensure atomicity and prevent race conditions even with sessions
            const user = await User.findOneAndUpdate(
                { _id: userId, balance: { $gte: charge } },
                { $inc: { balance: -charge } },
                { session, new: true }
            );

            if (!user) {
                throw new ErrorResponse('Insufficient balance', 400);
            }

            // 5. Create order in DB (initial status: pending)
            const orderCreated = await Order.create([{
                user: userId,
                service: serviceId,
                link,
                quantity,
                charge,
                status: 'pending'
            }], { session });

            const order = orderCreated[0];

            // 6. Log transaction with balance before/after for ledger safety
            const balanceAfter = user.balance;
            const balanceBefore = parseFloat((balanceAfter + charge).toFixed(4));

            await Transaction.create([{
                user: userId,
                amount: charge,
                balanceBefore,
                balanceAfter,
                type: 'order',
                status: 'completed',
                description: `Order #${order._id} for ${service.name}`,
                referenceId: order._id
            }], { session });

            // Commit transaction
            await session.commitTransaction();
            session.endSession();

            // 7. Push to order queue for async processing with provider API
            if (orderQueue) {
                await orderQueue.add('processOrder', {
                    orderId: order._id,
                    provider: service.provider,
                    serviceData: {
                        providerServiceId: service.providerServiceId
                    },
                    link,
                    quantity
                });
                logger.info(`Order ${order._id} queued for processing`);
            } else {
                logger.warn(`Order ${order._id} created but NOT queued because Redis is unavailable.`);
                // In production, this should be handled as a critical error or retry logic
            }

            return order;
        } catch (error) {
            if (session.inTransaction()) {
                await session.abortTransaction();
            }
            if (session) session.endSession();
            logger.error(`Place order error: ${error.message}`);
            throw error;
        }
    }

    /**
     * Refund an order
     * @param {string} orderId - ID of the order to refund
     * @param {string} reason - Reason for refund
     */
    static async refundOrder(orderId, reason) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const order = await Order.findById(orderId).session(session);
            if (!order || ['refunded', 'cancelled'].includes(order.status)) {
                await session.abortTransaction();
                return;
            }

            // Atomic refund
            const user = await User.findByIdAndUpdate(
                order.user,
                { $inc: { balance: order.charge } },
                { session, new: true }
            );

            const balanceAfter = user.balance;
            const balanceBefore = parseFloat((balanceAfter - order.charge).toFixed(4));

            order.status = 'refunded';
            await order.save({ session });

            await Transaction.create([{
                user: order.user,
                amount: order.charge,
                balanceBefore,
                balanceAfter,
                type: 'refund',
                status: 'completed',
                description: `Refund for Order #${order._id}. Reason: ${reason}`,
                referenceId: order._id
            }], { session });

            await session.commitTransaction();
            logger.info(`Order ${orderId} refunded successfully. Reason: ${reason}`);
        } catch (error) {
            if (session.inTransaction()) {
                await session.abortTransaction();
            }
            logger.error(`Refund order error (${orderId}): ${error.message}`);
        } finally {
            session.endSession();
        }
    }

    /**
     * Sync order status from provider
     */
    static async syncOrderStatuses() {
        // This could also be moved to a cron job or a specialized worker
        const activeOrders = await Order.find({
            status: { $in: ['pending', 'processing'] },
            providerOrderId: { $exists: true }
        }).populate({
            path: 'service',
            populate: { path: 'provider' }
        });

        for (const order of activeOrders) {
            try {
                const provider = order.service.provider;
                const statusData = await ProviderService.getOrderStatus(provider, order.providerOrderId);

                if (statusData.status) {
                    const newStatus = statusData.status.toLowerCase();

                    if (newStatus !== order.status) {
                        order.status = newStatus;
                        order.startCount = statusData.start_count || 0;
                        order.remains = statusData.remains || 0;
                        await order.save();

                        if (newStatus === 'cancelled') {
                            await this.refundOrder(order._id, 'Order cancelled by provider');
                        } else if (newStatus === 'partial') {
                            // Logic for partial refund could go here
                            const partialRefundRatio = order.remains / order.quantity;
                            if (partialRefundRatio > 0) {
                                // Calculate partial refund amount...
                                // For now, simple cancel-style refund or manual handling
                            }
                        }
                    }
                }
            } catch (error) {
                logger.error(`Error syncing status for Order #${order._id}: ${error.message}`);
            }
        }
    }
}

module.exports = OrderService;

