import prisma from '../../../../config/db.js';

class LocationRepository {
    async searchLocations(query, limit = 4) {
        try {
            if (!query || !query.trim()) {
                return await prisma.location.findMany({
                    orderBy: { popularity: 'desc' },
                    take: limit
                });
            }
            const trimmedQuery = query.trim();
            return await prisma.location.findMany({
                where: {
                    OR: [
                        { name: { contains: trimmedQuery } },
                        { address: { contains: trimmedQuery } }
                    ]
                },
                orderBy: { popularity: 'desc' },
                take: limit
            });
        } catch (error) {
            console.error("Location Search Error", error);
            return [];
        }
    }

    async findById(id) {
        return prisma.location.findUnique({ where: { id: parseInt(id) } });
    }

    // Admin/Vendor specific CRUD
    async create(data) {
        return await prisma.location.create({ data });
    }

    async getLocationsByVendor(vendorId, filters = {}) {
        return await prisma.location.findMany({
            where: vendorId ? { vendorId } : {},
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        vendorprofile: {
                            select: {
                                companyName: true
                            }
                        }
                    }
                }
            }
        });
    }

    async update(id, data) {
        return await prisma.location.update({
            where: { id: parseInt(id) },
            data
        });
    }

    async delete(id) {
        return await prisma.location.delete({
            where: { id: parseInt(id) }
        });
    }
}

export default new LocationRepository();
