import { ApiError } from '../../../core/api.error.js';

class UploadController {
    uploadImages = async (req, res, next) => {
        try {
            if (!req.files || req.files.length === 0) {
                throw ApiError.badRequest('No files were uploaded.');
            }

            // Map standard multer files format into full accessible static URLs
            const fileUrls = req.files.map(file => {
                // req.headers.host contains the domain/port e.g. localhost:3000
                // req.protocol contains HTTP/HTTPS
                return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
            });

            res.json({
                success: true,
                urls: fileUrls
            });
        } catch (error) {
            next(error);
        }
    };
}

export const uploadController = new UploadController();
