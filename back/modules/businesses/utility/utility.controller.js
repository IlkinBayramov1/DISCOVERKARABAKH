import { utilityService } from './utility.service.js';
import { successResponse } from '../../../core/api.response.js';
import { ApiError } from '../../../core/api.error.js';

class UtilityController {
    /**
     * Sakin üçün abonent koduna görə axtarış.
     */
    async searchBills(req, res, next) {
        try {
            const { code, type } = req.query;
            if (!code) {
                throw ApiError.badRequest('Abonent kodu daxil edilməlidir.');
            }

            const data = await utilityService.searchBills(code, type);
            return successResponse(res, data, { message: 'Abonent borcları uğurla gətirildi.' });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Giriş etmiş sakinin öz borclarını (Smart Link) çəkmək.
     */
    async getResidentBills(req, res, next) {
        try {
            const { type } = req.query;
            const data = await utilityService.getResidentBills(req.user.id, type);
            return successResponse(res, data);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Excel borc faylını yükləyir və validasiya edib önbaxış (preview) qaytarır.
     */
    async uploadExcel(req, res, next) {
        try {
            if (!req.file) {
                throw ApiError.badRequest('Excel faylı seçilməyib.');
            }

            const data = await utilityService.createBillsFromExcel(
                req.user.id,
                req.file.buffer,
                req.file.originalname
            );

            return successResponse(res, data, { message: 'Excel faylı uğurla oxundu və validasiya edildi.' });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Önbaxışda təsdiq edilən borcları bazaya yazır.
     */
    async confirmUpload(req, res, next) {
        try {
            const { batchId, preview, fileName } = req.body;
            if (!batchId || !preview || !Array.isArray(preview)) {
                throw ApiError.badRequest('Düzgün batchId və preview məlumatları göndərilməyib.');
            }

            const log = await utilityService.confirmUpload(req.user.id, batchId, preview, fileName || 'excel_upload.xlsx');
            return successResponse(res, log, { message: 'Borclar uğurla bazaya yazıldı və təsdiqləndi.' }, 201);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Səhv yüklənmiş paketi geri qaytarır.
     */
    async rollbackUpload(req, res, next) {
        try {
            const { batchId } = req.params;
            if (!batchId) {
                throw ApiError.badRequest('batchId daxil edilməlidir.');
            }

            const updatedLog = await utilityService.rollbackUpload(req.user.id, batchId);
            return successResponse(res, updatedLog, { message: 'Excel paketi və ona aid bütün borclar uğurla geri alındı.' });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Vendor üçün yükləmə logları siyahısı.
     */
    async getUploadLogs(req, res, next) {
        try {
            const logs = await utilityService.getUploadLogs(req.user.id);
            return successResponse(res, logs);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Vendor üçün sakinlər (abonentlər) siyahısı.
     */
    async getSubscribers(req, res, next) {
        try {
            const subscribers = await utilityService.getSubscribers(req.user.id);
            return successResponse(res, subscribers, { count: subscribers.length });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Vendor üçün dashboard analitik məlumatları.
     */
    async getAnalytics(req, res, next) {
        try {
            const analytics = await utilityService.getAnalytics(req.user.id);
            return successResponse(res, analytics);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Ödəniş başlatmaq.
     */
    async initiatePayment(req, res, next) {
        try {
            const { billPayments } = req.body;
            if (!billPayments || !Array.isArray(billPayments) || billPayments.length === 0) {
                throw ApiError.badRequest('Ödəniləcək borc məlumatları göndərilməyib.');
            }

            const paymentSession = await utilityService.initiatePayment(req.user.id, billPayments);
            return successResponse(res, paymentSession, { message: 'Ödəniş sessiyası uğurla başladıldı.' });
        } catch (error) {
            if (error instanceof ApiError && error.message === 'INCOMPLETE_PROFILE') {
                return res.status(400).json({
                    success: false,
                    code: 'INCOMPLETE_PROFILE',
                    message: 'Ödəniş etmək üçün profildə Ad, Soyad, Email və Telefon nömrəsi tamamlanmalıdır.'
                });
            }
            next(error);
        }
    }

    /**
     * Ödəniş provayderi Webhook endpointi.
     */
    async webhookPayment(req, res, next) {
        try {
            const { transactionId, status, providerResponse } = req.body;
            if (!transactionId || !status) {
                throw ApiError.badRequest('Tranzaksiya ID və Status mütləqdir.');
            }

            const payment = await utilityService.processPaymentWebhook(transactionId, status, providerResponse);
            return successResponse(res, payment, { message: 'Ödəniş webhook emal edildi.' });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Manual / Test yoxlaması üçün Mock Ödəniş Gateway Səhifəsi
     */
    async mockPaymentGateway(req, res, next) {
        try {
            const { transId, amount } = req.query;
            
            // Sadə bir html səhifəsi qaytarırıq ki, ödənişi təsdiqləyib/rədd edib test edə bilsinlər.
            res.setHeader('Content-Type', 'text/html');
            res.send(`
                <html>
                    <head>
                        <title>Mock Payment Gateway</title>
                        <style>
                            body { font-family: sans-serif; background: #0f172a; color: white; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
                            .card { background: #1e293b; padding: 30px; border-radius: 12px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.5); width: 350px; }
                            h2 { margin-top: 0; color: #38bdf8; }
                            .amount { font-size: 24px; font-weight: bold; margin: 15px 0; color: #10b981; }
                            button { width: 100%; padding: 12px; margin: 8px 0; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; transition: 0.2s; }
                            .btn-success { background: #10b981; color: white; }
                            .btn-success:hover { background: #059669; }
                            .btn-fail { background: #ef4444; color: white; }
                            .btn-fail:hover { background: #dc2626; }
                        </style>
                    </head>
                    <body>
                        <div class="card">
                            <h2>Mock Payment Gateway</h2>
                            <p>Transakasiya ID: <strong>${transId}</strong></p>
                            <div class="amount">${amount} AZN</div>
                            <p>Test etmək üçün aşağıdakı düymələrdən birini seçin:</p>
                            <button class="btn-success" onclick="sendCallback('completed')">ÖDƏNİŞİ TƏSDİQLƏ (SUCCESS)</button>
                            <button class="btn-fail" onclick="sendCallback('failed')">ÖDƏNİŞİ RƏDD ET (FAIL)</button>
                        </div>
                        <script>
                            async function sendCallback(status) {
                                try {
                                    const res = await fetch('/api/v1/utility/webhook/payment-status', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ transactionId: '${transId}', status })
                                    });
                                    const data = await res.json();
                                    if (data.success) {
                                        if (status === 'completed') {
                                            window.location.href = \`http://localhost:5174/utility?success=true&transactionId=\${transId}&amount=\${amount}&abonentName=Ödəniş&billsCount=1\`;
                                        } else {
                                            window.location.href = 'http://localhost:5174/utility?error=payment_failed';
                                        }
                                    } else {
                                        alert('Xeta bas verdi: ' + data.message);
                                    }
                                } catch(e) {
                                    alert('Xeta: ' + e.message);
                                }
                            }
                        </script>
                    </body>
                </html>
            `);
        } catch (error) {
            next(error);
        }
    }

    async getPaymentDetails(req, res, next) {
        try {
            const { id } = req.params;
            const data = await utilityService.getPaymentDetails(id, req.user.id);
            return successResponse(res, data, { message: 'Ödəniş məlumatları uğurla gətirildi.' });
        } catch (error) {
            next(error);
        }
    }

    async completePayment(req, res, next) {
        try {
            const { id } = req.params;
            const data = await utilityService.completePayment(id, req.user.id);
            return successResponse(res, data, { message: 'Ödəniş uğurla tamamlandı.' });
        } catch (error) {
            next(error);
        }
    }

    async getMyPayments(req, res, next) {
        try {
            const data = await utilityService.getMyPayments(req.user.id);
            return successResponse(res, data, { count: data.length });
        } catch (error) {
            next(error);
        }
    }
}

export const utilityController = new UtilityController();
