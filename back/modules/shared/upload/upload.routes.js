import { Router } from 'express';
import { upload } from '../../../middlewares/upload.middleware.js';
import { uploadController } from './upload.controller.js';
import { authMiddleware } from '../../../middlewares/auth.middleware.js'; // Require login to upload

const router = Router();

// Endpoint for uploading multiple images
// We use 'images' as the form-data key
router.post('/', authMiddleware, upload.array('images', 10), uploadController.uploadImages);

export default router;
