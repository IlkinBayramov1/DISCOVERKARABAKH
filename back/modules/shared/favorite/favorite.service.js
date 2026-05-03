import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class FavoriteService {
    async toggleFavorite(userId, targetId, type) {
        const modelMap = {
            hotel: { model: prisma.hotelFavorite, field: 'hotelId' },
            tour: { model: prisma.tourFavorite, field: 'tourId' },
            attraction: { model: prisma.attractionFavorite, field: 'attractionId' },
            vehicle: { model: prisma.vehicleFavorite, field: 'vehicleId' }
        };

        const config = modelMap[type];
        if (!config) throw new Error('Invalid favorite type');

        const existing = await config.model.findFirst({
            where: {
                userId,
                [config.field]: targetId
            }
        });

        if (existing) {
            await config.model.delete({
                where: { id: existing.id }
            });
            return { favorited: false };
        } else {
            await config.model.create({
                data: {
                    userId,
                    [config.field]: targetId
                }
            });
            return { favorited: true };
        }
    }

    async getUserFavorites(userId) {
        const [hotels, tours, attractions, vehicles] = await Promise.all([
            prisma.hotelFavorite.findMany({
                where: { userId },
                include: { hotel: { include: { images: true } } }
            }),
            prisma.tourFavorite.findMany({
                where: { userId },
                include: { tour: true }
            }),
            prisma.attractionFavorite.findMany({
                where: { userId },
                include: { attraction: { include: { images: true } } }
            }),
            prisma.vehicleFavorite.findMany({
                where: { userId },
                include: { vehicle: true }
            })
        ]);

        return {
            hotels: hotels.map(f => f.hotel),
            tours: tours.map(f => f.tour),
            attractions: attractions.map(f => f.attraction),
            vehicles: vehicles.map(f => f.vehicle)
        };
    }
}

export default new FavoriteService();
