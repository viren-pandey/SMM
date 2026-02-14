const mongoose = require('mongoose');

const PaymentProviderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a provider name'],
        unique: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['stripe', 'paypal', 'crypto', 'manual', 'razorpay', 'other'],
        required: true
    },
    logo: {
        type: String, // URL or path to logo
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    },
    minimumAmount: {
        type: Number,
        default: 1,
        min: 0
    },
    maximumAmount: {
        type: Number,
        default: 10000
    },
    apiKey: String,
    apiSecret: String,
    webhookSecret: String,
    config: {
        type: mongoose.Schema.Types.Mixed, // For provider-specific config
        default: {}
    },
    instructions: {
        type: String, // For manual payment instructions
        default: ''
    },
    displayOrder: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('PaymentProvider', PaymentProviderSchema);
