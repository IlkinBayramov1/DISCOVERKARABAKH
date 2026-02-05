import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        business: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Business',
            required: true,
        },
        type: {
            type: String,
            enum: ['Hotel', 'Tour'],
            required: true,
        },
        // Status of the booking
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled', 'completed'],
            default: 'confirmed', // Instant booking for MVP
        },
        // Hotel specific details
        hotelDetails: {
            roomTypeId: mongoose.Schema.Types.ObjectId,
            checkIn: Date,
            checkOut: Date,
            guests: {
                adults: Number,
                children: Number,
            },
            roomName: String, // Snapshot of room name
        },
        // Tour specific details
        tourDetails: {
            tourDate: Date,
            participants: Number,
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        contactPhone: String,
        specialRequests: String,
    },
    { timestamps: true }
);

export const Booking = mongoose.model('Booking', bookingSchema);
