import { PrismaClient, Prisma } from '@prisma/client';
import { ApiError } from '../../../core/api.error.js';

const prisma = new PrismaClient();

class RestaurantRepository {
    async create(vendorId, data) {
        // Prepare relations for cuisines if provided
        let cuisineCreate = [];
        if (data.cuisineIds && data.cuisineIds.length > 0) {
            cuisineCreate = data.cuisineIds.map(id => ({
                cuisine: { connect: { id } }
            }));
        }

        return await prisma.restaurant.create({
            data: {
                vendorId,
                name: data.name,
                slug: data.slug,
                description: data.description || {},
                priceRange: data.priceRange,
                address: data.address,
                latitude: data.latitude,
                longitude: data.longitude,
                workingHours: data.workingHours || {},
                cuisines: {
                    create: cuisineCreate
                }
            },
            include: {
                cuisines: { include: { cuisine: true } }
            }
        });
    }

    async findById(id) {
        return await prisma.restaurant.findUnique({
            where: { id },
            include: {
                cuisines: { include: { cuisine: true } },
                menuCategories: {
                    orderBy: { sortOrder: 'asc' },
                    include: {
                        items: {
                            where: { isAvailable: true },
                            include: { options: true }
                        }
                    }
                }
            }
        });
    }

    async findBySlug(slug) {
        return await prisma.restaurant.findUnique({
            where: { slug },
            include: {
                cuisines: { include: { cuisine: true } }
            }
        });
    }

    // Advanced search with Filters and Haversine Distance (Native Query for Production Scale)
    async search(filters, pagination) {
        const { lat, lng, radiusKm, cuisineId, priceRange, isFeatured, status = 'active' } = filters;
        const limit = pagination.limit || 20;
        const offset = pagination.offset || 0;

        let whereClause = { status };

        if (priceRange) whereClause.priceRange = priceRange;
        if (isFeatured !== undefined) whereClause.isFeatured = isFeatured;

        if (cuisineId) {
            whereClause.cuisines = {
                some: { cuisineId }
            };
        }

        // Standard Filter Query
        if (!lat || !lng) {
            const [count, results] = await prisma.$transaction([
                prisma.restaurant.count({ where: whereClause }),
                prisma.restaurant.findMany({
                    where: whereClause,
                    include: { cuisines: { include: { cuisine: true } } },
                    orderBy: [
                        { featuredPriority: 'desc' },
                        { rating: 'desc' },
                        { reviewCount: 'desc' }
                    ],
                    skip: offset,
                    take: limit
                })
            ]);
            return { count, results };
        }

        // Geospatial Query using Haversine raw SQL for accurate distance calculation
        // Filter down bounding box first logically (Not full SQL raw to keep Prisma typing where possible, 
        // but for 10k+ rows standard raw is favored. We will do a hybrid bounding box).

        const rCount = await prisma.restaurant.count({ where: whereClause });

        // This is a powerful Enterprise spatial query replacing the JSON logic
        const rawResults = await prisma.$queryRaw`
            SELECT r.*, 
            ( 6371 * acos( cos( radians(${lat}) ) * cos( radians( r.latitude ) ) 
            * cos( radians( r.longitude ) - radians(${lng}) ) + sin( radians(${lat}) ) 
            * sin( radians( r.latitude ) ) ) ) AS distance
            FROM Restaurant r
            WHERE r.status = ${status}
            ${priceRange ? Prisma.sql`AND r.priceRange = ${priceRange}` : Prisma.empty}
            ${isFeatured ? Prisma.sql`AND r.isFeatured = true` : Prisma.empty}
            HAVING distance <= ${radiusKm || 50}
            ORDER BY r.featuredPriority DESC, r.rating DESC, distance ASC
            LIMIT ${limit} OFFSET ${offset}
        `;

        // Note: The raw query doesn't auto-hydrate Cuisines. Standard ORM map needed for heavy relational nesting.
        return { count: rCount, results: rawResults };
    }

    async update(id, vendorId, data) {
        // Validate vendor ownership
        const existing = await prisma.restaurant.findUnique({ where: { id } });
        if (!existing) throw ApiError.notFound('Restaurant not found');
        if (existing.vendorId !== vendorId) throw ApiError.forbidden('Unauthorized access to restaurant');

        return await prisma.restaurant.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                priceRange: data.priceRange,
                address: data.address,
                latitude: data.latitude,
                longitude: data.longitude,
                workingHours: data.workingHours
            }
        });
    }

    async updateStatus(id, status) {
        return await prisma.restaurant.update({
            where: { id },
            data: { status }
        });
    }

    async delete(id, vendorId) {
        const existing = await prisma.restaurant.findUnique({ where: { id } });
        if (!existing) throw ApiError.notFound('Restaurant not found');
        if (existing.vendorId !== vendorId) throw ApiError.forbidden('Unauthorized access to restaurant');

        // Soft delete mapped via status for restaurants
        return await prisma.restaurant.update({
            where: { id },
            data: { status: 'inactive' }
        });
    }
}

export default new RestaurantRepository();
