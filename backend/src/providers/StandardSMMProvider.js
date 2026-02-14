const axios = require('axios');
const BaseProvider = require('./BaseProvider');
const logger = require('../utils/logger');

class StandardSMMProvider extends BaseProvider {
    constructor(provider) {
        super(provider);
    }

    async createOrder(data) {
        try {
            const response = await axios.post(this.apiUrl, {
                key: this.apiKey,
                action: 'add',
                service: data.serviceId,
                link: data.link,
                quantity: data.quantity
            });

            return response.data;
        } catch (error) {
            logger.error(`StandardSMMProvider createOrder error: ${error.message}`);
            throw error;
        }
    }

    async getStatus(providerOrderId) {
        try {
            const response = await axios.post(this.apiUrl, {
                key: this.apiKey,
                action: 'status',
                order: providerOrderId
            });

            return response.data;
        } catch (error) {
            logger.error(`StandardSMMProvider getStatus error: ${error.message}`);
            throw error;
        }
    }

    async getBalance() {
        try {
            const response = await axios.post(this.apiUrl, {
                key: this.apiKey,
                action: 'balance'
            });

            return response.data;
        } catch (error) {
            logger.error(`StandardSMMProvider getBalance error: ${error.message}`);
            throw error;
        }
    }

    async getServices() {
        try {
            const response = await axios.post(this.apiUrl, {
                key: this.apiKey,
                action: 'services'
            });

            if (!Array.isArray(response.data)) {
                throw new Error('Invalid response from provider API');
            }

            return response.data;
        } catch (error) {
            logger.error(`StandardSMMProvider getServices error: ${error.message}`);
            throw error;
        }
    }

    async cancelOrder(providerOrderId) {
        try {
            const response = await axios.post(this.apiUrl, {
                key: this.apiKey,
                action: 'cancel',
                order: providerOrderId
            });

            return response.data;
        } catch (error) {
            logger.error(`StandardSMMProvider cancelOrder error: ${error.message}`);
            throw error;
        }
    }
}

module.exports = StandardSMMProvider;
