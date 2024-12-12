const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SpecializaionSchema = new Schema({
    specialization:{
        type:String,
        unique: true
    }
},{
    timestamps:true
});


const Specialization= mongoose.model('specialization',SpecializaionSchema);

module.exports=Specialization;