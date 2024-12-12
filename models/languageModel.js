const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const languageSchema = new Schema({
    key:{
        type: String, 
        lowercase: true, 
        trim: true 
    },
    value:{
        type:String
    },
},
{
    timestamps:true
});

module.exports =  mongoose.model('language',languageSchema);