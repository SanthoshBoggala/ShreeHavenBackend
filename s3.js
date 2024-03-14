require('dotenv').config();

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { v4 } = require('uuid')

const s3 = new S3Client({
        region: "ap-south-1" , 
        credentials: {
            accessKeyId: process.env.AWS_ACCESSKEY,
            secretAccessKey: process.env.AWS_SECRETKEY
          }
        });
const BUCKET = process.env.BUCKET;

const uploadToS3 = async( { file, productKey } )=>{

    const name = file.originalname.split('.')[0] 
    const key = `ShreeHaven/${productKey}/${name}-${Date.now()}`;
    const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype
    })

    try {
        await s3.send(command)
        return { key }
    } catch (error) {
        console.log(error)
        return { error } 
    }
};

module.exports = uploadToS3
