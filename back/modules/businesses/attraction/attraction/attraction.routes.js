import { Router } from 'express';
import { attractionController } from './attraction.controller.js';
import { attractionValidation } from './attraction.validation.js';
import { validate } from '../../../../middlewares/validate.middleware.js';
import { authMiddleware, authorize } from '../../../../middlewares/auth.middleware.js';

const router = Router();

// Publicly Cached Endpoints
router.get('/', validate(attractionValidation.queryAttractions, 'query'), attractionController.getList);
router.get('/:id', attractionController.getById);

// Protected Modification Endpoints
router.use(authMiddleware);

// Only designated vendors or admins create attractions
router.post(
    '/',
    authorize('admin', 'vendor'),
    validate(attractionValidation.createAttraction),
    attractionController.create.bind(attractionController)
);

router.put(
    '/:id',
    authorize('admin', 'vendor'),
    validate(attractionValidation.updateAttraction),
    attractionController.update.bind(attractionController)
);

router.delete(
    '/:id',
    authorize('admin', 'vendor'),
    attractionController.delete.bind(attractionController)
);

export default router;
