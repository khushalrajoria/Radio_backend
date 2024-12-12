const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    name:{
        type:String,
    },
    email:{
      type:String,
    },
    mobile:{
        type:String,
        unique:true
    },
    password:{
        type:String
    },
    employeeNumber:{
        type:String
    },
    image:{
      type:String,
      default:""
    },
    gender:{
        type:String,
        enum:['male','Female','Other'],
    },
    roleID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
        required: true
      },
    addedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
    },
    deletedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    // points:{
    //  type:Number,
    //  default:0
    // },
    // is_Details:{
    //     type:Boolean,
    //     default:false
    // },
    // fcmToken:{
    //     type:String,
    // },
    addedBy:{
        type:String,
    },
    // status:{
    //     type:String,
    //     enum:['Active','Deleted'],
    //     default:"Active"
    // },
    isDeleted:{
        type:Boolean,
        default:false
    },
    isBlocked:{
        type: Boolean,
        default:false
    },
 },
{
    timestamps:true
   });


const UserTB = mongoose.model('User',UserSchema);
module.exports=UserTB;
  