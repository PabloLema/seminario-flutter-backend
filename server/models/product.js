/*jshint esversion: 6 */
const mongoose = require('mongoose');

let Schema = mongoose.Schema;
let productSchema = new Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    value: {
        type: Number
    },
    img: {
        type: String,
        default: 'flutter-img'
    },
    date: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
});
module.exports = mongoose.model('Product', productSchema);