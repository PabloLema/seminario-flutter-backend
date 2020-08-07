/*jshint esversion: 6 */

// Default imports
const express = require('express');
const app = express();

// Routes import
app.use(require('./product.routes'));
app.use(require('./user.routes'));

module.exports = app;