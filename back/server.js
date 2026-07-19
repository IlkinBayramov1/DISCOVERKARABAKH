import http from 'http';
import app from './app.js';
import { env, connectDB } from './config/index.js';
import { startEventJobs } from './modules/businesses/event/event.cron.js';
import { startAttractionJobs } from './modules/businesses/attraction/attraction.cron.js';
import { startUtilityJobs } from './modules/businesses/utility/utility.cron.js';
import { initSocket } from './modules/transport/tracking/tracking.gateway.js';

const startServer = async () => {
  await connectDB();

  // Start background jobs
  startEventJobs();
  startAttractionJobs();
  startUtilityJobs();
  const server = http.createServer(app);
  
  // Initialize Socket.io
  initSocket(server);

  server.listen(env.port, () => {
    console.log(` Server running on port ${env.port}`);
  });
};

startServer();
