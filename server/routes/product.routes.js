/*jshint esversion: 6 */

// Default
const express = require('express');
const app = express();

// Dependencies
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

// Models Import
const Product = require('../models/product');

// Middleware Import
const { tokenCheck } = require('../middleware/authentication');

// Post Product
app.post('/product', [tokenCheck], (req, res) => {
    let user = req.user._id;
    const productForm = formidable({
        multiples: true,
        keepExtensions: true,
        uploadDir: __dirname + `../../../uploads/img/product`
    });
    productForm.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).send({
                statusMessage: 'Bad Request'
            });
        }
        fields.img = files.img.path.replace(/^.*[\\\/]/, '');
        let product = new Product({
            title: fields.title,
            description: fields.description,
            value: fields.value,
            img: fields.img,
            user
        });
        product.save(fields, (err, productDB) => {
            if (err) {
                return res.status(400).send({
                    statusMessage: 'Bad Request'
                });
            }
            return res.status(200).send({
                statusMessage: 'Successful',
                product: productDB
            });
        });
    });
});

// Delete Product
app.delete('/product/:productID', [tokenCheck], (req, res) => {
    let id = req.params.productID;
    let user = req.user._id;
    Product.findOneAndDelete({_id: id, user}, (err, productDB) => {
        if (err) {
            return res.status(400).send({
                statusMessage: 'Bad Request'
            });
        }
        if (!productDB) {
            return res.status(404).send({
                statusMessage: 'Not Found',
                message: 'product not found or the product is not your property'
            });
        }
        return res.status(200).send({
            statusMessage: 'Successful',
            product: productDB
        });
    });
});

// Get Products
app.get('/products', (_, res) => {
    Product.find()
        .populate('user')
        .exec((err, products) => {
            if (err) {
                return res.status(400).send({
                    statusMessage: 'Bad Request'
                });
            }
            Product.countDocuments({}, (err, totalRecords) => {
                return res.status(200).send({
                    statusMessage: 'Successful',
                    totalRecords,
                    list: products
                });
            });
        });
});

// Get Mine Products
app.get('/user/products', [tokenCheck], (req, res) => {
    let user = req.user._id;
    Product.find({user})
        .populate('user')
        .exec((err, products) => {
            if (err) {
                return res.status(400).send({
                    statusMessage: 'Bad Request'
                });
            }
            Product.countDocuments({user}, (_, totalRecords) => {
                return res.status(200).send({
                    statusMessage: 'Successful',
                    totalRecords,
                    list: products
                });
            });
        });
});

// Get Product Image
app.get('/img/product/:imageName', (req, res) => {
    let imageName = req.params.imageName;
    let resourcePath = path.resolve(__dirname, `../../uploads/img/product/${imageName}`);
    if (fs.existsSync(resourcePath)) {
        return res.sendFile(resourcePath);
    } else {
        let defaultImg = path.resolve(__dirname, '../assets/no-image.png');
        return res.sendFile(defaultImg);
    }
});

// Replace Image If Exists
let deleteFile = (fileName) => {
    let pathFile = __dirname + `../../uploads/img/product/${fileName}`;
    if (fs.existsSync(pathFile)) {
        fs.unlinkSync(pathFile);
    }
};

module.exports = app;