import { Router } from 'express';
import multer from 'multer';
import { utilityController } from './utility.controller.js';
import { authMiddleware, authorize } from '../../../middlewares/auth.middleware.js';

const router = Router();

// Multer memory storage configuration (Excel files are processed in memory)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Axtarış üçün Rate Limiter (IP-yə görə dəqiqədə maks 5 sorğu)
const rateLimitWindow = 60 * 1000;
const rateLimitMax = 5;
const ipRequests = new Map();

const searchRateLimiter = (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const now = Date.now();

    if (!ipRequests.has(ip)) {
        ipRequests.set(ip, []);
    }

    const requestTimes = ipRequests.get(ip).filter(time => now - time < rateLimitWindow);
    requestTimes.push(now);
    ipRequests.set(ip, requestTimes);

    if (requestTimes.length > rateLimitMax) {
        return res.status(429).json({
            success: false,
            message: 'Çoxlu sayda sorğu göndərilib. Zəhmət olmasa bir dəqiqə sonra yenidən cəhd edin.'
        });
    }

    next();
};

/* ==========================================================================
   Resident Routes (Sakinlər üçün Marşrutlar)
   ========================================================================== */

// Anonim axtarış (Rate Limit ilə qorunur)
router.get('/search', searchRateLimiter, utilityController.searchBills);

// Sakin öz profilinə bağlı abonent kodlarını və borclarını görməsi (Smart Link)
router.get('/resident-bills', authMiddleware, utilityController.getResidentBills);

// Sakin üçün ödəniş sessiyasının başladılması (Profil tamlığı yoxlanılır)
router.post('/pay', authMiddleware, utilityController.initiatePayment);

// Ödəniş məlumatlarını almaq və tamamlamaq
router.get('/payment/:id', authMiddleware, utilityController.getPaymentDetails);
router.post('/payment/:id/complete', authMiddleware, utilityController.completePayment);

// İstifadəçinin bütün kommunal ödənişlərini görmək (My Trips üçün)
router.get('/my-payments', authMiddleware, utilityController.getMyPayments);

/* ==========================================================================
   Payment Webhook & Mock Gateway Routes
   ========================================================================== */

// Ödəniş provayderi Webhook endpointi (Server-to-Server callback)
router.post('/webhook/payment-status', utilityController.webhookPayment);

// Test/Manual yoxlama üçün mock ödəniş qapısı
router.get('/mock-payment-gateway', utilityController.mockPaymentGateway);

/* ==========================================================================
   Vendor Routes (Qurum / Dövlət Adminləri üçün Marşrutlar)
   ========================================================================== */

// Excel borc cədvəlini yükləmək (Önbaxış qaytarır)
router.post(
    '/upload',
    authMiddleware,
    authorize('vendor'),
    upload.single('file'),
    utilityController.uploadExcel
);

// Önbaxışda təsdiq edilən borcları bazaya yazmaq
router.post('/confirm-upload', authMiddleware, authorize('vendor'), utilityController.confirmUpload);

// Səhv yüklənmiş borc paketini geri qaytarmaq (Rollback)
router.delete('/rollback-upload/:batchId', authMiddleware, authorize('vendor'), utilityController.rollbackUpload);

// Yükləmə tarixçəsi logları
router.get('/upload-logs', authMiddleware, authorize('vendor'), utilityController.getUploadLogs);

// Abonentlər (Sakinlər) siyahısı
router.get('/subscribers', authMiddleware, authorize('vendor'), utilityController.getSubscribers);

// Dashboard Analitikası
router.get('/analytics', authMiddleware, authorize('vendor'), utilityController.getAnalytics);

export default router;
