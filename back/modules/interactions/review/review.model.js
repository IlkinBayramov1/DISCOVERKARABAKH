import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        business: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Business', // Polymorphic ref handled by Mongoose if business collection is single
            required: true,
        },
        rating: {
            type: Number,
            required: [true, 'Please add a rating between 1 and 5'],
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: [true, 'Please add a comment'],
        },
    },
    { timestamps: true }
);

// Prevent user from submitting multiple reviews for same business
reviewSchema.index({ business: 1, user: 1 }, { unique: true });

export const Review = mongoose.model('Review', reviewSchema);
