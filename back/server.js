import http from 'http';
import app from './app.js';
import { env, connectDB } from './config/index.js';
import { initSocket } from './modules/transport/tracking/tracking.gateway.js';
import { startEventJobs } from './modules/businesses/event/event.cron.js';

const startServer = async () => {
  await connectDB();

  // Start background jobs
  startEventJobs();

  const server = http.createServer(app);

  // Initialize Socket.io
  const io = initSocket(server);

  server.listen(env.port, () => {
    console.log(` Server running on port ${env.port}`);
    console.log(` Socket.io initialized`);
  });
};

startServer();
