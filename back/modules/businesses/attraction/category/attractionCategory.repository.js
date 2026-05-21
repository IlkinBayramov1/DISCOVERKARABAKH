import prisma from '../../../../config/db.js';

class AttractionCategoryRepository {
    async create(data) {
        return await prisma.attractionCategory.create({ data });
    }

    async findById(id) {
        return await prisma.attractionCategory.findUnique({ where: { id } });
    }

    async findBySlug(slug) {
        return await prisma.attractionCategory.findUnique({ where: { slug } });
    }

    async findAll() {
        return await prisma.attractionCategory.findMany({
            orderBy: { name: 'asc' }
        });
    }

    async update(id, data) {
        return await prisma.attractionCategory.update({
            where: { id },
            data
        });
    }

    async delete(id) {
        return await prisma.attractionCategory.delete({ where: { id } });
    }
}

export const attractionCategoryRepository = new AttractionCategoryRepository();
