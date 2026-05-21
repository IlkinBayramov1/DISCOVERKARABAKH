import { attractionImageRepository } from './attractionImage.repository.js';
import { ApiError } from '../../../../core/api.error.js';
import prisma from '../../../../config/db.js';

class AttractionImageService {
    async addImage(attractionId, { url, type = 'image', isCover = false, order = 0 }) {
        // Enforce only one cover image
        if (isCover) {
            await prisma.attractionImage.updateMany({
                where: { attractionId, isCover: true },
                data: { isCover: false }
            });
        }
        return await attractionImageRepository.create({ attractionId, url, type, isCover, order });
    }

    async getAttractionImages(attractionId) {
        return await attractionImageRepository.findByAttractionId(attractionId);
    }

    async deleteImage(id) {
        const image = await attractionImageRepository.findById(id);
        if (!image) throw ApiError.notFound('Image record not found');
        return await attractionImageRepository.delete(id);
    }

    async setCoverImage(attractionId, imageId) {
        await prisma.attractionImage.updateMany({
            where: { attractionId, isCover: true },
            data: { isCover: false }
        });

        return await attractionImageRepository.update(imageId, { isCover: true });
    }
}

export const attractionImageService = new AttractionImageService();
