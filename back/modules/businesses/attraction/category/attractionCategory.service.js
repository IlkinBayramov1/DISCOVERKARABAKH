import { attractionCategoryRepository } from './attractionCategory.repository.js';
import { ApiError } from '../../../../core/api.error.js';

class AttractionCategoryService {
    async createCategory(data) {
        // Check uniqueness by slug
        const existing = await attractionCategoryRepository.findBySlug(data.slug);
        if (existing) {
            throw ApiError.badRequest(`Category with slug '${data.slug}' already exists.`);
        }
        return await attractionCategoryRepository.create(data);
    }

    async getCategories() {
        return await attractionCategoryRepository.findAll();
    }

    async getCategoryById(id) {
        const category = await attractionCategoryRepository.findById(id);
        if (!category) throw ApiError.notFound('Category not found.');
        return category;
    }

    async updateCategory(id, data) {
        const category = await attractionCategoryRepository.findById(id);
        if (!category) throw ApiError.notFound('Category not found.');

        if (data.slug && data.slug !== category.slug) {
            const existing = await attractionCategoryRepository.findBySlug(data.slug);
            if (existing) throw ApiError.badRequest('Category slug must be unique.');
        }

        return await attractionCategoryRepository.update(id, data);
    }

    async deleteCategory(id) {
        const category = await attractionCategoryRepository.findById(id);
        if (!category) throw ApiError.notFound('Category not found.');
        return await attractionCategoryRepository.delete(id);
    }
}

export const attractionCategoryService = new AttractionCategoryService();
