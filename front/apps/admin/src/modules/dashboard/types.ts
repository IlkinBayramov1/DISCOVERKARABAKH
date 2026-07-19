export interface StatValue {
    total: number | null;
    active?: number | null;
    banned?: number | null;
}

export interface BookingStatValue {
    total: number | null;
    totalRevenue: number | null;
    byType: Array<{
        bookingType: string;
        _count: { id: number };
        _sum: { totalPrice: number };
    }>;
    recent: Array<{
        id: string;
        bookingNumber: string;
        bookingType: string;
        totalPrice: number;
        status: string;
        createdAt: string;
        user: {
            email: string;
            firstName: string;
            lastName: string;
        };
    }>;
}

export interface BusinessStatValue {
    totalHotels: number | null;
    totalTours: number | null;
    totalAttractions: number | null;
    pendingCount: number | null;
    pendingList: Array<{
        id: string;
        name: string;
        type: string;
        createdAt: string;
    }>;
}

export interface PaymentStatValue {
    totalTransactions: number | null;
    totalTurnover: number | null;
}

export interface PromoStatValue {
    totalPromocodes: number | null;
    totalPromotions: number | null;
}

export interface TransportStatValue {
    totalDrivers: number | null;
    totalVehicles: number | null;
}

export interface InteractionStatValue {
    totalReviews: number | null;
    pendingReports: number | null;
}

export interface FraudStatValue {
    blacklistCount: number | null;
    highRiskLogsCount: number | null;
}

export interface RevenueTrend {
    date: string;
    amount: number;
}

export interface AnalyticsResponse {
    success: boolean;
    data: {
        users: StatValue;
        bookings: BookingStatValue;
        businesses: BusinessStatValue;
        payments: PaymentStatValue;
        promotions: PromoStatValue;
        transport: TransportStatValue;
        interactions: InteractionStatValue;
        fraud: FraudStatValue;
        trends: RevenueTrend[];
    };
}
