const { S3Client, PutObjectCommand, GetObjectCommand,ListObjectsCommand} = require("@aws-sdk/client-s3");
const { json } = require("express");
const uuid = require("uuid").v4;
const s3client = new S3Client();
const { getSignedUrl } =require("@aws-sdk/s3-request-presigner");


exports.s3UploadFile = async (files) => {

    const params = files.map((file) => {
        return {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${uuid()}-${file.originalname}`,
            Body: file.buffer,
        };
    });

    return await Promise.all(
        params.map((param) => s3client.send(new PutObjectCommand(param)))
    );
};

const config = {
    credentials: {
      accessKeyId: process.env. AWS_ACCESS_KEY_ID ,
      secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY  
    },
    region: "ap-south-1"
  };
 
const client = new S3Client(config);

 
exports.getSignedFileUrl=async(filename, bucket, expiresIn) => {

    const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: "e22a1eea-ac1b-444d-8492-a58fe7e4272c-arun.jpg",
      });
  
     return await getSignedUrl(client, command, 3600);
  }
