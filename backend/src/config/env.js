const joi = require('joi');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = joi.object({
    NODE_ENV: joi.string()
        .allow('development', 'production', 'test')
        .default('development'),
    PORT: joi.number().default(5000),
    APP_URL: joi.string().required().description('App base URL'),
    FRONTEND_URL: joi.string().required().description('Frontend URL'),

    // Database
    MONGODB_URI: joi.string().required().description('MongoDB connection string'),

    // Auth
    JWT_SECRET: joi.string().required().description('JWT Secret'),
    JWT_REFRESH_SECRET: joi.string().required().description('JWT Refresh Secret'),
    JWT_EXPIRE: joi.string().default('30d'),
    JWT_REFRESH_EXPIRE: joi.string().default('7d'),

    // Encryption
    ENCRYPTION_KEY: joi.string().length(32).required().description('32-character AES Encryption Key'),
    API_KEY_ENCRYPTION_SECRET: joi.string().required().description('Secret for provider API key encryption'),

    // Email
    SMTP_HOST: joi.string().required(),
    SMTP_PORT: joi.number().required(),
    SMTP_USER: joi.string().required(),
    SMTP_PASS: joi.string().required(),

    // Payment Gateways
    STRIPE_PUBLIC_KEY: joi.string().required(),
    STRIPE_SECRET_KEY: joi.string().required(),
    STRIPE_WEBHOOK_SECRET: joi.string().required(),
    PAYPAL_CLIENT_ID: joi.string().required(),
    PAYPAL_SECRET: joi.string().required(),
    CRYPTO_API_KEY: joi.string().required(),

    // Redis / Cache
    REDIS_HOST: joi.string().default('127.0.0.1'),
    REDIS_PORT: joi.number().default(6379),

    // Logging
    LOG_LEVEL: joi.string()
        .allow('error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly')
        .default('info'),
}).unknown();

const { value: envVars, error } = envVarsSchema.validate(process.env);

if (error) {
    console.error(`Config validation error: ${error.message}`);
    process.exit(1);
}

module.exports = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    appUrl: envVars.APP_URL,
    frontendUrl: envVars.FRONTEND_URL,
    mongoose: {
        url: envVars.MONGODB_URI,
    },
    jwt: {
        secret: envVars.JWT_SECRET,
        refreshSecret: envVars.JWT_REFRESH_SECRET,
        accessExpirationMinutes: envVars.JWT_EXPIRE,
        refreshExpirationDays: envVars.JWT_REFRESH_EXPIRE,
    },
    encryption: {
        key: envVars.ENCRYPTION_KEY,
        apiKeySecret: envVars.API_KEY_ENCRYPTION_SECRET,
    },
    email: {
        smtp: {
            host: envVars.SMTP_HOST,
            port: envVars.SMTP_PORT,
            auth: {
                user: envVars.SMTP_USER,
                pass: envVars.SMTP_PASS,
            },
        },
    },
    stripe: {
        publicKey: envVars.STRIPE_PUBLIC_KEY,
        secretKey: envVars.STRIPE_SECRET_KEY,
        webhookSecret: envVars.STRIPE_WEBHOOK_SECRET,
    },
    paypal: {
        clientId: envVars.PAYPAL_CLIENT_ID,
        secret: envVars.PAYPAL_SECRET,
    },
    crypto: {
        apiKey: envVars.CRYPTO_API_KEY,
    },
    redis: {
        host: envVars.REDIS_HOST,
        port: envVars.REDIS_PORT,
    },
    logLevel: envVars.LOG_LEVEL,
};
