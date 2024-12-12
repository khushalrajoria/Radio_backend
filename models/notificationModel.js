const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    sendType:{
        type:String,
        enum:['patient','doctor','clinic','admin'],
        required: true
    },
    title:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    },
    fcmToken:{
        type: String,
        required: true
    },
    isView :{
        type: Boolean,
        default:false
    }  
},{
    timestamps:true
});

module.exports =mongoose.model("notification",NotificationSchema);