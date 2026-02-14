const Order = require('../models/Order');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Service = require('../models/Service');
const Provider = require('../models/Provider');

class AnalyticsService {
    /**
     * Get dashboard stats overview
     */
    static async getOverviewStats() {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalOrders = await Order.countDocuments();

        const revenueResult = await Order.aggregate([
            { $match: { status: { $nin: ['cancelled', 'refunded'] } } },
            { $group: { _id: null, total: { $sum: '$charge' } } }
        ]);

        const profitResult = await Order.aggregate([
            { $match: { status: { $nin: ['cancelled', 'refunded'] } } },
            { $lookup: { from: 'services', localField: 'service', foreignField: '_id', as: 'svc' } },
            { $unwind: '$svc' },
            {
                $project: {
                    profit: {
                        $subtract: [
                            '$charge',
                            { $multiply: ['$quantity', { $divide: ['$svc.providerRate', 1000] }] }
                        ]
                    }
                }
            },
            { $group: { _id: null, total: { $sum: '$profit' } } }
        ]);

        return {
            totalUsers,
            totalOrders,
            totalRevenue: revenueResult.length > 0 ? parseFloat(revenueResult[0].total.toFixed(2)) : 0,
            totalProfit: profitResult.length > 0 ? parseFloat(profitResult[0].total.toFixed(2)) : 0
        };
    }

    /**
     * Revenue and Profit per Provider
     */
    static async getProviderPerformance() {
        return await Order.aggregate([
            { $match: { status: { $nin: ['cancelled', 'refunded'] } } },
            { $lookup: { from: 'services', localField: 'service', foreignField: '_id', as: 'svc' } },
            { $unwind: '$svc' },
            { $lookup: { from: 'providers', localField: 'svc.provider', foreignField: '_id', as: 'provider' } },
            { $unwind: '$provider' },
            {
                $group: {
                    _id: '$provider.name',
                    orderCount: { $sum: 1 },
                    revenue: { $sum: '$charge' }
                }
            }
        ]);
    }

    /**
     * Top Users by Spending
     */
    static async getTopSpenders(limit = 10) {
        return await Order.aggregate([
            { $match: { status: { $nin: ['cancelled', 'refunded'] } } },
            {
                $group: {
                    _id: '$user',
                    totalSpent: { $sum: '$charge' },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { totalSpent: -1 } },
            { $limit: limit },
            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'userDetails' } },
            { $unwind: '$userDetails' },
            {
                $project: {
                    username: '$userDetails.username',
                    email: '$userDetails.email',
                    totalSpent: 1,
                    orderCount: 1
                }
            }
        ]);
    }
}

module.exports = AnalyticsService;
