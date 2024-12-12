const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const OTPSchema = new Schema ({
    mobile:{
        type:String,
        required:true
    },
    Otp:{
        type:Number,
        required:true
    },
    CreatedAt:{
        type:Date,
        default:Date.now,
        index:{
            expires:100
        }
    }
},
);

const OTP = mongoose.model('OTP',OTPSchema);
module.exports = OTP;