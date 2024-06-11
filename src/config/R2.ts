import {
  S3Client,
  ListBucketsCommand,
  ListObjectsCommand,
  GetObjectCommand,
  PutObjectCommand,
  PutBucketCorsCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const S3 = new S3Client({
  region: "auto",
  endpoint: `https://60fb16943028530a147d89e97a5d599f.r2.cloudflarestorage.com/mumu`,
  credentials: {
    accessKeyId: import.meta.env.VITE_R2_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_R2_SECRET_ACCESS_KEY,
  },
});
