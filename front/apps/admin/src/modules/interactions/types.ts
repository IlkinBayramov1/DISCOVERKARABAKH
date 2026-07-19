export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'flagged';

export interface AdminReview {
    id: string;
    rating: number;
    comment: string;
    status: ReviewStatus;
    createdAt: string;
    userEmail: string;
    businessName: string;
    businessType: string;
}

export interface AdminReport {
    id: string;
    reviewId: string;
    reviewType: string;
    reason: string;
    customNote?: string;
    status: 'pending' | 'resolved' | 'dismissed';
    createdAt: string;
    reporterEmail: string;
    reviewDetail: {
        userEmail: string;
        comment: string;
        rating: number;
        businessName: string;
        businessType: string;
    };
}

export interface AdminReviewsResponse {
    success: boolean;
    count: number;
    data: AdminReview[];
}

export interface AdminReviewActionResponse {
    success: boolean;
    message: string;
    data?: AdminReview;
}
