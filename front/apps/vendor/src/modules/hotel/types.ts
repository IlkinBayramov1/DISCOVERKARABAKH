export interface IHotel {
    id: string;
    name: string;
    slug?: string | null;
    description: string;
    starRating?: number | null;
    propertyType: string;
    city?: string | null;
    address: string;
    latitude?: number | null;
    longitude?: number | null;
    googleMapsUrl?: string | null;
    phone?: string | null;
    email?: string | null;
    status: string;
    isFeatured?: boolean;
    checkInTime?: string | null;
    checkOutTime?: string | null;
    cancellationPolicy?: string | null;
    childPolicy?: string | null;
    petPolicy?: string | null;
    rating?: number;
    reviewCount?: number;
    startingPrice?: number;
    nearbyPOIs?: IHotelPOI[];
    amenities?: { amenity: { name: string } }[];
    images?: { id?: string; url: string; order: number }[];
    roomTypes?: IRoomType[];
    createdAt?: string;
    updatedAt?: string;
}

export interface IHotelPOI {
    id: string;
    distance: number;
    calculatedDistance?: number;
    description?: string;
    order: number;
    attraction: {
        id: string;
        name: string;
        latitude: number;
        longitude: number;
    };
}

export interface IHotelPayload {
    name: string;
    description: string;
    propertyType: string;
    starRating?: number;
    city: string;
    address: string;
    latitude?: number;
    longitude?: number;
    googleMapsUrl?: string;
    phone?: string;
    email?: string;
    checkInTime?: string;
    checkOutTime?: string;
    cancellationPolicy?: string;
    childPolicy?: string;
    petPolicy?: string;
    amenities?: string[];
    images?: string[];
    nearbyPOIs?: { attractionId: string; distance?: number; description?: string; order: number }[];
}

export interface IRoomType {
    id: string;
    name: string;
    description?: string;
    maxAdults: number;
    maxChildren: number;
    baseOccupancy: number;
    bedType?: string;
    roomSizeM2?: number;
    totalInventory: number;
    category?: string;
    hotelId: string;
    basePrice?: number | null; // Added for UI consistency
    roomAmenities?: IRoomAmenity[];
    images?: { id?: string; url: string; order: number }[];
    physicalRooms?: IPhysicalRoom[];
}

export interface IRoomAmenity {
    amenityName: string;
    category?: string;
}

export interface IRoomTypePayload {
    name: string;
    description?: string;
    maxAdults: number;
    maxChildren?: number;
    baseOccupancy: number;
    bedType?: string;
    roomSizeM2?: number;
    totalInventory: number;
    basePrice?: number;
    category?: string;
    amenities?: { name: string; category?: string }[];
    images?: string[];
}

export type PhysicalRoomStatus = 'AVAILABLE' | 'DIRTY' | 'CLEANING' | 'OUT_OF_ORDER';

export interface IPhysicalRoom {
    id: string;
    roomNumber: string;
    floor?: string;
    status: PhysicalRoomStatus;
    housekeepingNote?: string;
    lastCleanedAt?: string;
    roomTypeId: string;
}

export interface IPhysicalRoomPayload {
    roomNumber: string;
    floor?: string;
    roomTypeId: string;
    status?: PhysicalRoomStatus;
    housekeepingNote?: string;
}

export interface IPhysicalRoomBulkPayload {
    roomTypeId: string;
    floor?: string;
    startNumber: number;
    endNumber: number;
    prefix?: string;
}

export interface IHotelDailyStat {
    id: string;
    date: string;
    impressions: number;
    clicks: number;
    totalBookings: number;
    totalRevenue: number;
}

export interface IReviewItem {
    id: string;
    rating: number;
    comment?: string;
    vendorReply?: string | null;
    createdAt: string;
    user: {
        email: string;
        firstName?: string;
        lastName?: string;
    };
    hotel?: {
        id: string;
        name: string;
    };
    roomType?: {
        id: string;
        name: string;
    };
}

export interface IRoomReview {
    id: string;
    rating: number;
    comment?: string | null;
    vendorReply?: string | null;
    createdAt: string;
    user: {
        email: string;
    };
}

export interface IRoomReviewPayload {
    rating: number;
    comment: string;
}

export interface IBooking {
    id: string;
    bookingNumber: string;
    bookingType: 'hotel' | 'tour' | 'event';
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'pending_payment' | 'draft';
    paymentStatus: 'pending' | 'captured' | 'refunded' | 'failed';
    paymentMethod?: string;
    totalPrice: number;
    currency: string;
    paymentUrl?: string | null;
    specialRequests?: string | null;
    createdAt: string;
    userId: string;
    user?: {
        email: string;
        firstName?: string;
        lastName?: string;
        phone?: string;
    };
    hotel?: {
        id: string;
        name: string;
    };
    items?: IBookingItem[];
    guests?: IBookingGuest[];
}

export interface IBookingItem {
    id: string;
    roomTypeId?: string | null;
    checkIn?: string | null;
    checkOut?: string | null;
    adults: number;
    children: number;
    price: number;
    roomType?: {
        name: string;
    };
}

export interface IBookingGuest {
    id: string;
    firstName: string;
    lastName: string;
    email?: string | null;
    phone?: string | null;
}

// Pricing & Inventory Locking
export interface IPricingCalculationRequest {
    items: IBookingItem[];
    couponCode?: string | null;
}

