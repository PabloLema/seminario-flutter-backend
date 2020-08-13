/*jshint esversion: 6 */

// GLOBAL VARIABLES
process.env.PORT = process.env.PORT || 3020;
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
process.env.SEED = process.env.SEED || 'g3mu0-hzs40';
process.env.UNIQID = 'seminario-';

let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/seminario';
} else {
    urlDB = process.env.MONGO_URL;
}

process.env.URLDB = urlDB;