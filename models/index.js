'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'A first name is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'A last name is required'],
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'An Email is required'],
        trim: true
    },
    password: {
        type: String,
        required: [true, 'A Password is Required'],
        trim: true
    },
});

// check if user exists
UserSchema.statics.authenticate = (email, password, callback) => {
    User.findOne({
        email: email
    }).exec((error, user) => {
        if (error) {
            return callback(error);
        } else if (!user) {
            const err = new Error('User not found!')
            err.status = 401;
            return callback(err);
        };
        bcrypt.compare(password, user.password, (error, result) => {
            if (result === true) {
                return callback(null, user)
            }
            return callback(error, null);
        });
    });
};

// hash password before saving
UserSchema.pre('save', function (next) {
    const user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        return next();
    })
});

const User = mongoose.model('User', UserSchema);
module.exports = User;