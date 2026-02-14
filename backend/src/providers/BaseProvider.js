class BaseProvider {
    constructor(provider) {
        this.provider = provider;
        this.apiKey = provider.getDecryptedApiKey();
        this.apiUrl = provider.apiUrl;
    }

    /**
     * Create an order with the provider
     * @param {Object} data - { serviceId, link, quantity }
     */
    async createOrder(data) {
        throw new Error('Method createOrder() must be implemented');
    }

    /**
     * Get order status from the provider
     * @param {string} providerOrderId
     */
    async getStatus(providerOrderId) {
        throw new Error('Method getStatus() must be implemented');
    }

    /**
     * Get provider balance
     */
    async getBalance() {
        throw new Error('Method getBalance() must be implemented');
    }

    /**
     * Get services from the provider
     */
    async getServices() {
        throw new Error('Method getServices() must be implemented');
    }

    /**
     * Cancel an order (if supported)
     * @param {string} providerOrderId
     */
    async cancelOrder(providerOrderId) {
        throw new Error('Method cancelOrder() must be implemented');
    }
}

module.exports = BaseProvider;
