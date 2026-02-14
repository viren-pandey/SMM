const StandardSMMProvider = require('./StandardSMMProvider');

class ProviderFactory {
    /**
     * Get provider adapter instance
     * @param {Object} provider - Provider database model instance
     * @returns {BaseProvider}
     */
    static getAdapter(provider) {
        // For now, all SMM providers use the same standard API format
        // In the future, we can add logic to switch between different adapter types
        // (e.g. if provider.type === 'custom')
        return new StandardSMMProvider(provider);
    }
}

module.exports = ProviderFactory;
