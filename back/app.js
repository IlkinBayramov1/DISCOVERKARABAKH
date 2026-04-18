import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

const app = express();

// Enable CORS strictly for authorized frontend domains
const allowedOrigins = [
    process.env.FRONTEND_WEB_URL || 'http://localhost:5173',
    process.env.FRONTEND_VENDOR_URL || 'http://localhost:5174',
    process.env.FRONTEND_ADMIN_URL || 'http://localhost:5175'
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Check strict list first
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }

        // DEVELOPMENT MODE HELPER: 
        // Bütün localhost və 127.0.0.1 portlarına avtomatik icazə veririk
        if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
            return callback(null, true);
        }

        console.error(`[CORS Blocked] Xəta: Bu URL qeydiyyatda deyil ->`, origin);
        var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
    },
    credentials: true
}));

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
