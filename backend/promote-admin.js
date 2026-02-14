const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('./src/models/User');

const promote = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const email = process.argv[2] || process.env.ADMIN_EMAIL;

        if (!email) {
            console.error('Please provide an email: node promote-admin.js your@email.com');
            process.exit(1);
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            console.error(`User with email ${email} not found`);
            process.exit(1);
        }

        user.role = 'admin';
        await user.save();

        console.log(`Successfully promoted ${email} to admin role!`);
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

promote();
