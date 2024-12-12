const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const templateForReasonSchema= new Schema({
   
    reason:{
      type: [String],
      required:true
    },
    template:{
      type:String
    }
},{timestamps:true}
 );

 module.exports=mongoose.model('templateForReason',templateForReasonSchema);