export interface StatItem {
    value: number | string;
    growth: number;
    isUp: boolean;
}

export interface DashboardStats {
    totalUsers: StatItem;
    activeVendors: StatItem;
    pendingBusinesses: StatItem;
    monthlyRevenue: StatItem;
}

export interface RecentActivity {
    id: string;
    title: string;
    description: string;
    type: 'business_approval' | 'new_booking' | 'fraud_alert' | 'review_flag';
    status: 'pending' | 'completed' | 'warning';
    timestamp: string;
}

export interface RevenueTrend {
    date: string;
    amount: number;
}

export interface AnalyticsResponse {
    success: boolean;
    data: {
        stats: DashboardStats;
        recentActivity: RecentActivity[];
        revenueTrends: RevenueTrend[];
    };
}
