const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const LoginSchema = new Schema({
     UserId:{
        type:String
     },
     password:{
        type:String,
     },
     IsVerified:{
      type:Number,
      default:0,
      enum:[1,0]
     },
},
{
    timestamps:true
});

const LoginDetail = mongoose.model('Login',LoginSchema);
module.exports = LoginDetail;