export interface IPricingCalculationResponse {
    grossTotal: number;
    discountAmount: number;
    discountDetails?: {
        id: string;
        code: string;
        name: string;
    } | null;
    totalAfterDiscount: number;
    taxes: ITaxItem[];
    totalTaxes: number;
    exactTotal: number;
    breakdowns: IRoomStayBreakdown[];
}

export interface ITaxItem {
    name: string;
    type: string;
    value: number;
    amount: number;
}

export interface IRoomStayBreakdown {
    roomTypeId: string;
    subtotal: number;
    log: INightlyPriceLog[];
}

export interface INightlyPriceLog {
    date: string;
    originalPrice: number;
    finalPrice: number;
    isAdjusted: boolean;
    occupancyAtBooking: number;
    currency: string;
}

export interface IInventoryLockRequest {
    roomTypeId: string;
    startDate: string;
    endDate: string;
}

export interface IInventoryLockResponse {
    lockId: string;
    expiresAt: string;
}

export interface ICouponValidation {
    isValid: boolean;
    code: string;
    name: string;
    discountAmount: number;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
}

export interface ITaxRule {
    id: string;
    name: string;
    type: 'percentage' | 'fixed_per_stay' | 'fixed_per_night' | 'fixed_per_person_per_night';
    value: number;
    hotelId?: string | null;
}

// Calendar & Pricing
export interface IRoomCalendar {
    roomTypeId: string;
    roomTypeName: string;
    totalInventory: number;
    days: IDailyCalendarData[];
}

export interface IDailyCalendarData {
    date: string;
    basePrice: number | null;
    minStay: number;
    maxStay: number | null;
    isStopped: boolean;
    availableRooms: number;
    reservedRooms: number;
    occupancyRate?: number;
    isLowInventory?: boolean;
    closedToArrival: boolean;
    closedToDeparture: boolean;
    activeRestrictions?: ('SS' | 'CTA' | 'CTD' | 'MLOS')[];
}

export interface ICalendarBulkUpdate {
    roomTypeId: string;
    startDate: string;
    endDate: string;
    days?: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun')[];
    basePrice?: number;
    priceAdjustment?: {
        type: 'percentage' | 'fixed';
        value: number;
    };
    availableRooms?: number;
    minStay?: number;
    maxStay?: number | null;
    isStopped?: boolean;
    closedToArrival?: boolean;
    closedToDeparture?: boolean;
}

export interface ICalendarNote {
    id: string;
    date: string;
    note: string;
    type: 'info' | 'warning' | 'success' | 'event';
}

// Payment
export interface IPaymentTransaction {
    id: string;
    bookingId: string;
    provider: 'local' | 'pasha' | 'kapital';
    providerTransId?: string | null;
    amount: number;
    currency: string;
    status: 'pending' | 'success' | 'failed' | 'reversed';
    paymentUrl?: string | null;
    createdAt: string;
    updatedAt: string;
}
// Analytics
export interface IAnalyticsSummary {
    totalRevenue: number;
    bookingCount: number;
    cancellationCount: number;
    occupancyRate: number;
}

export interface IAnalyticsResponse {
    summary: IAnalyticsSummary;
    trends: {
        revenue: Array<{
            date: string;
            amount: number;
        }>;
    };
}

// Revenue & Pricing Rules
export interface IPricingRule {
    id: string;
    roomTypeId?: string | null;
    name: string;
    type: 'WEEKEND' | 'SEASONAL' | 'HOLIDAY' | 'OCCUPANCY_BASED' | 'SPECIAL';
    adjustment: 'PERCENTAGE' | 'FIXED_OVERRIDE' | 'FIXED_ADDITION';
    value: number;
    startDate?: string;
    endDate?: string;
    daysOfWeek?: string;
    occupancyThreshold?: number;
    priority: number;
    isActive: boolean;
}

export interface IPricingRulePayload {
    name: string;
    roomTypeId?: string | null;
    type: 'WEEKEND' | 'SEASONAL' | 'HOLIDAY' | 'OCCUPANCY_BASED' | 'SPECIAL';
    adjustment: 'PERCENTAGE' | 'FIXED_OVERRIDE' | 'FIXED_ADDITION';
    value: number;
    startDate?: string;
    endDate?: string;
    daysOfWeek?: string;
    occupancyThreshold?: number;
    priority?: number;
    isActive?: boolean;
}

// Constants & Metadata
export interface IAmenityDefinition {
    icon: string;
    category: string;
}

// Fraud & Blacklist
export interface IBlacklist {
    id: string;
    type: 'email' | 'phone' | 'ip';
    value: string;
    reason?: string | null;
    createdAt: string;
}

export interface IBlacklistPayload {
    type: 'email' | 'phone' | 'ip';
    value: string;
    reason: string;
}

export interface IFraudRiskLog {
    id: string;
    action: string;
    details: {
        score: number;
        reasons: string[];
        isApproved: boolean;
    };
    context: Record<string, any>;
    createdAt: string;
}

// System Events
export type HotelEventType = 
    | 'hotel:created' 
    | 'hotel:deleted' 
    | 'pricing:updated' 
    | 'availability:updated'
    | 'roomType:created'
    | 'roomType:updated'
    | 'roomType:deleted'
    | 'room:inventory:depleted'
    | 'reservation:created'
    | 'reservation:cancelled'
    | 'review:created';

export interface IHotelEventPayload {
    hotelId: string;
    name?: string;
    roomTypeId?: string;
    bookingId?: string;
    reviewId?: string;
    [key: string]: any;
}
