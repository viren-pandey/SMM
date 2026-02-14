const User = require('../models/User');
const logger = require('../utils/logger');

const seedAdmin = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin12345';

        const adminExists = await User.findOne({ role: 'admin' });

        if (!adminExists) {
            const existingUser = await User.findOne({ email: adminEmail });
            if (existingUser) {
                existingUser.role = 'admin';
                await existingUser.save();
                logger.info(`Promoted existing user ${adminEmail} to admin`);
            } else {
                await User.create({
                    username: 'admin',
                    email: adminEmail,
                    password: adminPassword,
                    role: 'admin'
                });
                logger.info('Admin user seeded successfully');
            }
        } else {
            logger.info('Admin user already exists');
        }
    } catch (error) {
        logger.error(`Error seeding admin: ${error.message}`);
    }
};

module.exports = seedAdmin;
