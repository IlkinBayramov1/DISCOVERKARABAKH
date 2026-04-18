export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface AdminTransaction {
    id: string;
    bookingId: string;
    amount: number;
    currency: string;
    provider: string;
    providerTransactionId?: string;
    status: TransactionStatus;
    user: {
        email: string;
        fullName?: string;
    };
    meta?: any;
    createdAt: string;
}

export interface AdminTransactionsResponse {
    success: boolean;
    count: number;
    data: AdminTransaction[];
}

export interface AdminTransactionDetailResponse {
    success: boolean;
    data: AdminTransaction;
}
