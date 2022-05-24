const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const cartSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: "ShoppingCartProject_user",
        required: 'User Id is required',
        unique: true
    },
    items: {
        type: [Object],
        required: 'Items are required',
        
    },
    totalPrice: {
        type: Number,
        default: 0,
        trim: true
        

    },
    totalItems: {
        type: Number,
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model('ShoppingCartProject_cart', cartSchema);