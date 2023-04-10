require("dotenv").config();
const express = require("express");
const multer = require("multer");
const { s3UploadFile, getSignedFileUrl } = require("../fileUpload_S3/S3BucketService/s3Service");
const uuid = require("uuid").v4;
const app = express();
const { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsCommand } = require("@aws-sdk/client-s3");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[0] === "image") {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
  }
};


const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1000000000, files: 3 },
});


app.post("/upload", upload.array("file"), async (req, res) => {
  try {
    const results = await s3UploadFile(req.files);
    console.log(results);
    return res.json({ status: "success", results });
  } catch (err) {
    console.log(err);
  }
});


app.get("/readfile", async (req, res) => {
  const results = await getSignedFileUrl();
  res.json(results);
});


app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "file is too large",
      });
    }

    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        message: "File limit reached",
      });
    }

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        message: "File must be an image",
      });
    }
  }
});

app.listen(6000, () => console.log("listening on port 6000"));




