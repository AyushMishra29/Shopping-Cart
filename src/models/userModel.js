const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: 'First Name is required',
        trim: true
    },
    lname: {
        type: String,
        required: 'Last Name is required',
        trim: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: 'Email is required',

    },
    profileImage: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: 'Phone is required',
        unique: true,
        trim: true,
    },

    password: {
        type: String,
        required: 'Password is required',
        trim: true,
    },
    
    address: {
        shipping: {
            street: { type: String, required:true, trim: true },
            city: { type: String, required:true, trim: true },
            pincode: { type: Number, required:true, trim: true }
        },

        billing: {
            street: { type: String, required:true, trim: true },
            city: { type: String, required:true, trim: true },
            pincode: { type: Number, required:true, trim: true }
        }

    }

}, { timestamps: true });

module.exports = mongoose.model('ShoppingCartProject_user', userSchema);