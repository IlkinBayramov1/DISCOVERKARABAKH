import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ApiError } from '../core/api.error.js';
import env from '../config/env.js';

const isProduction = env.nodeEnv === 'production';
const hasR2 = env.s3 && env.s3.endpoint && env.s3.accessKeyId && env.s3.secretAccessKey && env.s3.bucketName;

let storage;

if (isProduction || hasR2) {
    // RAM storage for direct streaming to Cloudflare R2 / S3
    storage = multer.memoryStorage();
    console.log('📦 Multer: Cloud storage mode (memory storage) initialized.');
} else {
    // Disk storage fallback for local development
    const uploadDir = path.join(process.cwd(), 'uploads');
    
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadDir);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path.extname(file.originalname);
            cb(null, file.fieldname + '-' + uniqueSuffix + ext);
        }
    });
    console.log('📂 Multer: Local storage mode (disk storage) initialized.');
}

const fileFilter = (req, file, cb) => {
    // Allow images, PDFs, and audio guides
    const allowedTypes = [
        'image/',       // all images (jpg, png, webp, etc.)
        'application/pdf',
        'audio/'        // audio guides (mp3, wav, etc.)
    ];
    
    const isAllowed = allowedTypes.some(type => {
        if (type.endsWith('/')) {
            return file.mimetype.startsWith(type);
        }
        return file.mimetype === type;
    });

    if (isAllowed) {
        cb(null, true);
    } else {
        cb(new ApiError(400, 'Yalnız şəkil, PDF və səs fayllarına icazə verilir!'), false);
    }
};

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 20 * 1024 * 1024 // 20MB limit per file
    },
    fileFilter: fileFilter
});
