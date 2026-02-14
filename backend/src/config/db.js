const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB Connection Failed: ${error.message}`);
    
    // ❌ DO NOT CRASH SERVER
    // process.exit(1);  <-- REMOVE THIS

    // Let server continue running
  }
};

module.exports = connectDB;
