export interface IHotelAmenity {
    id: string;
    name: string;
    icon?: string;
}

export interface IRoomImage {
    id: string;
    url: string;
    order: number;
}

export interface IRoomAmenity {
    id: string;
    amenityName: string;
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
    images?: IRoomImage[];
    roomAmenities?: IRoomAmenity[];
    // To be used conceptually if daily pricing is fetched, otherwise UI can show standard info
    basePrice?: number;
}

export interface IHotel {
    id: string;
    name: string;
    slug?: string;
    description: string;
    address: string;
    city?: string;
    propertyType: string;

    starRating?: number; 
    rating?: number;     
    reviewCount?: number;

    latitude?: number;
    longitude?: number;
    googleMapsUrl?: string;
    phone?: string;
    email?: string;

    status: string;

    images?: Array<{ id: string; url: string; order: number }>;
    amenities?: IHotelAmenity[];
    
    // --- BU HİSSƏNİ ƏLAVƏ ET VƏ YA YENİLƏ ---
    roomTypes?: IRoomType[];   // Otaqların qiymətini hesablamaq üçün mütləq olmalıdır
    startingPrice?: number;    // API-dan gələn alternativ qiymət sahəsi
    lowestPrice?: number;      // Mövcud olan sahə
    // ---------------------------------------

    policies?: {
        checkInTime?: string;
        checkOutTime?: string;
        [key: string]: any;
    };
}

export interface ICouponValidation {
    isValid: boolean;
    code: string;
    name: string;
    discountAmount: number;
    discountType: string;
    discountValue: number;
}

export interface IRoomReviewCreate {
    rating: number;
    comment?: string;
}

export interface IRoomReview {
    id: string;
    userId: string;
    roomTypeId: string;
    rating: number;
    comment?: string;
    createdAt: string;
    user?: {
        email: string;
    };
}

export interface IBookingItem {
    roomTypeId: string;
    ratePlanId?: string;
    checkIn: string;
    checkOut: string;
    adults?: number;
    children?: number;
}

export interface IPricingCalculationRequest {
    items: IBookingItem[];
    couponCode?: string;
}

export interface INightlyPriceLog {
    date: string;
    originalPrice: number;
    finalPrice: number;
    isAdjusted: boolean;
    occupancyAtBooking: number;
    currency?: string;
}

export interface IRoomStayBreakdown {
    roomTypeId: string;
    subtotal: number;
    log: INightlyPriceLog[];
}

export interface ITaxItem {
    name: string;
    type: string;
    value: number;
    amount: number;
}

export interface IPricingCalculationResponse {
    grossTotal: number;
    discountAmount: number;
    discountDetails?: {
        id: string;
        code: string;
        name: string;
    };
    totalAfterDiscount: number;
    taxes: ITaxItem[];
    totalTaxes: number;
    exactTotal: number;
    currency?: string;
    breakdowns: IRoomStayBreakdown[];
}

export interface IInventoryLockRequest {
    roomTypeId: string;
    startDate: string;
    endDate: string;
}

export interface IInventoryLock {
    id: string;
    roomTypeId: string;
    userId: string;
    startDate: string;
    endDate: string;
    expiresAt: string;
}

