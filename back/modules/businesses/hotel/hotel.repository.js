import { Hotel } from './hotel.model.js';

class HotelRepository {
    async create(data) {
        return Hotel.create(data);
    }

    async findAll(query = {}) {
        // Basic filtering logic can be expanded here
        return Hotel.find(query).populate('owner', 'email companyName');
    }

    async findById(id) {
        return Hotel.findById(id).populate('owner', 'email companyName');
    }

    async update(id, data) {
        return Hotel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }

    async delete(id) {
        return Hotel.findByIdAndDelete(id);
    }

    // Example: Find similar hotels by star rating
    async findByRating(minRating) {
        return Hotel.find({ starRating: { $gte: minRating } });
    }
}

export const hotelRepository = new HotelRepository();
