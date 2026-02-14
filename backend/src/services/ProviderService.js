const ProviderFactory = require('../providers/ProviderFactory');
const logger = require('../utils/logger');

class ProviderService {
    /**
     * Fetch services from an external provider API
     * @param {Object} provider - Provider model instance
     * @returns {Promise<Array>} List of services from provider
     */
    static async fetchServices(provider) {
        try {
            const adapter = ProviderFactory.getAdapter(provider);
            return await adapter.getServices();
        } catch (error) {
            logger.error(`ProviderService fetchServices error (${provider.name}): ${error.message}`);
            throw error;
        }
    }

    /**
     * Place an order with an external provider
     * @param {Object} provider - Provider model instance
     * @param {Object} serviceData - Order details
     * @returns {Promise<Object>} Provider response
     */
    static async placeOrder(provider, serviceData) {
        try {
            const adapter = ProviderFactory.getAdapter(provider);
            return await adapter.createOrder(serviceData);
        } catch (error) {
            logger.error(`ProviderService placeOrder error (${provider.name}): ${error.message}`);
            throw error;
        }
    }

    /**
     * Get order status from an external provider
     * @param {Object} provider - Provider model instance
     * @param {string} providerOrderId - Order ID returned by provider
     * @returns {Promise<Object>} Provider status response
     */
    static async getOrderStatus(provider, providerOrderId) {
        try {
            const adapter = ProviderFactory.getAdapter(provider);
            return await adapter.getStatus(providerOrderId);
        } catch (error) {
            logger.error(`ProviderService getOrderStatus error (${provider.name}): ${error.message}`);
            throw error;
        }
    }

    /**
     * Get provider balance
     * @param {Object} provider - Provider model instance
     * @returns {Promise<Object>} Provider balance response
     */
    static async getBalance(provider) {
        try {
            const adapter = ProviderFactory.getAdapter(provider);
            return await adapter.getBalance();
        } catch (error) {
            logger.error(`ProviderService getBalance error (${provider.name}): ${error.message}`);
            throw error;
        }
    }

    /**
     * Cancel an order from an external provider
     * @param {Object} provider - Provider model instance
     * @param {string} providerOrderId - Order ID returned by provider
     * @returns {Promise<Object>} Provider cancellation response
     */
    static async cancelOrder(provider, providerOrderId) {
        try {
            const adapter = ProviderFactory.getAdapter(provider);
            return await adapter.cancelOrder(providerOrderId);
        } catch (error) {
            logger.error(`ProviderService cancelOrder error (${provider.name}): ${error.message}`);
            throw error;
        }
    }
}

module.exports = ProviderService;

