/*jshint esversion: 6 */

// Default
const express = require('express');
const app = express();

// Dependencies
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require('underscore');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

// Models Import
const User = require('../models/user');

// Middleware Import
const { tokenCheck } = require('../middleware/authentication');

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

// Get session data
app.get('/session', [tokenCheck], (req, res) => {
    let id = req.user._id;
    User.findById(id, (err, userDB) => {
        if (err) {
            return res.status(400).send({
                statusMessage: 'Bad Request'
            });
        }
        return res.status(200).send({
            statusMessage: 'Successful',
            user: userDB,
        });
    });
});

// Update User
app.put('/user', [tokenCheck], (req, res) => {
    let id = req.user._id;
    const productForm = formidable({
        multiples: true,
        keepExtensions: true,
        uploadDir: __dirname + `../../../uploads/img/user`
    });
    productForm.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).send({
                statusMessage: 'Bad Request'
            });
        }
        if (!_.isEmpty(files)) {
            fields.img = files.img.path.replace(/^.*[\\\/]/, '');
        }
        let body = _.pick(fields, ['name' ,'email' ,'phone' ,'password' , 'img']);
        User.findByIdAndUpdate(id, body, (err, userDB) => {
            if (err) {
                return res.status(400).send({
                    statusMessage: 'Bad Request'
                });
            }
            if (body.img !== undefined) {
                deleteFile(userDB.img);
            }
            return res.status(200).send({
                statusMessage: 'Successful',
                message: 'User Updated'
            });
        });
    });
});

// Get User Image
app.get('/img/user/:imageName', (req, res) => {
    let imageName = req.params.imageName;
    let resourcePath = path.resolve(__dirname, `../../uploads/img/user/${imageName}`);
    if (fs.existsSync(resourcePath)) {
        return res.sendFile(resourcePath);
    } else {
        let defaultImg = path.resolve(__dirname, '../assets/no-image.png');
        return res.sendFile(defaultImg);
    }
});

// Replace Image If Exists
let deleteFile = (fileName) => {
    let pathFile = path.resolve(__dirname + `../../../uploads/img/user/${fileName}`);
    if (fs.existsSync(pathFile)) {
        fs.unlinkSync(pathFile);
    }
};

module.exports = app;