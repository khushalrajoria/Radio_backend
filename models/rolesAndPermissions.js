const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RoleAndPermissionsSchema = new Schema({
    roleID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
        required: true
    },
    permission:{
        type:String
    },
    create_data:{
        type:Boolean,
        default:false
    },
    read_data:{
        type:Boolean,
        default:false
    },
    update_data:{
        type:Boolean,
        default:false
    },
    delete_data:{
        type:Boolean,
        default:false
    },

},{
    timestamps:true
});

module.exports = mongoose.model('role_and_permissions',RoleAndPermissionsSchema);