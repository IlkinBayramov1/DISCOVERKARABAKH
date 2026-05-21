import favoriteService from './favorite.service.js';

class FavoriteController {
    async toggleFavorite(req, res) {
        try {
            const { targetId, type } = req.body;
            const userId = req.user.id; // From auth middleware

            if (!targetId || !type) {
                return res.status(400).json({ success: false, message: 'Missing targetId or type' });
            }

            const result = await favoriteService.toggleFavorite(userId, targetId, type);
            res.status(200).json({ success: true, ...result });
        } catch (error) {
            console.error('[FavoriteController] toggle error:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getMyFavorites(req, res) {
        try {
            const userId = req.user.id;
            const favorites = await favoriteService.getUserFavorites(userId);
            res.status(200).json({ success: true, data: favorites });
        } catch (error) {
            console.error('[FavoriteController] getFavorites error:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

export default new FavoriteController();
