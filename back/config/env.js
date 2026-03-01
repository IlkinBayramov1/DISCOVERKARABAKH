import dotenv from 'dotenv';

dotenv.config();

const requiredEnvs = ['NODE_ENV', 'PORT', 'DATABASE_URL'];

requiredEnvs.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`❌ Missing required env variable: ${key}`);
  }
});

const env = {
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,
  dbUrl: process.env.DATABASE_URL,
};

export default env;
