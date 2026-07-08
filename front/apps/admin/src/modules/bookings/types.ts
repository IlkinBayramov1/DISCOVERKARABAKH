export type BookingStatus = 'draft' | 'pending_payment' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show' | 'refunded';

export interface BookingItem {
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

export interface BookingGuest {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

export interface BookingAuditLog {
    id: string;
    action: string;
    meta: any;
    createdAt: string;
}

export interface AdminBooking {
    id: string;
    bookingNumber: string;
    bookingType: string;
    status: BookingStatus;
    totalPrice: number;
    currency: string;
    paymentStatus: string;
    paymentMethod?: string;
    specialRequests?: string;
    user: {
        email: string;
        phone?: string;
    };
    hotel?: {
        name: string;
        address?: string;
        city?: string;
    };
    tour?: {
        name: string;
        address?: string;
        city?: string;
    };
    attraction?: {
        name: string;
        address?: string;
        city?: string;
    };
    event?: {
        title: string;
        location?: string;
        city?: string;
    };
    vehicle?: {
        brand: string;
        model: string;
        plateNumber?: string;
    };
    bookingitem?: BookingItem[];
    guest?: BookingGuest[];
    bookingauditlog?: BookingAuditLog[];
    createdAt: string;
}

export interface AdminBookingsResponse {
    success: boolean;
    count?: number;
    data: AdminBooking[];
    pagination?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface AdminBookingDetailResponse {
    success: boolean;
    data: AdminBooking;
}

export interface AdminBookingActionResponse {
    success: boolean;
    message: string;
    data?: AdminBooking;
}
