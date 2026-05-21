import prisma from '../../../../config/db.js';

class AttractionFavoriteRepository {
    async toggleFavorite(userId, attractionId) {
        const existing = await prisma.attractionFavorite.findUnique({
            where: {
                userId_attractionId: { userId, attractionId }
            }
        });

        if (existing) {
            await prisma.attractionFavorite.delete({ where: { id: existing.id } });
            return { action: 'removed' };
        } else {
            await prisma.attractionFavorite.create({
                data: { userId, attractionId }
            });
            return { action: 'added' };
        }
    }

    async getUserFavorites(userId) {
        return await prisma.attractionFavorite.findMany({
            where: { userId },
            include: { attraction: true },
            orderBy: { createdAt: 'desc' }
        });
    }
}

export const attractionFavoriteRepository = new AttractionFavoriteRepository();
