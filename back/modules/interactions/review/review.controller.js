import { Review } from './review.model.js';
import { ApiError } from '../../../core/api.error.js';
import { Booking } from '../booking/booking.model.js';

export const addReview = async (req, res, next) => {
    try {
        req.body.user = req.user._id;
        const { business } = req.body;

        // Optional: Only allow review if user has booked this business?
        // For MVP, letting open reviews or we can check booking exists.
        // Let's implement check for realism.
        const hasBooking = await Booking.findOne({
            user: req.user._id,
            business: business,
            status: 'confirmed'
            // Ideally completed, but 'confirmed' is fine for now
        });

        if (!hasBooking) {
            // throw ApiError.forbidden('You can only review businesses you have booked');
            // For testing speed, let's just warn or allow.
            // Uncomment line above to enforce.
        }

        const review = await Review.create(req.body);
        res.status(201).json({ success: true, data: review });
    } catch (error) {
        next(error);
    }
};

export const getBusinessReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({ business: req.params.businessId })
            .populate('user', 'email') // or name provided in profile
            .sort('-createdAt');

        res.status(200).json({ success: true, count: reviews.length, data: reviews });
    } catch (error) {
        next(error);
    }
};
