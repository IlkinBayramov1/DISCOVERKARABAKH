import { AttractionReview } from './attractionReview.model.js';

class AttractionReviewRepository {
    async create(data) {
        return AttractionReview.create(data);
    }

    async findByAttractionId(attractionId, query = {}) {
        return AttractionReview.find({ attraction: attractionId, ...query })
            .populate('user', 'firstName lastName email')
            .sort('-createdAt');
    }

    async findById(id) {
        return AttractionReview.findById(id).populate('user', 'firstName lastName email');
    }

    async findOne(query) {
        return AttractionReview.findOne(query);
    }

    async update(id, data) {
        return AttractionReview.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }

    async delete(id) {
        return AttractionReview.findByIdAndDelete(id);
    }
}

export const attractionReviewRepository = new AttractionReviewRepository();
