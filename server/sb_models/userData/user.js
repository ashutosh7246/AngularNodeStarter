const mongoose = require('mongoose');
const config = require('../../../config/dbConfig');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
var validate = require('mongoose-validator'); // Import Mongoose Validator Plugin
const fieldValidators = require('../validators/fieldValidators');

//User schema 
const UserProfileSchema = new Schema({
    userId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, unique: true, validate: fieldValidators.emailValidator },
    password: { type: String, required: true },
    active: { type: Boolean, required: true, default: true },

    isPasswordChanged: { type: Boolean, required: true, default: false },
    invalidLoginAttempts: { type: Number, required: true, default: 0 },
    lastPasswordUpdatedAt: { type: Number },
    lastPasswords: [{ type: String }],

    temporarytoken: { type: String, required: false },
    resettoken: { type: String, required: false },
    accountCreated: { type: Date },
}, { collection: 'userProfiles' });

module.exports.splicedUser = function () {
    let splicedUser = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email
    }
}

// Middleware to ensure password is encrypted before saving user to database
UserProfileSchema.pre('save', function (next) {
    var user = this;

    if (!user.isModified('password')) return next(); // If password was not changed or is new, ignore middleware

    bcrypt.genSalt(config.saltIteration, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) throw err;
            user.password = hash;
            next();
        });
    });
});

// Method to compare passwords in API (when user logs in) 
UserProfileSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password); // Returns true if password matches, false if doesn't
}

module.exports = mongoose.model('userProfiles', UserProfileSchema);