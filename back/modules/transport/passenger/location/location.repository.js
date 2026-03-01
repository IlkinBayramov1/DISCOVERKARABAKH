import prisma from '../../../../config/db.js';

class LocationRepository {
    async searchLocations(query, limit = 5) {
        // Prisma `@@fulltext` index usage example for MySQL
        // If MySQL @@fulltext index fails on standard deployment, we fall back to generic Contains.
        try {
            return await prisma.location.findMany({
                where: {
                    name: {
                        search: query // Utilizing the fulltext search indexing natively
                    }
                },
                orderBy: { popularity: 'desc' },
                take: limit
            });
        } catch (error) {
            // Fallback to insensitive Contains if FullText is not completely supported
            return await prisma.location.findMany({
                where: {
                    name: {
                        contains: query,
                    }
                },
                orderBy: { popularity: 'desc' },
                take: limit
            });
        }
    }

    async findById(id) {
        return prisma.location.findUnique({ where: { id: parseInt(id) } });
    }
}

export default new LocationRepository();
