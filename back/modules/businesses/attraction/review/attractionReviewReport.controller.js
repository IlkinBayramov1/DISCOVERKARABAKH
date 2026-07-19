import { attractionReviewReportService } from './attractionReviewReport.service.js';
import { successResponse } from '../../../../core/api.response.js';

class AttractionReviewReportController {
    async createReport(req, res, next) {
        try {
            const result = await attractionReviewReportService.createReport(req.user.id, req.params.reviewId, req.body);
            return successResponse(res, result, { message: 'Review reported successfully' });
        } catch (error) {
            next(error);
        }
    }

    async getReports(req, res, next) {
        try {
            const reports = await attractionReviewReportService.getAllReports(req.query);
            return successResponse(res, reports);
        } catch (error) {
            next(error);
        }
    }

    async updateStatus(req, res, next) {
        try {
            const result = await attractionReviewReportService.updateReportStatus(req.params.reportId, req.body.status);
            return successResponse(res, result);
        } catch (error) {
            next(error);
        }
    }
}

export const attractionReviewReportController = new AttractionReviewReportController();
