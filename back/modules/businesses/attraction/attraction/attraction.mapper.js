/**
 * Data Mapper for Attraction module.
 * Converts Prisma models into standardized DTOs.
 */
class AttractionMapper {
    /**
     * Converts a single Attraction Prisma model with relations to an Attraction DTO
     */
    toAttractionDTO(attraction) {
        if (!attraction) return null;

        const { attractionimage, attractionstat, attractionworkinghour, ...rest } = attraction;

        return {
            ...rest,
            images: attractionimage ? attractionimage.map(img => ({
                url: img.url,
                type: img.type,
                isCover: img.isCover,
                order: img.order
            })) : [],
            stats: attractionstat || null,
            workingHours: attractionworkinghour || []
        };
    }
}

export const attractionMapper = new AttractionMapper();
