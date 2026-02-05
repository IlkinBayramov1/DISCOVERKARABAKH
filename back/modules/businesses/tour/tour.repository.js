import { Tour } from './tour.model.js';

class TourRepository {
    async create(data) {
        return Tour.create(data);
    }

    async findAll(query = {}) {
        return Tour.find(query).populate('owner', 'email companyName');
    }

    async findById(id) {
        return Tour.findById(id).populate('owner', 'email companyName');
    }

    async update(id, data) {
        return Tour.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }

    async delete(id) {
        return Tour.findByIdAndDelete(id);
    }

    // Example: Find tours by duration
    async findByDuration(days) {
        return Tour.find({ 'duration.days': days });
    }
}

export const tourRepository = new TourRepository();
