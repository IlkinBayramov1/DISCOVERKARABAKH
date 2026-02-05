import mongoose from 'mongoose';
import env from './env.js';

export const connectDB = async () => {
  try {
    await mongoose.connect(env.dbUri, {
      autoIndex: env.nodeEnv !== 'production',
    });

    console.log('✅ Database connected');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await mongoose.connection.close();
  console.log('🛑 Database disconnected');
};
