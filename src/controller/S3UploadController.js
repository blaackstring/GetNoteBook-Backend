import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from 'uuid'

const client = new S3Client({
  region: 'ap-south-1', credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY

  }
});

const bucketName = process.env.S3_BUCKET_NAME;
if (!bucketName) throw new Error("S3_BUCKET_NAME is not defined in environment variables");

const createPresignedUrlWithClient = ({ bucket, key }) => {

  const command = new PutObjectCommand({ Bucket: bucket, Key: key });

  return getSignedUrl(client, command, { expiresIn: 3600 });
};

export const GenerateSignedUrl = async (req, res) => {
  try {
    const key = `${uuidv4()}-${'.pdf'}`;
    const url = await createPresignedUrlWithClient({
      bucket: bucketName,
      key: key
    });
    
    console.log("Presigned URL: ", url);
    res.json({ url, key });
  } catch (error) {
    console.error("Error creating presigned URL", error);
    throw error;

  }
}

export const uploadFileToS3 = async (fileBuffer, key, contentType) => {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType
  });

  try {


    await client.send(command);
    const url = `https://${bucketName}.s3.${process.env.AWS_REGION || 'ap-south-1'}.amazonaws.com/${key}`;

    
    return { key, url };
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
};