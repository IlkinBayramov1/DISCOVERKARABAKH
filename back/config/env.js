import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const requiredEnvs = ['NODE_ENV', 'PORT', 'DATABASE_URL', 'JWT_SECRET'];

// Only require S3 variables if S3_ENDPOINT is specified
if (process.env.NODE_ENV === 'production' && process.env.S3_ENDPOINT) {
  requiredEnvs.push(
    'S3_ACCESS_KEY_ID',
    'S3_SECRET_ACCESS_KEY',
    'S3_BUCKET_NAME',
    'S3_PUBLIC_URL'
  );
}

requiredEnvs.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`❌ Missing required env variable: ${key}`);
  }
});

const env = {
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,
  dbUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  
  // Redis connection url
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  
  // Cloudflare R2 / AWS S3 storage
  s3: {
    endpoint: process.env.S3_ENDPOINT,
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    bucketName: process.env.S3_BUCKET_NAME,
    publicUrl: process.env.S3_PUBLIC_URL,
  },
  
  // Sentry DSN for monitoring
  sentryDsn: process.env.SENTRY_DSN,
};

export default env;
