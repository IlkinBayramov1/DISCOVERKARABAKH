export type BusinessType = 'hotel' | 'tour' | 'attraction' | 'utility' | 'transport';
export type BusinessStatus = 'pending' | 'active' | 'rejected' | 'draft' | 'inactive';
export type UserRole = 'user' | 'vendor' | 'tourist' | 'resident' | 'investor' | 'admin' | 'driver';

export interface UserOwner {
    email: string;
    phone: string;
    firstName?: string;
    lastName?: string;
    balance?: number;
}

export interface Review {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    user?: {
        firstName: string;
        lastName: string;
        email: string;
    };
}

export interface Booking {
    id: string;
    status: string;
    totalAmount: number;
    createdAt: string;
    user?: {
        email: string;
        phone: string;
    };
}

export interface AdminBusiness {
    id: string;
    name?: string;
    fileName?: string;
    batchId?: string;
    type?: BusinessType;
    bizType?: BusinessType;
    status?: BusinessStatus | string;
    address?: string;
    city?: string;
    rating?: number;
    owner?: UserOwner;
    user?: UserOwner;
    admin?: any;
    createdAt: string;
    booking?: Booking[];
    review?: Review[];
    starRating?: number;
    brand?: string;
    model?: string;
    plateNumber?: string;
    seats?: number;
    price?: number | null;
    entryType?: string;
    totalAmount?: number;
    totalPaid?: number;
    description?: string | null;
    year?: number;
    color?: string;
    images?: any[];
    rowCount?: number;
    successCount?: number;
    errorCount?: number;
    bills?: UtilityBill[];
    isRolledBack?: boolean;
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
        tours: Tour[];
        attractions: Attraction[];
        utility: UtilityUploadLog[];
        transport: Vehicle[];
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

export interface Attraction {
    id: string;
    name: string;
    slug: string;
    description: string;
    city: string;
    address: string;
    status: BusinessStatus;
    rating: number;
    reviewCount: number;
    price: number | null;
    entryType: string;
    owner?: UserOwner;
    user?: UserOwner;
    createdAt: string;
    booking?: Booking[];
    review?: Review[];
}

export interface UtilityBill {
    id: string;
    abonentCode: string;
    utilityType: string;
    amount: number;
    paidAmount: number;
    dueDate: string;
    status: string;
    billingMonth: string;
}

export interface UtilityUploadLog {
    id: string;
    batchId: string;
    fileName: string;
    rowCount: number;
    successCount: number;
    errorCount: number;
    isRolledBack: boolean;
    rolledBackAt: string | null;
    createdAt: string;
    totalAmount?: number;
    totalPaid?: number;
    bills?: UtilityBill[];
    admin?: {
        email: string;
        phone: string;
        firstName?: string;
        lastName?: string;
    };
}

export interface Vehicle {
    id: string;
    brand: string;
    model: string;
    year: number;
    color: string;
    plateNumber: string;
    category: string;
    seats: number;
    luggage: number;
    description: string | null;
    status: string;
    basePrice: number | null;
    pricePerKm: number | null;
    owner?: UserOwner;
    user?: UserOwner;
    createdAt: string;
    booking?: Booking[];
    ride?: any[];
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
    vendorprofile?: {
        companyName: string;
        category: string;
    };
    _count?: {
        hotel: number;
        restaurant: number;
        tour: number;
        vehicle: number;
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

