export type DiscountType = 'percentage' | 'fixed';

export interface AdminPromotion {
    id: string;
    code: string;
    description?: string;
    discountType: DiscountType;
    discountValue: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
    usageLimit: number;
    usageCount: number;
    createdAt: string;
}

export interface PromotionCreateInput {
    code: string;
    description?: string;
    discountType: DiscountType;
    discountValue: number;
    startDate: string;
    endDate: string;
    usageLimit: number;
}

export interface AdminPromotionsResponse {
    success: boolean;
    count: number;
    data: AdminPromotion[];
}

export interface AdminPromotionActionResponse {
    success: boolean;
    message: string;
    data?: AdminPromotion;
}
