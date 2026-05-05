import prisma from '../../../config/db.js';
import crypto from 'crypto';

class TourRepository {
    async create(data) {
        const { images, itinerary, inclusions, exclusions, ...rest } = data;
        return prisma.tour.create({
            data: {
                id: crypto.randomUUID(),
                ...rest,
                images: images ? JSON.stringify(images) : null,
                itinerary: itinerary ? JSON.stringify(itinerary) : null,
                inclusions: inclusions ? JSON.stringify(inclusions) : null,
                exclusions: exclusions ? JSON.stringify(exclusions) : null,
                availableSlots: data.groupSizeMax,
                updatedAt: new Date()
            },
        });
    }

    async findAll(query = {}) {
        const {
            city,
            ownerId,
            minPrice,
            maxPrice,
            difficulty,
            duration, // Frontend sends 'duration'
            q,        // Keyword search
            sortBy = 'recommended',
            limit = 10,
            page = 1
        } = query;

        const where = {};
        if (city) where.city = { contains: city };
        if (ownerId) where.ownerId = ownerId;
        if (difficulty) where.difficulty = difficulty;
        if (duration) where.durationDays = parseInt(duration);

        if (q) {
            where.OR = [
                { name: { contains: q } },
                { description: { contains: q } }
            ];
        }

        if (minPrice || maxPrice) {
            where.pricePerPerson = {};
            if (minPrice) where.pricePerPerson.gte = parseFloat(minPrice);
            if (maxPrice) where.pricePerPerson.lte = parseFloat(maxPrice);
        }

        const orderBy = {};
        if (sortBy === 'price_asc') orderBy.pricePerPerson = 'asc';
        else if (sortBy === 'price_desc') orderBy.pricePerPerson = 'desc';
        else if (sortBy === 'duration_asc') orderBy.durationDays = 'asc';
        else orderBy.createdAt = 'desc';

        const [tours, totalCount] = await prisma.$transaction([
            prisma.tour.findMany({
                where,
                include: {
                    user: { select: { email: true, isApproved: true } }
                },
                take: parseInt(limit),
                skip: (parseInt(page) - 1) * parseInt(limit),
                orderBy
            }),
            prisma.tour.count({ where })
        ]);

        const mappedTours = tours.map(tour => {
            const { user, images, itinerary, inclusions, exclusions, ...rest } = tour;
            return { 
                ...rest, 
                owner: user,
                images: images ? (typeof images === 'string' ? JSON.parse(images) : images) : [],
                itinerary: itinerary ? (typeof itinerary === 'string' ? JSON.parse(itinerary) : itinerary) : [],
                inclusions: inclusions ? (typeof inclusions === 'string' ? JSON.parse(inclusions) : inclusions) : [],
                exclusions: exclusions ? (typeof exclusions === 'string' ? JSON.parse(exclusions) : exclusions) : []
            };
        });

        return { tours: mappedTours, totalCount };
    }

    async findById(id) {
        const tour = await prisma.tour.findUnique({
            where: { id },
            include: {
                user: {
                    select: { email: true, isApproved: true }
                }
            }
        });
        if (!tour) return null;
        const { user, images, itinerary, inclusions, exclusions, ...rest } = tour;
        return { 
            ...rest, 
            owner: user,
            images: images ? (typeof images === 'string' ? JSON.parse(images) : images) : [],
            itinerary: itinerary ? (typeof itinerary === 'string' ? JSON.parse(itinerary) : itinerary) : [],
            inclusions: inclusions ? (typeof inclusions === 'string' ? JSON.parse(inclusions) : inclusions) : [],
            exclusions: exclusions ? (typeof exclusions === 'string' ? JSON.parse(exclusions) : exclusions) : []
        };
    }

    async findAvailabilityByDate(tourId, date) {
        return prisma.touravailability.findUnique({
            where: {
                tourId_date: {
                    tourId,
                    date: new Date(date)
                }
            }
        });
    }

    async findBySlug(slug) {
        const tour = await prisma.tour.findUnique({
            where: { slug },
            include: {
                user: {
                    select: { email: true, isApproved: true }
                }
            }
        });
        if (!tour) return null;
        const { user, images, itinerary, inclusions, exclusions, ...rest } = tour;
        return { 
            ...rest, 
            owner: user,
            images: images ? (typeof images === 'string' ? JSON.parse(images) : images) : [],
            itinerary: itinerary ? (typeof itinerary === 'string' ? JSON.parse(itinerary) : itinerary) : [],
            inclusions: inclusions ? (typeof inclusions === 'string' ? JSON.parse(inclusions) : inclusions) : [],
            exclusions: exclusions ? (typeof exclusions === 'string' ? JSON.parse(exclusions) : exclusions) : []
        };
    }

