const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QualificationSchema= new Schema({
    qualification:{
      type:String,
      unique:true
    }
    
},{timestamps:true});

const Qualification=mongoose.model('Qualification',QualificationSchema);
module.exports=Qualification;