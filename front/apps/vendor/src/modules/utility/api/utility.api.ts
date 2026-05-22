import { httpClient } from '@/shared/api/httpClient';

export interface UtilityBillPreview {
    abonentCode: string;
    residentName: string;
    amount: number;
    dueDate: string;
    billingMonth: string;
}

export interface ExcelUploadResponse {
    success: boolean;
    preview?: UtilityBillPreview[];
    errors?: Array<{ row: number; error: string }>;
    rowCount?: number;
    utilityType?: string;
}

export interface UploadLogItem {
    id: string;
    batchId: string;
    fileName: string;
    rowCount: number;
    successCount: number;
    errorCount: number;
    isRolledBack: boolean;
    rolledBackAt: string | null;
    createdAt: string;
}

export interface SubscriberItem {
    id: string;
    abonentCode: string;
    residentName: string;
    localAddress: string | null;
    utilitybill: Array<{
        id: string;
        utilityType: string;
        amount: number;
        paidAmount: number;
        status: 'unpaid' | 'partially_paid' | 'paid';
        dueDate: string;
        billingMonth: string;
    }>;
}

export interface AnalyticsResponse {
    summary: {
        totalBilled: number;
        totalPaid: number;
        totalRemaining: number;
        overdueCount: number;
        collectionRate: number;
    };
    dailyChart: Array<{
        date: string;
        amount: number;
    }>;
}

export const utilityApi = {
    getAnalytics: () => {
        return httpClient<{ data: AnalyticsResponse }>('/utility/analytics');
    },

    getUploadLogs: () => {
        return httpClient<{ data: UploadLogItem[] }>('/utility/upload-logs');
    },

    getSubscribers: () => {
        return httpClient<{ data: SubscriberItem[] }>('/utility/subscribers');
    },

    uploadExcel: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return httpClient<{ data: ExcelUploadResponse }>('/utility/upload', {
            method: 'POST',
            body: formData
        });
    },

    confirmUpload: (batchId: string, preview: UtilityBillPreview[], fileName: string) => {
        return httpClient<{ success: boolean }>('/utility/confirm-upload', {
            method: 'POST',
            body: JSON.stringify({ batchId, preview, fileName })
        });
    },

    rollbackUpload: (batchId: string) => {
        return httpClient<{ success: boolean }>(`/utility/rollback-upload/${batchId}`, {
            method: 'DELETE'
        });
    }
};
