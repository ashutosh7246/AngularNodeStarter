const mongoose = require('mongoose');

const Schema = mongoose.Schema;

counterSchema = new Schema({
    model: {
        type: String,
        require: true
    },
    field: {
        type: String,
        require: true
    },
    prefix: {
        type: String,
        unique: true
    },
    seq: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('counter', counterSchema);