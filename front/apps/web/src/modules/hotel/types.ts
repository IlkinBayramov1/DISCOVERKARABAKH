export interface IHotelAmenity {
    id: string;
    name: string;
    icon?: string;
}

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

    starRating?: number; // Replaces previous ambiguous `rating` for stars
    rating?: number;     // Average review score
    reviewCount?: number;

    latitude?: number;
    longitude?: number;
    phone?: string;
    email?: string;

    status: string;

    images?: Array<{ id: string; url: string; order: number }>;
    amenities?: IHotelAmenity[];
    policies?: {
        checkInTime?: string;
        checkOutTime?: string;
        [key: string]: any;
    };
    lowestPrice?: number;
}

