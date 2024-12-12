const Aws = require("aws-sdk");
const path = require("path");
require("aws-sdk/lib/maintenance_mode_message").suppress = true;
const s3 = new Aws.S3({
  accessKeyId: process.env.NEW_ACCESS_KEY,
  secretAccessKey: process.env.NEW_SECRET_ACESS_KEY,
  region: "ap-south-1",
});

async function signedURL(key) {
  const params = {
    Bucket: process.env.NEW_BUCKET_NAME,
    Key: key,
    Expires: 60 * 10,
  };
  const presignedUrl = await s3.getSignedUrl("getObject", params);

  return presignedUrl;
}

module.exports = signedURL;
