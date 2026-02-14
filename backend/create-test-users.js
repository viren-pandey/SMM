const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smm-panel')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    });

async function createTestUser() {
    try {
        // Check if test user exists
        const existingUser = await User.findOne({ email: 'test@test.com' });

        if (existingUser) {
            console.log('ℹ️  Test user already exists');
            console.log('📧 Email: test@test.com');
            console.log('🔑 Password: test123');
            console.log('👤 Role:', existingUser.role);
            console.log('💰 Balance:', existingUser.balance);

            // Update password to ensure it's correct
            existingUser.password = 'test123';
            await existingUser.save();
            console.log('✅ Password reset to: test123');
        } else {
            // Create new test user
            const user = await User.create({
                username: 'testuser',
                email: 'test@test.com',
                password: 'test123',
                role: 'user',
                balance: 100
            });

            console.log('✅ Test user created successfully!');
            console.log('📧 Email: test@test.com');
            console.log('🔑 Password: test123');
            console.log('👤 Role:', user.role);
        }

        // Also create/update admin user
        const existingAdmin = await User.findOne({ email: 'admin@admin.com' });

        if (existingAdmin) {
            console.log('\nℹ️  Admin user already exists');
            console.log('📧 Email: admin@admin.com');
            console.log('🔑 Password: admin123');
            console.log('👤 Role:', existingAdmin.role);

            // Ensure role is admin and reset password
            existingAdmin.role = 'admin';
            existingAdmin.password = 'admin123';
            await existingAdmin.save();
            console.log('✅ Admin password reset to: admin123');
        } else {
            const admin = await User.create({
                username: 'admin',
                email: 'admin@admin.com',
                password: 'admin123',
                role: 'admin',
                balance: 1000
            });

            console.log('\n✅ Admin user created successfully!');
            console.log('📧 Email: admin@admin.com');
            console.log('🔑 Password: admin123');
            console.log('👤 Role:', admin.role);
        }

        console.log('\n🎉 Setup complete! You can now login with these credentials.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Run the function
createTestUser();
