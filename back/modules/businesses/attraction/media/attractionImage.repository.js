import prisma from '../../../../config/db.js';

class AttractionImageRepository {
    async create(data) {
        return await prisma.attractionImage.create({ data });
    }

    async findByAttractionId(attractionId) {
        return await prisma.attractionImage.findMany({
            where: { attractionId },
            orderBy: { order: 'asc' }
        });
    }

    async findById(id) {
        return await prisma.attractionImage.findUnique({ where: { id } });
    }

    async update(id, data) {
        return await prisma.attractionImage.update({
            where: { id },
            data
        });
    }

    async delete(id) {
        return await prisma.attractionImage.delete({ where: { id } });
    }
}

export const attractionImageRepository = new AttractionImageRepository();
