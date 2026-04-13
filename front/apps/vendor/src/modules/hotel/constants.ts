import type { IAmenityDefinition } from './types';

/**
 * Shared constants for the Hotel module, synchronized with backend constants.yaml
 */
export const HOTEL_AMENITIES: Record<string, IAmenityDefinition> = {
    'Free WiFi': { icon: 'fa-wifi', category: 'Connectivity' },
    'Swimming Pool': { icon: 'fa-person-swimming', category: 'Wellness' },
    'Free Parking': { icon: 'fa-square-p', category: 'Logistics' },
    'Spa & Wellness': { icon: 'fa-spa', category: 'Wellness' },
    'Restaurant': { icon: 'fa-utensils', category: 'Dining' },
    'Gym': { icon: 'fa-dumbbell', category: 'Wellness' },
    'Bar': { icon: 'fa-martini-glass-citrus', category: 'Dining' },
    'Conference Room': { icon: 'fa-users-rectangle', category: 'Business' },
    'Room Service': { icon: 'fa-bell-concierge', category: 'Service' },
    'Airport Shuttle': { icon: 'fa-van-shuttle', category: 'Logistics' }
};

export const PROPERTY_TYPES = [
    'hotel',
    'apartment',
    'resort',
    'villa',
    'hostel',
    'boutique'
];

export const ROOM_STATUS_LABELS: Record<string, string> = {
    'AVAILABLE': 'Mövcuddur',
    'DIRTY': 'Çirkli',
    'CLEANING': 'Təmizlənir',
    'OUT_OF_ORDER': 'Yararsız'
};

export const HOTEL_EVENTS = {
    HOTEL_CREATED: 'hotel:created',
    HOTEL_DELETED: 'hotel:deleted',
    PRICING_UPDATED: 'pricing:updated',
    AVAILABILITY_UPDATED: 'availability:updated',
    ROOM_TYPE_CREATED: 'roomType:created',
    ROOM_TYPE_UPDATED: 'roomType:updated',
    ROOM_TYPE_DELETED: 'roomType:deleted',
    INVENTORY_DEPLETED: 'room:inventory:depleted',
    RESERVATION_CREATED: 'reservation:created',
    RESERVATION_CANCELLED: 'reservation:cancelled',
    REVIEW_CREATED: 'review:created'
} as const;
