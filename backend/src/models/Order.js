const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    service: {
        type: mongoose.Schema.ObjectId,
        ref: 'Service',
        required: true
    },
    quantity: {
        type: Number,
        required: [true, 'Please add a quantity']
    },
    charge: {
        type: Number,
        required: true
    },
    link: {
        type: String,
        required: [true, 'Please add a link']
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'partial', 'cancelled', 'refunded'],
        default: 'pending'
    },
    providerOrderId: {
        type: String
    },
    providerResponse: {
        type: Object
    },
    remains: {
        type: Number,
        default: 0
    },
    startCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema);
