const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DoctorModelSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    mobile: {
        type: String,
        unique: true
    },
    dob: {
        type: String
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other', ''],
    },
    profileImage: {
        type: String,
        default:""
    },
    // about:{
    //     type:String,
    // },
    licenseNo: {
        type: String,
    },
    licenseDocument: {
        type: String,
    },
    certificateDocument: {
        type: String,
    },
    qualifications: {
        type:[String]
       // type: String
    },
    specialization: {
        type: String,
        default: ''
    },
    password: {
        type: String,
    },
    roleID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
        required: true
    },
    subSpecialization: {
        type: [String],
        default: ''
    },
    // language: {
    //     type: [String],
    //     default: ''
    // },
    experience: {
        type: Number,
    },
    supervisorId: {
        type: String,
    },
    // fcmToken: {
    //     type: String,
    // },
    // deviceID: {
    //     type: String
    // },
    addedBy: {
        type: String,
    },
    isBlocked:{
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
}, { timestamps: true }
);
module.exports = mongoose.model('doctor', DoctorModelSchema);
