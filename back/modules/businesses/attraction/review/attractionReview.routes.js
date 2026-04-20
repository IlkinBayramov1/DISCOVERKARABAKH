import { Router } from 'express';
import { attractionReviewController } from './attractionReview.controller.js';
import { attractionReviewReportController } from './attractionReviewReport.controller.js';
import { attractionValidation } from '../attraction/attraction.validation.js';
import { validate } from '../../../../middlewares/validate.middleware.js';
import { authMiddleware, authorize } from '../../../../middlewares/auth.middleware.js';

const router = Router({ mergeParams: true });

// GET /api/v1/attractions/:id/reviews
router.get('/', attractionReviewController.getByAttractionId);

// Protected routes
router.use(authMiddleware);

// POST /api/v1/attractions/:id/reviews
router.post('/', validate(attractionValidation.review), attractionReviewController.create);

// PUT /api/v1/attractions/:id/reviews/:reviewId
router.put('/:reviewId', attractionReviewController.update);

// DELETE /api/v1/attractions/:id/reviews/:reviewId
router.delete('/:reviewId', attractionReviewController.delete);

// --- Reporting System ---

// POST /api/v1/attractions/:id/reviews/:reviewId/report
router.post('/:reviewId/report', attractionReviewReportController.createReport);

// Admin-only: GET all reports
router.get('/reports', authorize('admin'), attractionReviewReportController.getReports);

// Admin-only: PATCH status of a report
router.patch('/reports/:reportId', authorize('admin'), attractionReviewReportController.updateStatus);

export default router;
