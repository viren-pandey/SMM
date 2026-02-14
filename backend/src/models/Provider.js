const mongoose = require('mongoose');
const Encryption = require('../utils/encryption');

const ProviderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a provider name'],
        unique: true
    },
    apiUrl: {
        type: String,
        required: [true, 'Please add an API URL']
    },
    apiKey: {
        type: String,
        required: [true, 'Please add an API key']
    },
    balance: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'disabled'],
        default: 'active'
    }
}, {
    timestamps: true
});

// Encrypt API key before saving
ProviderSchema.pre('save', function (next) {
    if (this.isModified('apiKey')) {
        this.apiKey = Encryption.encrypt(this.apiKey);
    }
    next();
});

// Method to get decrypted API key
ProviderSchema.methods.getDecryptedApiKey = function () {
    return Encryption.decrypt(this.apiKey);
};

module.exports = mongoose.model('Provider', ProviderSchema);

