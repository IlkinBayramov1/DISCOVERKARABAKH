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
    pagination?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    } | null;
    data: AdminTransaction[];
}

export interface AdminTransactionDetailResponse {
    success: boolean;
    data: AdminTransaction;
}

export interface CompanyFinanceStats {
    entityId: string;
    type: string;
    name: string;
    city?: string | null;
    vendorEmail?: string | null;
    bookingsCount: number;
    grossTurnover: number;
    totalRefunds: number;
    netTurnover: number;
}

export interface CompanyFinanceStatsResponse {
    success: boolean;
    data: CompanyFinanceStats[];
}

export interface UserFinanceStats {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    role: string;
    balance: number;
    cardSpend: number;
    walletSpend: number;
    totalSpent: number;
    totalDeposits: number;
    totalWithdrawals: number;
}

export interface UserFinanceStatsResponse {
    success: boolean;
    data: UserFinanceStats[];
}

export interface UserFinancialDetails {
    user: {
        id: string;
        email: string;
        firstName?: string | null;
        lastName?: string | null;
        role: string;
        balance: number;
        createdAt: string;
    };
    walletTransactions: {
        id: string;
        type: 'deposit' | 'withdrawal' | 'payment';
        amount: number;
        currency: string;
        status: string;
        description?: string | null;
        createdAt: string;
    }[];
    cardTransactions: {
        id: string;
        amount: number;
        currency: string;
        provider: string;
        providerTransId?: string | null;
        status: string;
        booking?: {
            bookingNumber: string;
            bookingType: string;
            totalPrice: number;
            currency: string;
        } | null;
        createdAt: string;
    }[];
    bookings: {
        id: string;
        bookingNumber: string;
        bookingType: string;
        status: string;
        totalPrice: number;
        currency: string;
        createdAt: string;
        startDate?: string | null;
        endDate?: string | null;
        businessName: string;
    }[];
}

export interface UserFinancialDetailsResponse {
    success: boolean;
    data: UserFinancialDetails;
}
