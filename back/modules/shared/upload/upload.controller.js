import { ApiError } from '../../../core/api.error.js';

class UploadController {
    uploadImages = async (req, res, next) => {
        try {
            if (!req.files || req.files.length === 0) {
                throw ApiError.badRequest('No files were uploaded.');
            }

            const fileUrls = req.files.map(file => {
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

    uploadSingle = async (req, res, next) => {
        try {
            if (!req.file) {
                throw ApiError.badRequest('No file was uploaded.');
            }

            const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

            res.json({
                success: true,
                url: fileUrl
            });
        } catch (error) {
            next(error);
        }
    };
}

export const uploadController = new UploadController();
