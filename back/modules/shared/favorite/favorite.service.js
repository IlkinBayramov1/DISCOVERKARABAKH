import prisma from '../../../config/db.js';
import crypto from 'crypto';
import { hotelMapper } from '../../businesses/hotel/hotel/hotel.mapper.js';
import { attractionMapper } from '../../businesses/attraction/attraction/attraction.mapper.js';

class FavoriteService {
    async toggleFavorite(userId, targetId, type) {
        const modelMap = {
            hotel: { model: prisma.hotelfavorite, field: 'hotelId' },
            tour: { model: prisma.tourfavorite, field: 'tourId' },
            attraction: { model: prisma.attractionfavorite, field: 'attractionId' },
            vehicle: { model: prisma.vehiclefavorite, field: 'vehicleId' }
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
                    id: crypto.randomUUID(),
                    userId,
                    [config.field]: targetId
                }
            });
            return { favorited: true };
        }
    }

    async getUserFavorites(userId) {
        console.log('Available Prisma models:', Object.keys(prisma).filter(k => !k.startsWith('$')));
        const [hotels, tours, attractions, vehicles] = await Promise.all([
            prisma.hotelfavorite.findMany({
                where: { userId },
                include: { 
                    hotel: { 
                        include: { 
                            hotelimage: true,
                            roomtype: {
                                include: {
                                    dailypricing: { orderBy: { basePrice: 'asc' }, take: 1 }
                                }
                            }
                        } 
                    } 
                }
            }),
            prisma.tourfavorite.findMany({
                where: { userId },
                include: { tour: true }
            }),
            prisma.attractionfavorite.findMany({
                where: { userId },
                include: { attraction: { include: { attractionimage: true } } }
            }),
            prisma.vehiclefavorite.findMany({
                where: { userId },
                include: { vehicle: true }
            })
        ]);

        return {
            hotels: hotels.map(f => {
                if (!f.hotel) return null;
                const dto = hotelMapper.toHotelDTO(f.hotel);
                console.log(`[FavoriteDebug] Hotel: ${dto.name}, Price: ${dto.startingPrice}, Images: ${dto.images?.length}`);
                return dto;
            }).filter(Boolean),
            tours: tours.map(f => {
                const t = f.tour;
                if (t && t.images) {
                    t.images = typeof t.images === 'string' ? JSON.parse(t.images) : t.images;
                }
                return t;
            }).filter(Boolean),
            attractions: attractions.map(f => {
                if (!f.attraction) return null;
                // Use the official attraction mapper
                return attractionMapper.toAttractionDTO(f.attraction);
            }).filter(Boolean),
            vehicles: vehicles.map(f => {
                const v = f.vehicle;
                if (v && v.images) {
                    v.images = typeof v.images === 'string' ? JSON.parse(v.images) : v.images;
                }
                return v;
            }).filter(Boolean)
        };
    }
}

export default new FavoriteService();
