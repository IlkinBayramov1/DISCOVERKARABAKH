export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface AdminTransaction {
    id: string;
    bookingId: string;
    amount: number;
    currency: string;
    provider: string;
    providerTransId?: string;
    status: TransactionStatus;
    booking?: {
        bookingNumber: string;
        totalPrice: number;
        currency: string;
        user: {
            email: string;
        };
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
