/*jshint esversion: 6 */

// Default
const express = require('express');
const app = express();

// Dependencies
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require('underscore');

// Models Import
const User = require('../models/user');

// Register user
app.post('/user', (req, res) => {
    let body = req.body;
    let user = new User({
        name: body.name,
        email: body.email,
        phone: body.phone,
        password: bcrypt.hashSync(body.password, 10)
    });

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).send({
                statusMessage: 'Bad Request'
            });
        }

        return res.status(200).send({
            statusMessage: 'Successful',
            user: userDB
        });
    });
});

module.exports = app;