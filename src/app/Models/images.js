const mongoose = require('mongoose');

const Schema = mongoose.Schema

const Images = new Schema({
    name: { type: String },
    data: { type: Buffer },
}, {
    collection: 'images',
    timestamps: true,
})

module.exports = mongoose.model("Images", Images);