import mongoose from 'mongoose';
import { Business } from '../business.base.model.js';

const activitySchema = new mongoose.Schema({
    time: String,
    description: String,
});

const dayItinerarySchema = new mongoose.Schema({
    day: { type: Number, required: true },
    title: String,
    description: String,
    activities: [activitySchema],
    meals: [String] // e.g. ["Breakfast", "Lunch"]
});

const tourSchema = new mongoose.Schema({
    duration: {
        days: { type: Number, required: true },
        nights: { type: Number, required: true },
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard', 'Extreme'],
        default: 'Medium',
    },
    groupSize: {
        min: { type: Number, default: 1 },
        max: { type: Number, required: true },
    },
    startDates: [Date],
    itinerary: [dayItinerarySchema],
    inclusions: [String], // What's included (Guide, Hotel, Transport)
    exclusions: [String], // What's not
    pricePerPerson: { type: Number, required: true },
});

export const Tour = Business.discriminator('Tour', tourSchema);
