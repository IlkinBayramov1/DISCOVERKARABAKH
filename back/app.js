import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import fs from 'fs';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import * as Sentry from '@sentry/node';
import env from './config/env.js';

const app = express();

// Initialize Sentry if configured
if (env.sentryDsn) {
    Sentry.init({
        dsn: env.sentryDsn,
        environment: env.nodeEnv,
        tracesSampleRate: 1.0
    });
    console.log('🛡️ Sentry monitoring initialized successfully.');
}

// Helper to split comma-separated env vars, or fallback to localhost
const getOrigins = (envVar, fallback) => {
    if (!envVar) return [fallback];
    return envVar.split(',').map(url => url.trim());
};

// Enable CORS strictly for authorized frontend domains
const allowedOrigins = [
    ...getOrigins(process.env.FRONTEND_WEB_URL, 'http://localhost:5173'),
    ...getOrigins(process.env.FRONTEND_VENDOR_URL, 'http://localhost:5174'),
    ...getOrigins(process.env.FRONTEND_ADMIN_URL, 'http://localhost:5175')
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }

        if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:') || origin.endsWith('.vercel.app')) {
            return callback(null, true);
        }

        console.error(`[CORS Blocked] Xəta: Bu URL qeydiyyatda deyil ->`, origin);
        var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
    },
    credentials: true
}));

// Apply Helmet Security Headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://challenges.cloudflare.com", "https://cdnjs.cloudflare.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "blob:", "*"], // Allow images from any source
            connectSrc: ["'self'", "*"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'", "*"],
            frameSrc: ["'self'", "https://challenges.cloudflare.com"],
            upgradeInsecureRequests: null
        }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false
}));

// Granular Rate Limiters
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 300,
    message: {
        success: false,
        message: 'Həddindən artıq sorğu göndərilib. Zəhmət olmasa 15 dəqiqə sonra yenidən cəhd edin.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: 'Həddindən artıq cəhd edilib. Zəhmət olmasa 15 dəqiqə sonra yenidən cəhd edin.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

const uploadLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 20,
    message: {
        success: false,
        message: 'Qısa müddətdə çox sayda fayl yükləndi. Zəhmət olmasa 10 dəqiqə sonra yenidən cəhd edin.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Bind rate limiters to matching routes
app.use('/api', generalLimiter);
app.use('/api/v1/auth', authLimiter);
app.use('/api/v1/upload', uploadLimiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploads)
import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const uploadDir = isProduction 
    ? '/data/uploads' 
    : path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve static files (uploads)
app.use('/uploads', express.static(uploadDir));

// Routes (API)
app.use(routes);

// ─── Serve Built Frontend Apps (Production) ──────────────────────────
const DIST_PATH = path.join(__dirname, '../front/dist');

const noCacheOptions = {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        }
    }
};

// 1. Vendor Portal (Subpath /vendor)
app.use('/vendor', express.static(path.join(DIST_PATH, 'vendor'), noCacheOptions));
app.get(/^\/vendor(\/.*)?$/, (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.sendFile(path.join(DIST_PATH, 'vendor/index.html'));
});

// 2. Admin Portal (Subpath /admin)
app.use('/admin', express.static(path.join(DIST_PATH, 'admin'), noCacheOptions));
app.get(/^\/admin(\/.*)?$/, (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.sendFile(path.join(DIST_PATH, 'admin/index.html'));
});

// 3. Web (Main App at Root)
app.use(express.static(DIST_PATH, noCacheOptions));
app.get(/^((?!\/uploads|\/api).)*$/, (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.sendFile(path.join(DIST_PATH, 'index.html'));
});

// Error handler (must be last)
app.use(errorMiddleware);

export default app;
