const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const patientSchema = new Schema({
    patientReferenceNumber:{
        type: String,
    },
    name:{
        type:String,
        required:true
    },
    email:{
      type:String,
      default:null
    },
    mobile:{
        type:String,
        unique:true
    },
    age:{
      type:Number
    },
    gender:{
        type:String,
        enum:['Male','Female','Other'],
    },
    clinicId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'partner',
        // default:""
    },
    addedBy:{
        type: String,
    },
    // fcmToken:{
    //     type:String,
    // },
    // deviceID:{
    //    type:String
    // },
    // platform:{
    //    type:String,
    // },
    // referralCode:{
    //     type:String
    // },
    // appVersion:{
    //     type:String
    // },
    // patientAddedBy:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "patientDetail",   
    // },
    // addedBy:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",   
    // },
    isDeleted:{
        type:Boolean,
        default:false
    },
    isActive:{
        type:Boolean,
        default:true
    },
    // freeAppointment:{
    //     type:Number,
    //     default:0
    // }, 
 },
{
    timestamps:true
   });


module.exports=mongoose.model('patientDetail',patientSchema);
  