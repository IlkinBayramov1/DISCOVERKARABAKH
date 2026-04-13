import mongoose from 'mongoose';

const attractionReviewSchema = new mongoose.Schema(
    {
        attraction: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Attraction',
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
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
            required: false,
            maxlength: [500, 'Comment cannot be more than 500 characters'],
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'approved', // Assuming auto-approve unless moderated
        }
    },
    {
        timestamps: true,
    }
);

// Prevent user from submitting more than one review per attraction
attractionReviewSchema.index({ attraction: 1, user: 1 }, { unique: true });

export const AttractionReview = mongoose.model('AttractionReview', attractionReviewSchema);
