/*jshint esversion: 6 */

// Import Dependencies
const jwt = require('jsonwebtoken');

let tokenCheck = (req, res, next) => {
    let token = req.get('Authorization');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                statusMessage: 'Unauthorized',
                message: 'Invalid Token or Not Session Found'
            });
        }
        req.user = decoded.user;
        next();
    });
};

module.exports = {
    tokenCheck
};