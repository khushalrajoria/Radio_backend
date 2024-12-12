const Aws = require('aws-sdk'); 
const path=require('path')
require('aws-sdk/lib/maintenance_mode_message').suppress = true;
//--------------------------------AWS Configuration-------------------------------------
const s3 = new Aws.S3({
  accessKeyId:process.env.NEW_ACCESS_KEY,              
  secretAccessKey:process.env.NEW_SECRET_ACESS_KEY,
  region: "ap-south-1",     
})

//--------------------------------AWS file upload--------------------------

const uploadFile = async function (file, name) {
    return new Promise(function (resolve, reject) {
        const fileExtension = path.extname(file.originalname);    
        const image =  file.originalname.replace(/\s/g, "_");
        const key = image +Date.now() + fileExtension;
       
        const uploadParams = {
            Bucket:process.env.NEW_BUCKET_NAME,      
            Key: key,               
            Body:file.buffer,                    
            ACL:"public-read-write",   
        }
        s3.upload(uploadParams, function (err, data) {
            if (err) {
                return reject({ "error": err })
            }
            const params= {
                Bucket:process.env.NEW_BUCKET_NAME,      
                Key: key, 
            }
            const presignedUrl = s3.getSignedUrl("getObject", params);
            //  console.log("location",data.Location);
            //  console.log("url",presignedUrl);
            return resolve({
              location: data.Location,
              presignedUrl: presignedUrl,
            });
            // return resolve(data.Location) 
        })
    })
}
const deleteFile = async function (key) {
    return new Promise(function (resolve, reject) {
        const deleteParams = {
            Bucket: process.env.NEW_BUCKET_NAME,
            Key: key,
        };

        s3.deleteObject(deleteParams, function (err, data) {
            if (err) {
                return reject({ "error": err });
            }
            console.log("File deleted successfully from S3");
            return resolve();
        });
    });
};


module.exports.uploadFile ={uploadFile,deleteFile};