'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    fullNames: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        required: true,
        trim: true
    }
});

const forecastData = mongoose.model('forecastData', forecastSchema);

module.exports.forecastData = forecastData