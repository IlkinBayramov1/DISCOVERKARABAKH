import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

const app = express();

// Enable CORS for frontend fetching
app.use(cors());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploads)
import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes (API)
app.use(routes);

// ─── Serve Built Frontend Apps (Production) ──────────────────────────
const DIST_PATH = path.join(__dirname, '../front/dist');

// 1. Vendor Portal (Subpath /vendor)
app.use('/vendor', express.static(path.join(DIST_PATH, 'vendor'), { index: false }));
app.get(/^\/vendor(\/.*)?$/, (req, res) => {
    res.sendFile(path.join(DIST_PATH, 'vendor/index.html'));
});

// 2. Admin Portal (Subpath /admin)
app.use('/admin', express.static(path.join(DIST_PATH, 'admin'), { index: false }));
app.get(/^\/admin(\/.*)?$/, (req, res) => {
    res.sendFile(path.join(DIST_PATH, 'admin/index.html'));
});

// 3. Web (Main App at Root)
app.use(express.static(DIST_PATH));
app.get(/^((?!\/uploads|\/api).)*$/, (req, res) => {
    res.sendFile(path.join(DIST_PATH, 'index.html'));
});

// Error handler (must be last)
app.use(errorMiddleware);

export default app;
