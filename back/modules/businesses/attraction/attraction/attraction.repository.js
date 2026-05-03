import prisma from '../../../../config/db.js';

class AttractionRepository {
    async create(data) {
        return await prisma.attraction.create({
            data,
            include: { 
                images: true,
                stats: true
            }
        });
    }

    async findById(id) {
        // Deep pull of relational Modules
        return await prisma.attraction.findUnique({
            where: { id },
            include: {
                images: { orderBy: { order: 'asc' } },
                stats: true,
                workingHours: true
            }
        });
    }

    async findBySlug(slug) {
        return await prisma.attraction.findUnique({
            where: { slug },
            include: {
                images: { orderBy: { order: 'asc' } },
                stats: true,
                workingHours: true
            }
        });
    }

    async findAll(filters = {}, pagination = { skip: 0, take: 20 }) {
        // High-velocity Composite Index lookup parameters (categoryId, status, isFeatured)
        const whereClause = {};

        if (filters.category) whereClause.category = filters.category;
        if (filters.status) whereClause.status = filters.status;
        if (filters.city) whereClause.city = filters.city;
        if (filters.vendorId) whereClause.vendorId = filters.vendorId;
        if (filters.isFeatured !== undefined) whereClause.isFeatured = filters.isFeatured;

        // Optional Location Bounding Logic
        if (filters.entryType) whereClause.entryType = filters.entryType;

        // Search Logic
        const keyword = filters.keyword || filters.q;
        if (keyword) {
            whereClause.OR = [
                { name: { contains: keyword, mode: 'insensitive' } },
                { description: { contains: keyword, mode: 'insensitive' } },
                { searchKeywords: { contains: keyword, mode: 'insensitive' } }
            ];
        }

        const totalItems = await prisma.attraction.count({ where: whereClause });

        let orderBy = { isFeatured: 'desc' };
        if (filters.sort === 'rating_desc') {
            orderBy = { stats: { averageRating: 'desc' } };
        } else if (filters.sort === 'price_asc') {
            orderBy = { price: 'asc' };
        } else if (filters.sort === 'price_desc') {
            orderBy = { price: 'desc' };
        } else if (filters.sort === 'newest') {
            orderBy = { createdAt: 'desc' };
        }

        const data = await prisma.attraction.findMany({
            where: whereClause,
            include: {
                images: { orderBy: { order: 'asc' } },
                stats: true
            },
            orderBy,
            skip: pagination.skip,
            take: pagination.take
        });

        return { data, totalItems };
    }

    async update(id, data) {
        return await prisma.attraction.update({
            where: { id },
            data,
            include: { 
                images: true,
                stats: true
            }
        });
    }

    async findNearby(lat, lng, radiusKm = 50, limit = 5) {
        // High-precision Haversine SQL for proximity discovery
        return await prisma.$queryRaw`
            SELECT a.*, 
            ( 6371 * acos( cos( radians(${lat}) ) * cos( radians( a.latitude ) ) 
            * cos( radians( a.longitude ) - radians(${lng}) ) + sin( radians(${lat}) ) 
            * sin( radians( a.latitude ) ) ) ) AS distance
            FROM Attraction a
            WHERE a.status = 'active'
            HAVING distance <= ${radiusKm}
            ORDER BY distance ASC
            LIMIT ${limit}
        `;
    }

    async delete(id) {
        return await prisma.attraction.delete({ where: { id } });
    }
}

export const attractionRepository = new AttractionRepository();
