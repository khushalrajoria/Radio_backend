const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PartnerSchema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String
    },
    password: {
        type: String,
    },
    mobile: {
        type: String
    },
    profileImage: {
        type: String,
    },
    gstNo: {
        type: String,
    },
    fcmToken:{
        type: String,
    },
    roleID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
        required: true
    },
    licenseNo: {
        type: String
    },
    licenseDocument: {
        type: String
    },
    certificateDocument: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isBlocked:{
        type: Boolean,
        default: false
    },
    addedBy: {
        type: String
    }
},
    {
        timestamps: true
    });

module.exports = mongoose.model('partner', PartnerSchema);