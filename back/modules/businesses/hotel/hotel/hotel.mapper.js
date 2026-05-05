/**
 * Data Mapper for Hotel module.
 * Converts Prisma models into standardized DTOs matching schemas.yaml.
 */
class HotelMapper {
    /**
     * Converts a single Hotel Prisma model with relations to a Hotel DTO
     */
    toHotelDTO(hotel) {
        if (!hotel) return null;

        // Calculate Average Rating
        const reviews = hotel.review || [];
        const reviewCount = reviews.length || (hotel._count?.review || 0);
        let rating = 0;
        if (reviews.length > 0) {
            rating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        }

        // Calculate Starting Price (Lowest price among all room types)
        let startingPrice = 0;
        const roomTypes = hotel.roomtype || [];
        if (roomTypes.length > 0) {
            const prices = roomTypes
                .map(rt => {
                    const dailyPrice = (rt.dailypricing && rt.dailypricing.length > 0) ? rt.dailypricing[0].basePrice : Infinity;
                    const fallbackPrice = rt.basePrice || Infinity;
                    return Math.min(dailyPrice, fallbackPrice);
                })
                .filter(p => p !== Infinity);

            if (prices.length > 0) {
                startingPrice = Math.min(...prices);
            }
        }

        // Map POIs
        const nearbyPOIs = hotel.hotelpoi ? hotel.hotelpoi.map(poi => this.toHotelPOIDTO(poi)) : [];

        // Return clean DTO
        return {
            id: hotel.id,
            name: hotel.name,
            slug: hotel.slug,
            description: hotel.description,
            starRating: hotel.starRating,
            propertyType: hotel.propertyType,
            city: hotel.city,
            address: hotel.address,
            latitude: hotel.latitude,
            longitude: hotel.longitude,
            phone: hotel.phone,
            email: hotel.email,
            status: hotel.status,
            checkInTime: hotel.checkInTime,
            checkOutTime: hotel.checkOutTime,
            cancellationPolicy: hotel.cancellationPolicy,
            childPolicy: hotel.childPolicy,
            petPolicy: hotel.petPolicy,
            reviewCount: reviewCount,
            rating: Math.round(rating * 10) / 10,
            startingPrice: startingPrice,
            nearbyPOIs,
            amenities: hotel.hotelamenity ? hotel.hotelamenity.map(a => ({
                amenity: { name: a.amenity.name }
            })) : [],
            images: hotel.hotelimage ? hotel.hotelimage.map(img => ({
                url: img.url,
                order: img.order
            })) : [],
            roomTypes: roomTypes.map(rt => ({
                id: rt.id,
                name: rt.name,
                description: rt.description,
                baseOccupancy: rt.baseOccupancy,
                maxAdults: rt.maxAdults,
                maxChildren: rt.maxChildren,
                totalInventory: rt.totalInventory,
                basePrice: Math.min(rt.basePrice || Infinity, rt.dailypricing?.[0]?.basePrice || Infinity) === Infinity
                    ? null
                    : Math.min(rt.basePrice || Infinity, rt.dailypricing?.[0]?.basePrice || Infinity)
            })),
            createdAt: hotel.createdAt,
            updatedAt: hotel.updatedAt
        };
    }

    /**
     * Maps a Point of Interest (POI) relational record
     */
    toHotelPOIDTO(poi) {
        if (!poi) return null;
        return {
            id: poi.id,
            distance: poi.distance,
            calculatedDistance: poi.calculatedDistance || poi.distance,
            description: poi.description,
            order: poi.order,
            attraction: poi.attraction ? {
                id: poi.attraction.id,
                name: poi.attraction.name,
                latitude: poi.attraction.latitude,
                longitude: poi.attraction.longitude
            } : null
        };
    }
}

export const hotelMapper = new HotelMapper();
