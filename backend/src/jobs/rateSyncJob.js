const cron = require('node-cron');
const Provider = require('../models/Provider');
const Service = require('../models/Service');
const RateHistory = require('../models/RateHistory');
const ProviderService = require('../services/ProviderService');
const logger = require('../utils/logger');

const syncServiceRates = async () => {
    logger.info('Starting service rate auto-sync job...');

    try {
        const providers = await Provider.find({ status: 'active' });

        for (const provider of providers) {
            try {
                const externalServices = await ProviderService.fetchServices(provider);

                for (const extSvc of externalServices) {
                    const service = await Service.findOne({
                        provider: provider._id,
                        providerServiceId: extSvc.service
                    });

                    if (service) {
                        const newRate = parseFloat(extSvc.rate);
                        const oldRate = service.providerRate;

                        if (newRate !== oldRate) {
                            // Log history
                            await RateHistory.create({
                                service: service._id,
                                provider: provider._id,
                                oldRate,
                                newRate,
                                changePercent: ((newRate - oldRate) / oldRate) * 100
                            });

                            // Update service
                            service.providerRate = newRate;
                            // Pre-save hook in Service model will recalculate sellingPrice
                            await service.save();

                            logger.info(`Rate updated for service ${service.name} (${provider.name}): ${oldRate} -> ${newRate}`);
                        }
                    }
                }
            } catch (error) {
                logger.error(`Error syncing rates for provider ${provider.name}: ${error.message}`);
            }
        }

        logger.info('Service rate auto-sync job completed.');
    } catch (error) {
        logger.error(`Critical error in rate sync job: ${error.message}`);
    }
};

// Run every hour
cron.schedule('0 * * * *', () => {
    syncServiceRates();
});

module.exports = syncServiceRates;
