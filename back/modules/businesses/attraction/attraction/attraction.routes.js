import { Router } from 'express';
import { attractionController } from './attraction.controller.js';
import { attractionValidation } from './attraction.validation.js';
import { validate } from '../../../../middlewares/validate.middleware.js';
import { authMiddleware, authorize, tryAuthMiddleware } from '../../../../middlewares/auth.middleware.js';

const router = Router();

// Publicly Cached Endpoints
router.get('/', tryAuthMiddleware, validate(attractionValidation.queryAttractions, 'query'), attractionController.getList);
router.get('/nearby', validate(attractionValidation.nearbyQuery, 'query'), attractionController.getNearby.bind(attractionController));
router.get('/weather', attractionController.getWeatherByCity.bind(attractionController));
router.get('/:id/weather', attractionController.getWeather.bind(attractionController));
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
