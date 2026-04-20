import prisma from '../../../../config/db.js';

class AttractionRepository {
    async create(data) {
        return await prisma.attraction.create({
            data,
            include: { 
                category: true,
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
                category: true,
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
                category: true,
                images: { orderBy: { order: 'asc' } },
                stats: true,
                workingHours: true
            }
        });
    }

    async findAll(filters = {}, pagination = { skip: 0, take: 20 }) {
        // High-velocity Composite Index lookup parameters (categoryId, status, isFeatured)
        const whereClause = {};

        if (filters.categoryId) whereClause.categoryId = filters.categoryId;
        if (filters.status) whereClause.status = filters.status;
        if (filters.city) whereClause.city = filters.city;
        if (filters.isFeatured !== undefined) whereClause.isFeatured = filters.isFeatured;

        // Optional Location Bounding Logic (Mocked slightly here, actual PostGIS logic requires raw queries)
        if (filters.entryType) whereClause.entryType = filters.entryType;

        // Multilingual Full-text search (MySQL FullText Index)
        if (filters.q) {
            whereClause.OR = [
                { name: { search: filters.q } },
                { description: { search: filters.q } },
                { searchKeywords: { search: filters.q } }
            ];
        }

        const totalItems = await prisma.attraction.count({ where: whereClause });

        const data = await prisma.attraction.findMany({
            where: whereClause,
            include: {
                category: true,
                images: { orderBy: { order: 'asc' } },
                stats: true
            },
            orderBy: {
                isFeatured: 'desc'
            },
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
                category: true,
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
