const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AuthToken = new Schema({
    accessToken: { type: String },
    refreshToken: { type: String },
    lastActivityAt: { type: Date },
    ipAddress: { type: String },
    userAgent: { type: String },
    userId: { type: String, required: true }
}, {
        collection: 'auth_token',
        timestamps: { createdAt: 'created_at' },
        timestamps: { updatedAt: 'updated_at' }
    });

module.exports = mongoose.model('auth_token', AuthToken);