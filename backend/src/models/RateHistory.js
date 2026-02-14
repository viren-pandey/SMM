const mongoose = require('mongoose');

const RateHistorySchema = new mongoose.Schema({
    service: {
        type: mongoose.Schema.ObjectId,
        ref: 'Service',
        required: true
    },
    provider: {
        type: mongoose.Schema.ObjectId,
        ref: 'Provider',
        required: true
    },
    oldRate: {
        type: Number,
        required: true
    },
    newRate: {
        type: Number,
        required: true
    },
    changePercent: {
        type: Number
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('RateHistory', RateHistorySchema);
