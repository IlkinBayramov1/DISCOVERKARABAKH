export interface ITouristProfile {
    id: string;
    nationality?: string;
    passportNumber?: string;
    interests?: string[];
    emergencyContact?: {
        name?: string;
        phone?: string;
        relation?: string;
    };
}

export interface IResidentProfile {
    id: string;
    permitNumber?: string;
    localAddress?: string;
    familyMembers?: Array<{
        name: string;
        relation: string;
    }>;
}

export interface IVendorProfile {
    id: string;
    companyName: string;
    category: string;
}

export interface IUserProfile {
    id: string;
    email: string;
    role: 'tourist' | 'resident' | 'vendor' | 'admin' | 'driver' | 'user';
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatarUrl?: string;
    gender?: 'male' | 'female' | 'other';
    birthDate?: string;
    language?: 'AZ' | 'EN' | 'RU';
    isActive: boolean;
    
    // Virtual name combining firstName and lastName
    name?: string; 

    // Nested profiles
    touristProfile?: ITouristProfile;
    residentProfile?: IResidentProfile;
    vendorProfile?: IVendorProfile;
}

export interface IProfileResponse {
    success: boolean;
    data: IUserProfile;
    message?: string;
}
