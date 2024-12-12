const mongoose = require("mongoose")
const Schema = mongoose.Schema

const forgetPasswordSchema = new Schema({

    userId:{
        type: mongoose.Schema.Types.ObjectId
    },
    token:{
        type: String,
    },
    expirationTime:{
        type: Date
    },
    used:{
        type: Boolean,
        default: false
    },

},{
    timestamps:true,
});

const forgetPasswordModel = mongoose.model('forgetpassword',forgetPasswordSchema)

module.exports = forgetPasswordModel;