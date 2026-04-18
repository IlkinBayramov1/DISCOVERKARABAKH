export type PayoutStatus = 'pending' | 'processed' | 'failed';

export interface AdminRevenueReport {
    totalRevenue: number;
    platformCommission: number;
    vendorPayouts: number;
    taxAmount: number;
    period: string;
    currency: string;
}

export interface AdminPayout {
    id: string;
    vendorId: string;
    vendorName: string;
    amount: number;
    currency: string;
    status: PayoutStatus;
    bankDetails?: any;
    processedAt?: string;
    createdAt: string;
}

export interface AdminRevenueReportResponse {
    success: boolean;
    data: AdminRevenueReport;
}

export interface AdminPayoutsResponse {
    success: boolean;
    count: number;
    data: AdminPayout[];
}

export interface AdminPayoutActionResponse {
    success: boolean;
    message: string;
    data?: AdminPayout;
}
