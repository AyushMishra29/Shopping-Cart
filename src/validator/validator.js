const mongoose = require("mongoose");


const isValid = function (value) {
    if (typeof (value) === undefined || typeof (value) === null) { return false }
    if (typeof (value) === "string" && value.trim().length > 0) { return true }
    if (typeof (value) === "number" && value.toString().trim().length > 0) { return true }
    if (typeof (value) === "object" && value.length > 0) { return true }
    if (typeof (value) === null ) { return false}
    
}

const isRightFormatemail = function (email) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

const isRightFormatmobile = function (phone) {
    return /^\+?([9]{1})\)?([1]{1})\)?([6-9]{1})\)?[-. ]?([0-9]{9})$/.test(phone);
}

const isValidObjectId = function (objectId) {
    
        return mongoose.Types.ObjectId.isValid(objectId)
    }
    

const isRightFormatprice = function (price) {
    return /^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/.test(price);
}

const isNumber =function (pincode) {
    if ( /^\+?([1-9]{1})\)?([0-9]{5})$/.test(pincode)) return true
}

const isValidArray = function (object){
if (typeof (object) === "object") {
    object = object.filter(x => x.trim())
    if (object.length == 0) {
        return false;
    }
    else {return true;}
    }
  }

  const validForEnum = function (value) {
    let enumValue = ["S", "XS", "M", "X", "L", "XXL", "XL"]
    for (let x of value) {
        if (enumValue.includes(x) == false) {
            return false
        }
    }
    return true;
}

const isValidStatus = function (value) {
    let enumValue = ["pending", "completed", "cancelled", "Pending", "Completed", "Cancelled"]
    for (let i=0 ; i<enumValue.length ; i++) {
        if (value == enumValue[i])  return true
    }
    return false;
}

const isNum = function (value){
    if (typeof (value) == "number"){
        return true
    }
    else{return false}
}

module.exports.isValid = isValid;
module.exports.isRightFormatemail = isRightFormatemail;
module.exports.isRightFormatmobile = isRightFormatmobile;
module.exports.isValidObjectId = isValidObjectId;
module.exports.isRightFormatprice = isRightFormatprice;
module.exports.isNumber = isNumber;
module.exports.isValidArray = isValidArray;
module.exports.validForEnum = validForEnum;
module.exports.isValidStatus = isValidStatus;
module.exports.isNum = isNum;