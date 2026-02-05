import { Booking } from './booking.model.js';
import { Hotel } from '../../businesses/hotel/hotel.model.js';
import { Tour } from '../../businesses/tour/tour.model.js';
import { ApiError } from '../../../core/api.error.js';

export const createBooking = async (req, res, next) => {
    try {
        const { businessId, type, hotelDetails, tourDetails, contactPhone } = req.body;
        const userId = req.user._id;

        let business;
        let totalPrice = 0;

        // Validate Business Exists & Calculate Price
        if (type === 'Hotel') {
            business = await Hotel.findById(businessId);
            if (!business) throw ApiError.notFound('Hotel not found');

            const room = business.roomTypes.id(hotelDetails.roomTypeId);
            if (!room) throw ApiError.badRequest('Invalid room type');

            // Simple price alloc: Price * Nights * 1 (Assumes price is per night per room)
            // For real date calculation we'd need moment/date-fns. 
            // Simplified: User sends total price or we calculate roughly.
            // Let's trust client sent price OR calculate simple 1 night for MVP test if logic complex.
            // Better: Calculate.
            const start = new Date(hotelDetails.checkIn);
            const end = new Date(hotelDetails.checkOut);
            const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

            if (nights < 1) throw ApiError.badRequest('Check-out must be after check-in');

            totalPrice = room.price * nights;
            hotelDetails.roomName = room.name; // Snapshot

        } else if (type === 'Tour') {
            business = await Tour.findById(businessId);
            if (!business) throw ApiError.notFound('Tour not found');

            totalPrice = business.pricePerPerson * tourDetails.participants;
        } else {
            throw ApiError.badRequest('Invalid booking type');
        }

        const booking = await Booking.create({
            user: userId,
            business: businessId,
            type,
            hotelDetails: type === 'Hotel' ? hotelDetails : undefined,
            tourDetails: type === 'Tour' ? tourDetails : undefined,
            totalPrice,
            contactPhone,
            status: 'confirmed'
        });

        res.status(201).json({ success: true, data: booking });
    } catch (error) {
        next(error);
    }
};

export const getMyBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('business', 'name address images')
            .sort('-createdAt');

        res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        next(error);
    }
};

// For Vendors to see bookings for THEIR businesses
export const getVendorBookings = async (req, res, next) => {
    try {
        // 1. Find businesses owned by this vendor
        // This requires importing Business or using polymorphic query, mainly we want ID list
        // A simpler way: Find bookings where business.owner == vendorId. 
        // Mongoose doesn't support deep populate filter easily on root find.
        // Better: Find IDs of businesses owned by vendor first.

        // We can use the fact that we can import Business model base
        // Admin sees ALL bookings
        if (req.user.role === 'admin') {
            const bookings = await Booking.find()
                .populate('user', 'email')
                .populate('business', 'name type')
                .sort('-createdAt');
            return res.status(200).json({ success: true, count: bookings.length, data: bookings });
        }

        const { Business } = await import('../../businesses/business.base.model.js');
        const myBusinesses = await Business.find({ owner: req.user._id }).select('_id');
        const businessIds = myBusinesses.map(b => b._id);

        const bookings = await Booking.find({ business: { $in: businessIds } })
            .populate('user', 'email') // Show who booked
            .populate('business', 'name type')
            .sort('-createdAt');

        res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        next(error);
    }
};
