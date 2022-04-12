const mongoose = require("mongoose")

//Creating a validation function
const isValid = function (value) {
    if (typeof (value) === undefined || typeof (value) === null) { 
        return false 
    }
    if (typeof (value) === "string" && (value).trim().length > 0) {
         return true 
    }
    if (typeof (value) === "number" && (value).toString().trim().length > 0) {
        return true 
    }
   if (typeof (value) === "object" && value.length > 0) {
    return true 
    }
}

//Creating a validation function for Object Id
const isValidObjectId = function (objectId){
    return mongoose.Types.ObjectId.isValid(objectId)
}

//Checking if user entered a valid email or not
let validateEmail = function (email) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

//Checking if user entered a valid phone or not
let validatephone = function (phone) {
    return /^([+]\d{2})?\d{10}$/.test(phone)
}

module.exports = {
    isValid,
    isValidObjectId,
    validateEmail,
    validatephone
}