/*jshint esversion: 6 */

// Import archive with all init configs
require('./config/config');

// Default imports
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// DB Connect DB
mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.URLDB, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
    if (err) {
        console.log(err);
        throw err;
    } else {
        console.log('DB Connected');
    }
});

// Type Data WebServices
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS
const cors = require('cors');
app.use(cors({ origin: '*' }));

// Routes Import
app.use(require('./routes/index'));

// Run SERVER
app.listen(process.env.PORT, () => {
    console.log(`Server ON port:${process.env.PORT}`);
});