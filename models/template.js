const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const templateSchema= new Schema({
   
    name:{
      type:String,
      required:true
    },
    questions:{
      type: [String]
    }
},{timestamps:true}
 );

 module.exports=mongoose.model('template',templateSchema);