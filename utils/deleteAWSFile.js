const Aws = require('aws-sdk'); 
const path=require('path')
require('aws-sdk/lib/maintenance_mode_message').suppress = true;
//--------------------------------AWS Configuration-------------------------------------
const s3 = new Aws.S3({
  accessKeyId:process.env.NEW_ACCESS_KEY,              
  secretAccessKey:process.env.NEW_SECRET_ACESS_KEY,
  region: "ap-south-1",     
})

//--------------------------------AWS file delete-------------------------

const deleteAWSFile =async function (key) {
    console.log("key",key);
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: process.env.NEW_BUCKET_NAME,
        Key: key
      };
  
      s3.deleteObject(params, (err, data) => {
        if (err) {
          console.log(err, err.stack);
          resolve("error in deleting object");
        } else {
          resolve(true);
        }
      });
    });
  };
  

  


module.exports.deleteAWSFile =deleteAWSFile;