    async update(id, data) {
        const { images, itinerary, inclusions, exclusions, ...rest } = data;
        const updateData = { ...rest, updatedAt: new Date() };
        if (images) updateData.images = JSON.stringify(images);
        if (itinerary) updateData.itinerary = JSON.stringify(itinerary);
        if (inclusions) updateData.inclusions = JSON.stringify(inclusions);
        if (exclusions) updateData.exclusions = JSON.stringify(exclusions);

        return prisma.tour.update({
            where: { id },
            data: updateData,
        });
    }

    async delete(id) {
        return prisma.tour.delete({
            where: { id },
        });
    }

    async countBookedParticipants(tourId, date) {
        const bookings = await prisma.booking.findMany({
            where: {
                tourId,
                status: { in: ['pending_payment', 'confirmed', 'checked_in'] },
                bookingitem: {
                    some: {
                        checkIn: new Date(date)
                    }
                }
            },
            include: {
                bookingitem: true
            }
        });

        let total = 0;
        bookings.forEach(b => {
            const items = b.bookingitem || [];
            items.forEach(item => {
                if (new Date(item.checkIn).getTime() === new Date(date).getTime()) {
                    total += (item.adults + (item.children || 0));
                }
            });
        });

        return total;
    }

    async decrementAvailableSlots(tourId, count, tx) {
        const client = tx || prisma;
        return client.tour.update({
            where: { id: tourId },
            data: {
                availableSlots: {
                    decrement: count
                }
            }
        });
    }

    async incrementAvailableSlots(tourId, count, tx) {
        const client = tx || prisma;
        return client.tour.update({
            where: { id: tourId },
            data: {
                availableSlots: {
                    increment: count
                }
            }
        });
    }

    async getMonthlyAvailability(tourId, startDate, endDate) {
        // 1. Get base tour data
        const tour = await prisma.tour.findUnique({
            where: { id: tourId },
            select: { groupSizeMax: true, pricePerPerson: true }
        });

        if (!tour) return [];

        // 2. Get specific availability overrides
        const overrides = await prisma.touravailability.findMany({
            where: {
                tourId,
                date: {
                    gte: new Date(startDate),
                    lte: new Date(endDate)
                }
            }
        });

        // 3. Get bookings for this month
        const bookings = await prisma.booking.findMany({
            where: {
                tourId,
                status: { in: ['pending_payment', 'confirmed', 'checked_in'] },
                bookingitem: {
                    some: {
                        checkIn: {
                            gte: new Date(startDate),
                            lte: new Date(endDate)
                        }
                    }
                }
            },
            include: { bookingitem: true }
        });

        // 4. Map them to a days object for easy lookup
        const results = [];
        const current = new Date(startDate);
        const end = new Date(endDate);

        while (current <= end) {
            const dateStr = current.toISOString().split('T')[0];
            const override = overrides.find(o => o.date.toISOString().split('T')[0] === dateStr);
            
            // Calculate booked participants for this day
            let bookedCount = 0;
            bookings.forEach(b => {
                const items = b.bookingitem || [];
                items.forEach(item => {
                    if (item.checkIn && item.checkIn.toISOString().split('T')[0] === dateStr) {
                        bookedCount += (item.adults + (item.children || 0));
                    }
                });
            });

            if (override || bookedCount > 0) {
                results.push({
                    date: dateStr,
                    maxSeats: override?.maxSeats ?? tour.groupSizeMax,
                    bookedCount,
                    remainingSeats: Math.max(0, (override?.maxSeats ?? tour.groupSizeMax) - bookedCount),
                    isStopped: override?.isStopped ?? false,
                    price: override?.priceOverride ?? tour.pricePerPerson
                });
            }

            current.setDate(current.getDate() + 1);
        }

        return results;
    }

    async bulkUpdateAvailability(tourId, data) {
        const { startDate, endDate, daysOfWeek, isStopped, maxSeats, priceOverride } = data;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const current = new Date(start);

        const updates = [];

        while (current <= end) {
            const dayOfWeek = current.getDay(); // 0 = Sunday, 1 = Monday...
            
            // Map common day mapping: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
            const dayMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const dayName = dayMap[dayOfWeek];

            if (!daysOfWeek || daysOfWeek.includes(dayName)) {
                updates.push(
                    prisma.touravailability.upsert({
                        where: {
                            tourId_date: {
                                tourId,
                                date: new Date(current)
                            }
                        },
                        update: {
                            isStopped: isStopped !== undefined ? isStopped : undefined,
                            maxSeats: maxSeats !== undefined ? maxSeats : undefined,
                            priceOverride: priceOverride !== undefined ? priceOverride : undefined
                        },
                        create: {
                            id: crypto.randomUUID(),
                            tourId,
                            date: new Date(current),
                            isStopped: isStopped ?? false,
                            maxSeats,
                            priceOverride
                        }
                    })
                );
            }
            current.setDate(current.getDate() + 1);
        }

        return prisma.$transaction(updates);
    }
}

export const tourRepository = new TourRepository();
