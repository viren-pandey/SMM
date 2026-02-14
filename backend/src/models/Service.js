const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a service name'],
        trim: true
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: true
    },
    provider: {
        type: mongoose.Schema.ObjectId,
        ref: 'Provider',
        required: true
    },
    providerServiceId: {
        type: String,
        required: true
    },
    providerRate: {
        type: Number,
        required: true
    },
    fixedMargin: {
        type: Number,
        default: 0
    },
    percentMargin: {
        type: Number,
        default: 0
    },
    customPrice: {
        type: Number
    },
    sellingPrice: {
        type: Number,
        required: true
    },
    minOrder: {
        type: Number,
        default: 1
    },
    maxOrder: {
        type: Number,
        default: 10000
    },
    description: String,
    status: {
        type: String,
        enum: ['active', 'disabled'],
        default: 'active'
    }
}, {
    timestamps: true
});

// Calculate selling price before save
ServiceSchema.pre('save', function (next) {
    if (this.customPrice) {
        this.sellingPrice = this.customPrice;
    } else {
        // Price = (Base Rate * (1 + Percent/100)) + Fixed
        // Standard margin formula
        const marginAmount = (this.providerRate * (this.percentMargin / 100));
        this.sellingPrice = parseFloat((this.providerRate + marginAmount + this.fixedMargin).toFixed(4));
    }
    next();
});

module.exports = mongoose.model('Service', ServiceSchema);
