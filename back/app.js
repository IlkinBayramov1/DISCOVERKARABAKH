import express from 'express';
import routes from './routes/index.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(routes);

// Error handler (must be last)
app.use(errorMiddleware);

export default app;
