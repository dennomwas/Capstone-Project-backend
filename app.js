'use strict'

const express = require('express');
const app = express();

// define server port
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Express server is listening on localhost:',port)
});