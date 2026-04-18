export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'flagged';

export interface AdminReview {
    id: string;
    rating: number;
    comment: string;
    status: ReviewStatus;
    user: {
        id: string;
        email: string;
        fullName?: string;
    };
    target: {
        id: string;
        name: string;
        type: 'hotel' | 'restaurant' | 'tour';
    };
    createdAt: string;
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
