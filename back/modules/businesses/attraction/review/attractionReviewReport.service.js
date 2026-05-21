import prisma from '../../../../config/db.js';
import { ApiError } from '../../../../core/api.error.js';

class AttractionReviewReportService {
    /**
     * Create a report for a specific review.
     */
    async createReport(userId, reviewId, data) {
        const { reason, customNote } = data;

        // Verify review exists
        const review = await prisma.attractionReview.findUnique({
            where: { id: reviewId }
        });

        if (!review) throw ApiError.notFound('Məqalə/Rəy tapılmadı');

        const report = await prisma.reviewReport.create({
            data: {
                reviewId,
                reviewType: 'attraction',
                reporterId: userId,
                reason,
                customNote,
                status: 'pending'
            }
        });

        // Auto-moderation logic: If report count >= 5, set review status to 'pending' (hidden)
        const reportCount = await prisma.reviewReport.count({
            where: { reviewId, reviewType: 'attraction' }
        });

        if (reportCount >= 5) {
            await prisma.attractionReview.update({
                where: { id: reviewId },
                data: { status: 'under_review' }
            });
        }

        return report;
    }

    /**
     * Get all reports (for Admin).
     */
    async getAllReports(filters = {}) {
        const { status } = filters;
        const where = {};
        if (status) where.status = status;

        return await prisma.reviewReport.findMany({
            where,
            include: {
                reporter: { select: { id: true, email: true, firstName: true, lastName: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Resolve or dismiss a report.
     */
    async updateReportStatus(reportId, status) {
        const report = await prisma.reviewReport.findUnique({
            where: { id: reportId }
        });

        if (!report) throw ApiError.notFound('Şikayət tapılmadı');

        return await prisma.reviewReport.update({
            where: { id: reportId },
            data: { status }
        });
    }
}

export const attractionReviewReportService = new AttractionReviewReportService();
