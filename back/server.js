import app from './app.js';
import { env, connectDB } from './config/index.js';

const startServer = async () => {
  await connectDB();

  app.listen(env.port, () => {
    console.log(`🚀 Server running on port ${env.port}`);
  });
};

startServer();
