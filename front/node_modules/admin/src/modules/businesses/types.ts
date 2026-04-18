export type BusinessType = 'hotel' | 'restaurant' | 'tour';
export type BusinessStatus = 'pending' | 'active' | 'rejected' | 'draft' | 'inactive';
export type UserRole = 'user' | 'vendor' | 'tourist' | 'resident' | 'investor' | 'admin' | 'driver';

// ... (existing interfaces)

export interface AdminBusiness {
    id: string;
    name: string;
    type: BusinessType;
    status: BusinessStatus;
    address: string;
    rating: number;
    owner: {
        email: string;
        phone: string;
    };
    createdAt: string;
}

export interface AdminBusinessResponse {
    success: boolean;
    count: number;
    data: AdminBusiness[];
}

export interface PendingBusinessesResponse {
    success: boolean;
    data: {
        hotels: Hotel[];
        restaurants: Restaurant[];
        tours: Tour[];
    };
}

export interface AdminBusinessActionResponse {
    success: boolean;
    message: string;
    data?: any;
}

export interface BusinessImage {
    url: string;
    order: number;
}

export interface BusinessAmenity {
    amenity: {
        name: string;
    }
}

export interface HotelRoomType {
    id: string;
    name: string;
    description: string;
    baseOccupancy: number;
    maxAdults: number;
    maxChildren: number;
    totalInventory: number;
    basePrice: number | null;
}

export interface Hotel {
    id: string;
    name: string;
    slug: string;
    description: string;
    starRating: number;
    propertyType: string;
    city: string;
    address: string;
    latitude: number;
    longitude: number;
    phone: string;
    email: string;
    status: BusinessStatus;
    rating: number;
    reviewCount: number;
    startingPrice: number;
    amenities: BusinessAmenity[];
    images: BusinessImage[];
    roomTypes: HotelRoomType[];
    owner?: {
        email: string;
        phone: string;
    };
    createdAt: string;
}

export interface Restaurant {
    id: string;
    name: string;
    description: string;
    city: string;
    address: string;
    status: BusinessStatus;
    owner?: {
        email: string;
        phone: string;
    };
    createdAt: string;
}

export interface Tour {
    id: string;
    name: string;
    description: string;
    city: string;
    status: BusinessStatus;
    owner?: {
        email: string;
        phone: string;
    };
    createdAt: string;
}

/**
 * User & Vendor Types
 */
export interface User {
    id: string;
    email: string;
    role: UserRole;
    isBanned: boolean;
    isApproved: boolean;
    createdAt: string;
    vendorProfile?: {
        companyName: string;
        category: string;
    };
    _count?: {
        hotels: number;
        restaurants: number;
        tours: number;
        vehicles: number;
    };
}

export type Vendor = User & { role: 'vendor' };

/**
 * Moderation & Fraud Types
 */
export interface BlacklistEntry {
    id: string;
    type: 'email' | 'phone' | 'ip';
    value: string;
    reason?: string;
    createdAt: string;
}

export interface BlacklistCreate {
    type: 'email' | 'phone' | 'ip';
    value: string;
    reason: string;
}

export interface FraudRiskLog {
    id: string;
    action: string;
    details: {
        score: number;
        reasons: string[];
        isApproved: boolean;
    };
    context: any;
    createdAt: string;
}

/**
 * Analytics Types
 */
export interface AnalyticsSummary {
    totalRevenue: number;
    bookingCount: number;
    cancellationCount: number;
    occupancyRate: number;
}

export interface RevenueTrend {
    date: string;
    amount: number;
}

export interface AnalyticsResponse {
    summary: AnalyticsSummary;
    trends: {
        revenue: RevenueTrend[];
    };
}

/**
 * Revenue Management Types
 */
export type PricingRuleType = 'WEEKEND' | 'SEASONAL' | 'HOLIDAY' | 'OCCUPANCY_BASED' | 'SPECIAL';
export type PricingAdjustmentType = 'PERCENTAGE' | 'FIXED_OVERRIDE' | 'FIXED_ADDITION';

export interface PricingRule {
    id: string;
    name: string;
    type: PricingRuleType;
    adjustment: PricingAdjustmentType;
    value: number;
    startDate: string;
    endDate: string;
    daysOfWeek?: string;
    occupancyThreshold?: number;
    priority: number;
    isActive: boolean;
}

export interface PricingRuleCreate {
    name: string;
    roomTypeId?: string;
    type: PricingRuleType;
    adjustment: PricingAdjustmentType;
    value: number;
    startDate: string;
    endDate: string;
    daysOfWeek?: string;
    occupancyThreshold?: number;
    priority: number;
}

export interface PendingBusinessesResponse {
    hotels: Hotel[];
    restaurants: Restaurant[];
    tours: Tour[];
}
