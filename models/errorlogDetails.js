const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ErrorSchema = new Schema({
    Error_message:{
        type:String
    },
    Added_on:{
        type:String,
    },
    EndPoint_Name:{
        type:String
    }
});

const Errorlog = mongoose.model('ErrorLogDetail',ErrorSchema);

module.exports = Errorlog;