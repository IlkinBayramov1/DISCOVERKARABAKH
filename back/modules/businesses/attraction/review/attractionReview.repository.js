import prisma from '../../../../config/db.js';
import crypto from 'crypto';

class AttractionReviewRepository {
    async create(data) {
        const { images, ...rest } = data;
        return await prisma.attractionreview.create({
            data: {
                id: crypto.randomUUID(),
                ...rest,
                images: images ? JSON.stringify(images) : null
            },
            include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } }
        });
    }

    async findByAttractionId(attractionId, query = { status: 'approved' }) {
        const reviews = await prisma.attractionreview.findMany({
            where: { 
                attractionId,
                status: query.status || 'approved' 
            },
            include: { 
                user: { select: { id: true, firstName: true, lastName: true, email: true } } 
            },
            orderBy: { createdAt: 'desc' }
        });
        return reviews.map(r => ({
            ...r,
            images: r.images ? (typeof r.images === 'string' ? JSON.parse(r.images) : r.images) : []
        }));
    }

    async findByAttractionIds(attractionIds, query = {}) {
        const reviews = await prisma.attractionreview.findMany({
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
        return reviews.map(r => ({
            ...r,
            images: r.images ? (typeof r.images === 'string' ? JSON.parse(r.images) : r.images) : []
        }));
    }

    async findById(id) {
        const review = await prisma.attractionreview.findUnique({
            where: { id },
            include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } }
        });
        if (!review) return null;
        return {
            ...review,
            images: review.images ? (typeof review.images === 'string' ? JSON.parse(review.images) : review.images) : []
        };
    }

    async findOne(query) {
        return await prisma.attractionreview.findFirst({
            where: query
        });
    }

    async update(id, data) {
        const { images, ...rest } = data;
        const updateData = { ...rest };
        if (images) updateData.images = JSON.stringify(images);

        return await prisma.attractionreview.update({
            where: { id },
            data: updateData,
            include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } }
        });
    }

    async delete(id) {
        return await prisma.attractionreview.delete({
            where: { id }
        });
    }
}

export const attractionReviewRepository = new AttractionReviewRepository();
