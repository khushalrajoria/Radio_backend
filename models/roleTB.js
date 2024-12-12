const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RoleSchema = new Schema({
    role:{
        type:String
    },
    position:{
        type:Number
    },

},{
    timestamps:true
});

const RoleTB = mongoose.model("Role",RoleSchema);
module.exports = RoleTB;