const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SocketSchema = new Schema({
    userId:{
        type:String
    },
    role:{
        type:String,
    },
    socketId:{
        type:String,
    }
    
},{
    timestamps:true
});

module.exports=mongoose.model('socket',SocketSchema);