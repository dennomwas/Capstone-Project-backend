'use strict'

const express = require('express');
const jsonParser = require('body-parser').json;
const app = express();

// parse incoming requests to json 
app.use(jsonParser());

// Handle 404 errors
app.use((req, res, next) => {
    const err = new Error(" Not Found");
    err.status = 404;
    next(err);
});

// Error handler
app.use((err, res, req, next) => {
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
    console.log('Express server is listening on localhost:',port)
});
