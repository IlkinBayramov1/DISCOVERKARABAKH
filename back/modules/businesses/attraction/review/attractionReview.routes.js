import { Router } from 'express';
import { attractionReviewController } from './attractionReview.controller.js';
import { attractionReviewReportController } from './attractionReviewReport.controller.js';
import { attractionValidation } from '../attraction/attraction.validation.js';
import { validate } from '../../../../middlewares/validate.middleware.js';
import { authMiddleware, authorize } from '../../../../middlewares/auth.middleware.js';

const router = Router({ mergeParams: true });

// GET /api/v1/attractions/:id/reviews - PUBLIC
router.get('/', attractionReviewController.getByAttractionId);

// POST /api/v1/attractions/:id/reviews - PROTECTED
router.post('/', authMiddleware, validate(attractionValidation.review), attractionReviewController.create);

// PUT /api/v1/attractions/:id/reviews/:reviewId - PROTECTED
router.put('/:reviewId', authMiddleware, attractionReviewController.update);

// DELETE /api/v1/attractions/:id/reviews/:reviewId - PROTECTED
router.delete('/:reviewId', authMiddleware, attractionReviewController.delete);

// --- Reporting System ---

// POST /api/v1/attractions/:id/reviews/:reviewId/report
router.post('/:reviewId/report', authMiddleware, attractionReviewReportController.createReport);

// Admin-only: GET all reports
router.get('/reports', authMiddleware, authorize('admin'), attractionReviewReportController.getReports);

// Admin-only: PATCH status of a report
router.patch('/reports/:reportId', authMiddleware, authorize('admin'), attractionReviewReportController.updateStatus);

export default router;
