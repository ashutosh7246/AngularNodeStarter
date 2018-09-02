const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OTP = new Schema({
    otp: { type: String, required: true },
    dummyOtp: { type: String, required: true },
    userRefId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userProfiles',
        required: true
    },
    isExpired: { type: Boolean },
    isDeleted: { type: Boolean },
    generatedAt: { type: Number, required: true }
}, {
        collection: 'otp',
        timestamps: { createdAt: 'created_at' },
        timestamps: { updatedAt: 'updated_at' }
    }
);
OTP.index({ otp: 1, userRefId: 1, isExpired: 1, isDeleted: 1 }, { unique: true });

module.exports = mongoose.model('otp', OTP);