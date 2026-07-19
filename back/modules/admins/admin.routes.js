import { Router } from 'express';
import {
    getAllUsers,
    getUserDetails,
    deleteUser,
    banUser,
    unbanUser,
    approveUser,
    rejectUser,
    getAllBusinesses,
    getPendingBusinesses,
    approveBusiness,
    rejectBusiness,
    getBlacklist,
    addToBlacklist,
    removeFromBlacklist,
    getRiskLogs,
    getPlatformAnalytics,
    getPricingRules,
    createPricingRule,
    deletePricingRule,
    getAllBookings,
    getBookingDetails,
    updateBookingStatus,
    getAllReviews,
    updateReviewStatus,
    deleteReview,
    getReviewReports,
    updateReviewReportStatus,
    getAllTransactions,
    getTransactionDetails,
    getCompanyTurnoverStats,
    getUserWalletStats,
    getUserFinancialDetails,
    getAllPromotions,
    createPromotion,
    deletePromotion,
    getNotifications,
    sendAnnouncement,
    deleteNotification
} from './admin.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import roleMiddleware from '../../middlewares/role.middleware.js';

const router = Router();

// Bütün marşrutlar admin girişi tələb edir
router.use(authMiddleware);
router.use(roleMiddleware('admin'));

// 1. İstifadəçi İdarəetməsi
router.get('/users', getAllUsers);
router.get('/users/:id', getUserDetails);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/ban', banUser);
router.patch('/users/:id/unban', unbanUser);
router.patch('/users/:id/approve', approveUser);
router.patch('/users/:id/reject', rejectUser);

// 2. Biznes İdarəetməsi (Global & Category-based)
router.get('/businesses', getAllBusinesses);
router.get('/businesses/pending', getPendingBusinesses);
router.patch('/businesses/:type/:id/approve', approveBusiness);
router.patch('/businesses/:type/:id/reject', rejectBusiness);

// 3. Bron İdarəetməsi (Booking Management)
router.get('/bookings', getAllBookings);
router.get('/bookings/:id', getBookingDetails);
router.patch('/bookings/:id/status', updateBookingStatus);

// 4. Rəy Moderasiyası (Review Moderation)
router.get('/reviews', getAllReviews);
router.patch('/reviews/:id/status', updateReviewStatus);
router.delete('/reviews/:id', deleteReview);
router.get('/reviews/reports', getReviewReports);
router.patch('/reviews/reports/:reportId', updateReviewReportStatus);

// 5. Maliyyə Nəzarəti (Financial Control)
router.get('/finance/transactions', getAllTransactions);
router.get('/finance/transactions/:id', getTransactionDetails);
router.get('/finance/stats/companies', getCompanyTurnoverStats);
router.get('/finance/stats/users', getUserWalletStats);
router.get('/finance/stats/users/:id', getUserFinancialDetails);

// 6. Promosiyalar və Kuponlar (Promotions)
router.get('/promotions', getAllPromotions);
router.post('/promotions', createPromotion);
router.delete('/promotions/:id', deletePromotion);

// 7. Moderasiya (Fraud & Blacklist)
router.get('/fraud/blacklist', getBlacklist);
router.post('/fraud/blacklist', addToBlacklist);
router.delete('/fraud/blacklist/:id', removeFromBlacklist);
router.get('/fraud/risk-logs', getRiskLogs);

// 8. Analitika
router.get('/analytics', getPlatformAnalytics);

// 10. Bildirişlər və Elanlar (Notifications)
router.get('/notifications', getNotifications);
router.post('/notifications/announcement', sendAnnouncement);
router.delete('/notifications/:id', deleteNotification);

export default router;
