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
                statusMessage: 'Bad Request',
                message: err
            });
        }

        return res.status(200).send({
            statusMessage: 'Successful',
            user: userDB
        });
    });
});

// Login
app.post('/login', (req, res) => {
    let body = req.body;
    User.findOne({ 
        email: body.email
    }, (err, userDB) => {
        if (err) {
            return res.status(400).send({
                statusMessage: 'Bad Request'
            });
        }

        if (!userDB) {
            return res.status(404).send({
                statusMessage: 'Not Found',
                message: `El usuario ${body.email} no existe!`
            });
        }

        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(401).send({
                statusMessage: 'Unauthorized',
                message: 'Usuario o contraseña incorrectas'
            });
        }

        let token = jwt.sign({user: userDB}, process.env.SEED);
        return res.status(200).send({
            statusMessage: 'Successful',
            user: userDB,
            token
        });
    });
});

module.exports = app;