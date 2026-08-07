import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import env from '../../../config/env.js';
import { ApiError } from '../../../core/api.error.js';
import path from 'path';
import fs from 'fs';

const hasR2 = env.s3 && env.s3.endpoint && env.s3.accessKeyId && env.s3.secretAccessKey && env.s3.bucketName;

let s3Client = null;
if (hasR2) {
    s3Client = new S3Client({
        endpoint: env.s3.endpoint,
        region: 'auto',
        credentials: {
            accessKeyId: env.s3.accessKeyId,
            secretAccessKey: env.s3.secretAccessKey
        }
    });
}

/**
 * Helper to upload a single file to storage (R2/S3 or Local Disk)
 */
export const uploadFileToStorage = async (file, isPrivate = false) => {
    let fileBuffer = file.buffer;
    let ext = path.extname(file.originalname).toLowerCase();
    let contentType = file.mimetype;

    // Automatic Sharp image compression for uploaded vendor/user images
    if (file.mimetype.startsWith('image/') && ext !== '.svg') {
        try {
            const sharp = (await import('sharp')).default;
            fileBuffer = await sharp(file.buffer || fs.readFileSync(file.path))
                .resize({ width: 1600, withoutEnlargement: true })
                .webp({ quality: 80 })
                .toBuffer();
            ext = '.webp';
            contentType = 'image/webp';
        } catch (sharpErr) {
            console.warn('Sharp compression skipped:', sharpErr.message);
        }
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = `${file.fieldname}-${uniqueSuffix}${ext}`;
    const prefix = isPrivate ? 'private' : 'public';
    const key = `${prefix}/${fileName}`;

    if (hasR2 && s3Client) {
        if (!fileBuffer) {
            throw new Error('File buffer is empty. Memory storage is required for R2 uploads.');
        }

        const command = new PutObjectCommand({
            Bucket: env.s3.bucketName,
            Key: key,
            Body: fileBuffer,
            ContentType: contentType
        });

        await s3Client.send(command);

        if (isPrivate) {
            return {
                url: key,
                key: key,
                isPrivate: true
            };
        } else {
            const publicUrl = env.s3.publicUrl.endsWith('/') ? env.s3.publicUrl : `${env.s3.publicUrl}/`;
            return {
                url: `${publicUrl}${key}`,
                key: key,
                isPrivate: false
            };
        }
    } else {
        // Local Disk Fallback
        const uploadDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const localPath = path.join(uploadDir, fileName);
        if (fileBuffer) {
            fs.writeFileSync(localPath, fileBuffer);
        } else if (file.path) {
            fs.renameSync(file.path, localPath);
        }

        const localUrl = `/uploads/${fileName}`;
        return {
            url: localUrl,
            key: key,
            isPrivate: isPrivate
        };
    }
};

/**
 * Helper to generate secure temporary download link for private files
 */
export const getDownloadUrl = async (key) => {
    if (!key) return null;
    
    // If not S3/R2 or file is stored locally, return direct local path
    if (!hasR2 || !s3Client) {
        return key.startsWith('/') ? key : `/uploads/${path.basename(key)}`;
    }

    if (key.startsWith('public/')) {
        const publicUrl = env.s3.publicUrl.endsWith('/') ? env.s3.publicUrl : `${env.s3.publicUrl}/`;
        return `${publicUrl}${key}`;
    }

    const command = new GetObjectCommand({
        Bucket: env.s3.bucketName,
        Key: key
    });

    try {
        // Signed URL expires in 15 minutes (900 seconds)
        return await getSignedUrl(s3Client, command, { expiresIn: 900 });
    } catch (err) {
        console.error('Error generating presigned URL:', err);
        throw ApiError.internal('Məxfi fayl linki yaradıla bilmədi.');
    }
};

class UploadController {
    uploadImages = async (req, res, next) => {
        try {
            const isPrivate = req.query.private === 'true';
            
            if (!req.files || req.files.length === 0) {
                throw ApiError.badRequest('Yükləmək üçün fayl seçilməyib.');
            }

            const uploadPromises = req.files.map(file => uploadFileToStorage(file, isPrivate));
            const results = await Promise.all(uploadPromises);
            const urls = results.map(f => f.url);

            res.json({
                success: true,
                files: results,
                urls: urls
            });
        } catch (error) {
            next(error);
        }
    };

    uploadSingle = async (req, res, next) => {
        try {
            const isPrivate = req.query.private === 'true';

            if (!req.file) {
                throw ApiError.badRequest('Yükləmək üçün fayl seçilməyib.');
            }

            const result = await uploadFileToStorage(req.file, isPrivate);

            res.json({
                success: true,
                file: result,
                url: result.url
            });
        } catch (error) {
            next(error);
        }
    };

    getSecureUrl = async (req, res, next) => {
        try {
            const { key } = req.query;
            if (!key) {
                throw ApiError.badRequest('Fayl açarı (key) vacibdir.');
            }

            const secureUrl = await getDownloadUrl(key);

            res.json({
                success: true,
                url: secureUrl
            });
        } catch (error) {
            next(error);
        }
    };
}

export const uploadController = new UploadController();
