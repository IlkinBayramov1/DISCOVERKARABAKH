import prisma from '../../../../config/db.js';
import { ApiError } from '../../../../core/api.error.js';

class AttractionReviewReportService {
    /**
     * Create a report for a specific review.
     */
    async createReport(userId, reviewId, data) {
        const { reason, customNote } = data;

        // Verify review exists
        const review = await prisma.attractionreview.findUnique({
            where: { id: reviewId }
        });

        if (!review) throw ApiError.notFound('Məqalə/Rəy tapılmadı');

        const report = await prisma.reviewreport.create({
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
        const reportCount = await prisma.reviewreport.count({
            where: { reviewId, reviewType: 'attraction' }
        });

        if (reportCount >= 5) {
            await prisma.attractionreview.update({
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

        const reports = await prisma.reviewreport.findMany({
            where,
            include: {
                user: { select: { id: true, email: true, firstName: true, lastName: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        const populatedReports = await Promise.all(reports.map(async (report) => {
            let reviewUser = 'Anonymous';
            let reviewComment = '';
            let reviewRating = 0;
            let businessName = 'Naməlum';
            let businessType = report.reviewType;

            try {
                if (report.reviewType === 'attraction') {
                    const review = await prisma.attractionreview.findUnique({
                        where: { id: report.reviewId },
                        include: { 
                            user: { select: { email: true } }, 
                            attraction: { select: { name: true } } 
                        }
                    });
                    if (review) {
                        reviewUser = review.user?.email || 'Anonymous';
                        reviewComment = review.comment || '';
                        reviewRating = review.rating || 0;
                        businessName = review.attraction?.name || 'Naməlum';
                    }
                } else {
                    const review = await prisma.review.findUnique({
                        where: { id: report.reviewId },
                        include: {
                            user: { select: { email: true } },
                            hotel: { select: { name: true } },
                            restaurant: { select: { name: true } },
                            tour: { select: { name: true } },
                            event: { select: { title: true } },
                            attraction: { select: { name: true } }
                        }
                    });
                    if (review) {
                        reviewUser = review.user?.email || 'Anonymous';
                        reviewComment = review.comment || '';
                        reviewRating = review.rating || 0;
                        if (review.hotel) {
                            businessName = review.hotel.name;
                            businessType = 'hotel';
                        } else if (review.tour) {
                            businessName = review.tour.name;
                            businessType = 'tour';
                        } else if (review.restaurant) {
                            businessName = review.restaurant.name;
                            businessType = 'restaurant';
                        } else if (review.event) {
                            businessName = review.event.title;
                            businessType = 'event';
                        } else if (review.attraction) {
                            businessName = review.attraction.name;
                            businessType = 'attraction';
                        }
                    }
                }
            } catch (err) {
                console.error(`Error populating review for report ${report.id}:`, err);
            }

            return {
                id: report.id,
                reviewId: report.reviewId,
                reviewType: report.reviewType,
                reason: report.reason,
                customNote: report.customNote,
                status: report.status,
                createdAt: report.createdAt,
                reporterEmail: report.user?.email || 'Anonymous',
                reviewDetail: {
                    userEmail: reviewUser,
                    comment: reviewComment,
                    rating: reviewRating,
                    businessName,
                    businessType
                }
            };
        }));

        return populatedReports;
    }

    /**
     * Resolve or dismiss a report.
     */
    async updateReportStatus(reportId, status) {
        const report = await prisma.reviewreport.findUnique({
            where: { id: reportId }
        });

        if (!report) throw ApiError.notFound('Şikayət tapılmadı');

        return await prisma.reviewreport.update({
            where: { id: reportId },
            data: { status }
        });
    }
}

export const attractionReviewReportService = new AttractionReviewReportService();
