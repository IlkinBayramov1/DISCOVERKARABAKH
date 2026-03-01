import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../../../core/api.error.js';

const prisma = new PrismaClient();

class MenuRepository {
    // --- CATEGORIES ---
    async createCategory(restaurantId, data) {
        return await prisma.menuCategory.create({
            data: {
                restaurantId,
                name: data.name,
                description: data.description,
                sortOrder: data.sortOrder || 0
            }
        });
    }

    async deleteCategory(id) {
        return await prisma.menuCategory.delete({ where: { id } });
    }

    // --- ITEMS ---
    async createItem(categoryId, data) {
        // Handle options if passed
        let optionsCreate = [];
        if (data.options && data.options.length > 0) {
            optionsCreate = data.options.map(opt => ({
                name: opt.name,
                choices: opt.choices, // Json structure
                isRequired: opt.isRequired || false,
                maxSelect: opt.maxSelect || 1
            }));
        }

        return await prisma.menuItem.create({
            data: {
                categoryId,
                name: data.name,
                description: data.description,
                price: parseFloat(data.price),
                imageUrl: data.imageUrl,
                isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
                options: {
                    create: optionsCreate
                }
            },
            include: { options: true }
        });
    }

    async updateItemAvailability(id, isAvailable) {
        return await prisma.menuItem.update({
            where: { id },
            data: { isAvailable }
        });
    }

    async deleteItem(id) {
        return await prisma.menuItem.delete({ where: { id } });
    }
}

export default new MenuRepository();
