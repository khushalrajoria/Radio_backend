const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const urlSchema=  new Schema({
    url:{
      type:String
    },
    generateUrl:{
        type:String
    },
    CreatedAt:{
        type:Date,
        default:Date.now,
        index:{
            expires:600
        }
     }
},
);

const url = mongoose.model('urlDetails',urlSchema);
module.exports = url;