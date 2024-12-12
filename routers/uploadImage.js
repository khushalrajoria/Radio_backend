const { PutObjectCommand, S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const multer = require("multer");
const uploadImageRouter = require("express").Router();
require("dotenv").config();


const s3 = new S3Client({
    credentials:{
        accessKeyId:process.env.NEW_ACCESS_KEY,              
        secretAccessKey:process.env.NEW_SECRET_ACESS_KEY,
    },
    region: "ap-south-1",     
  })


  uploadImageRouter.post("/uploadDiagonsticImage", async (req, res) => {
    if (!req.files) {
        return res.status(400).send({ error: "No file uploaded" });
    }

    const file = req.files[0];
    const imageName = new Date() + file.originalname;
    const command = new PutObjectCommand({
        Bucket: process.env.NEW_BUCKET_NAME,
        Key: imageName,
        Body: file.buffer,
        ContentType: file.mimetype,
    });
    try {
        await s3.send(command);
        const getObjectParams = {
            Bucket: process.env.NEW_BUCKET_NAME,
            Key: imageName 
        }
        const getCommand = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });

        res.send({ msg: "Successful", url: url });
    } catch (err) {
        console.error("S3 Upload Error:", err);
        res.status(500).send({ error: "Failed to upload file to S3" });
    }
});

    uploadImageRouter.get("/getDiagnosticImage/:imageName", async(req,res)=>{
        const imageName = req.params.imageName;

        const getObjectParams = {
            Bucket: process.env.NEW_BUCKET_NAME,
            Key: imageName 
        }
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

        res.send(url);
    })


module.exports = uploadImageRouter;