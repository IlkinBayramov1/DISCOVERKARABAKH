import prisma from '../../../../config/db.js';

class AttractionReviewRepository {
    async create(data) {
        return await prisma.attractionReview.create({
            data,
            include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } }
        });
    }

    async findByAttractionId(attractionId, query = { status: 'approved' }) {
        return await prisma.attractionReview.findMany({
            where: { 
                attractionId,
                status: query.status || 'approved' 
            },
            include: { 
                user: { select: { id: true, firstName: true, lastName: true, email: true } } 
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findByAttractionIds(attractionIds, query = {}) {
        return await prisma.attractionReview.findMany({
            where: {
                attractionId: { in: attractionIds },
                ...(query.status && { status: query.status })
            },
            include: {
                user: { select: { id: true, firstName: true, lastName: true, email: true } },
                attraction: { select: { id: true, name: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findById(id) {
        return await prisma.attractionReview.findUnique({
            where: { id },
            include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } }
        });
    }

    async findOne(query) {
        return await prisma.attractionReview.findFirst({
            where: query
        });
    }

    async update(id, data) {
        return await prisma.attractionReview.update({
            where: { id },
            data,
            include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } }
        });
    }

    async delete(id) {
        return await prisma.attractionReview.delete({
            where: { id }
        });
    }
}

export const attractionReviewRepository = new AttractionReviewRepository();
