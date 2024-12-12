const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FileUploadSchema = new Schema({
    HeaderId:{
        type:String
    },
    Location:{
        type:String
    },
},{
    timestamps:true
})

const FileUpload = mongoose.model("fileUpload",FileUploadSchema)
module.exports = FileUpload