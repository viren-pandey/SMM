const Service = require('../models/Service');
const Category = require('../models/Category');
const ProviderService = require('./ProviderService');

class ServiceManager {
    /**
     * Sync services from a provider API to our database
     * @param {Object} provider - Provider model instance
     */
    static async syncFromProvider(provider) {
        const externalServices = await ProviderService.fetchServices(provider);

        // We'll iterate through services and update/create them
        // Note: In a production app, we might want to group by category first
        for (const extSvc of externalServices) {
            // Find or create category
            let category = await Category.findOne({ name: extSvc.category });
            if (!category) {
                category = await Category.create({ name: extSvc.category });
            }

            // Find existing service or prepare new one
            let service = await Service.findOne({
                provider: provider._id,
                providerServiceId: extSvc.service
            });

            if (service) {
                // Update existing service base rate
                service.providerRate = parseFloat(extSvc.rate);
                service.name = extSvc.name;
                service.minOrder = extSvc.min;
                service.maxOrder = extSvc.max;
                service.description = extSvc.type;
                // Pre-save hook will recalculate sellingPrice
                await service.save();
            } else {
                // Create new service with default margins (e.g. 10% or from provider settings)
                await Service.create({
                    name: extSvc.name,
                    category: category._id,
                    provider: provider._id,
                    providerServiceId: extSvc.service,
                    providerRate: parseFloat(extSvc.rate),
                    percentMargin: 10, // Default 10% margin
                    minOrder: extSvc.min,
                    maxOrder: extSvc.max,
                    description: extSvc.type
                });
            }
        }
    }

    /**
     * Update service margins in bulk
     * @param {Array} ids - List of service IDs
     * @param {Object} margins - { fixedMargin, percentMargin }
     */
    static async updateMargins(ids, { fixedMargin, percentMargin }) {
        await Service.updateMany(
            { _id: { $in: ids } },
            {
                $set: {
                    fixedMargin: fixedMargin || 0,
                    percentMargin: percentMargin || 0,
                    customPrice: null // Clear override if setting margins
                }
            }
        );

        // We need to trigger save hooks to recalculate prices
        // updateMany doesn't trigger pre-save, so we fetch and save
        const services = await Service.find({ _id: { $in: ids } });
        for (const svc of services) {
            await svc.save();
        }
    }
}

module.exports = ServiceManager;
