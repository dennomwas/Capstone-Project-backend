'use strict'

const express = require('express');
const jsonParser = require('body-parser').json;
const mongoose = require('mongoose');
const app = express();

// parse incoming requests to json 
app.use(jsonParser());

// Db connection using mongoose
mongoose.connect('mongodb://localhost:27017/capstone-project-db', {
    useNewUrlParser: true
});
const db = mongoose.connection;

db.on('error', (err) => {
    console.log('Connection error', err);
});
db.once('open', () => {
    console.log('db connection successful!')
});

// Handle 404 errors
app.use((req, res, next) => {
    const err = new Error(" Not Found");
    err.status = 404;
    next(err);
});

// Error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    });
});

// define server port
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Express server is listening on localhost:', port)
});