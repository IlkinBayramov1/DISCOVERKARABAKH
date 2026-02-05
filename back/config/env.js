import dotenv from 'dotenv';

dotenv.config();

const requiredEnvs = ['NODE_ENV', 'PORT', 'DB_URI'];

requiredEnvs.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`❌ Missing required env variable: ${key}`);
  }
});

const env = {
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,
  dbUri: process.env.DB_URI,
};

export default env;
