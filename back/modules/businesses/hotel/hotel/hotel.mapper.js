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
        const reviewCount = hotel.reviews ? hotel.reviews.length : (hotel._count?.reviews || 0);
        let rating = 0;
        if (hotel.reviews && hotel.reviews.length > 0) {
            rating = hotel.reviews.reduce((sum, r) => sum + r.rating, 0) / hotel.reviews.length;
        }

        // Calculate Starting Price (Lowest price among all room types)
        let startingPrice = 0;
        if (hotel.roomTypes && hotel.roomTypes.length > 0) {
            const prices = hotel.roomTypes
                .map(rt => (rt.pricingList && rt.pricingList.length > 0 ? rt.pricingList[0].basePrice : Infinity))
                .filter(p => p !== Infinity);
            
            if (prices.length > 0) {
                startingPrice = Math.min(...prices);
            }
        }

        // Map POIs
        const nearbyPOIs = hotel.nearbyPOIs ? hotel.nearbyPOIs.map(poi => this.toHotelPOIDTO(poi)) : [];

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
            amenities: hotel.amenities ? hotel.amenities.map(a => ({
                amenity: { name: a.amenity.name }
            })) : [],
            images: hotel.images ? hotel.images.map(img => ({
                url: img.url,
                order: img.order
            })) : [],
            roomTypes: hotel.roomTypes ? hotel.roomTypes.map(rt => ({
                id: rt.id,
                name: rt.name,
                description: rt.description,
                baseOccupancy: rt.baseOccupancy,
                maxAdults: rt.maxAdults,
                maxChildren: rt.maxChildren,
                totalInventory: rt.totalInventory,
                basePrice: rt.basePrice || (rt.pricingList?.[0]?.basePrice) || null
            })) : [],
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
