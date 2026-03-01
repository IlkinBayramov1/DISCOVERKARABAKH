import mongoose from 'mongoose';
import { Business } from '../../business.base.model.js';

const roomTypeSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., "Deluxe Suite"
    description: String,
    price: { type: Number, required: true },
    capacity: {
        adults: { type: Number, default: 2 },
        children: { type: Number, default: 0 }
    },
    amenities: [String], // Room-specific amenities
    photos: [String],
    availableCount: { type: Number, default: 1 }
});

const hotelSchema = new mongoose.Schema({
    starRating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    facilities: {
        type: [String],
        enum: [
            'Wifi', 'Pool', 'Parking', 'Restaurant',
            'Gym', 'Bar', 'Spa', 'Conference Room',
            'Room Service', 'Airport Shuttle'
        ],
    },
    roomTypes: [roomTypeSchema],
    policies: {
        checkInTime: { type: String, default: '14:00' },
        checkOutTime: { type: String, default: '12:00' },
        cancellationPolicy: String, // e.g., "Free cancellation up to 24h before"
        petsAllowed: { type: Boolean, default: false }
    },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], index: '2dsphere' } // [longitude, latitude]
    }
});

export const Hotel = Business.discriminator('Hotel', hotelSchema);
