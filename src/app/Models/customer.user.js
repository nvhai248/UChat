const mongoose = require('mongoose');

const Schema = mongoose.Schema

const Customer_account = new Schema({
    googleID: { type: String },
    facebookID: { type: String },
    name: { type: String },
    email: { type: String },
    password: { type: String },
    address: { type: String },
    photo: { type: String },
}, {
    collection: 'customer_account',
    timestamps: true,
})

module.exports = mongoose.model("Customer_account", Customer_account);