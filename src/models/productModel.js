const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'Title is required',
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: 'Description is required',
        trim: true
    },
    price: {
        type: Number,
        required: 'Price is required'
    },
    currencyId: {
        type: String,
        required: "Currency Id is required",
        enum: ['INR']
    },
    currencyFormat: {
        type: String,
        required: 'Currrency format is required',
    },
    isFreeShipping: {
        type: Boolean,
        default: false
    },
    productImage: {
        type: String,
        required: 'Image is required'
    },
    style: {
        type: String
    },
    availableSizes: {
        type: [String],
    },
    installments: {
        type: Number
    },
    deletedAt: { type: Date,
    default: null },
    isDeleted: {
        type: Boolean,
        default: false
    },

}, { timestamps: true });

module.exports = mongoose.model('ShoppingCartProject_product', productSchema);