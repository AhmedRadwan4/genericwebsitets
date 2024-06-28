import express from "express";
import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import cors from "cors";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import helmet from "helmet";
import morgan from "morgan";

dotenv.config();

const app = express();
const upload = multer();
const port = process.env.PORT || 3001;

const REGION = process.env.AWS_REGION;
const ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const SECRET_KEY = process.env.AWS_SECRET_KEY;
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

if (!REGION || !ACCESS_KEY || !SECRET_KEY || !BUCKET_NAME) {
  throw new Error("Missing necessary AWS configuration environment variables.");
}

const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
});

app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan("combined"));
app.use(express.json());

const generateUniqueFilename = (originalName) => {
  const uniqueSuffix = uuidv4();
  const fileExtension = originalName.split(".").pop();
  return `${uniqueSuffix}.${fileExtension}`;
};

app.post("/upload", upload.single("file"), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send("No file uploaded.");
  }

  const uniqueFileName = generateUniqueFilename(file.originalname);

  const params = {
    Bucket: BUCKET_NAME,
    Key: `${uniqueFileName}`,
    Body: file.buffer,
    ACL: "public-read",
  };

  try {
    const command = new PutObjectCommand(params);
    const data = await s3Client.send(command);
    if (data.$metadata.httpStatusCode !== 200) {
      throw new Error("Failed to retrieve the URL of the uploaded file.");
    }
    res.send(
      `https://${params.Bucket}.s3.${REGION}.amazonaws.com/${params.Key}`
    );
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send(`Failed to upload file: ${error.message}`);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
