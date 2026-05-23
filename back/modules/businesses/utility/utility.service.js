import prisma from '../../../config/db.js';
import { ApiError } from '../../../core/api.error.js';
import xlsx from 'xlsx';

class UtilityService {
    /**
     * Sakin və ya qonaq üçün abonent koduna görə borcları axtarır.
     */
    async searchBills(abonentCode, utilityType) {
        const abonent = await prisma.utilityabonent.findUnique({
            where: { abonentCode }
        });

        if (!abonent) {
            return { abonent: null, bills: [] };
        }

        const bills = await prisma.utilitybill.findMany({
            where: {
                abonentCode,
                status: { in: ['unpaid', 'partially_paid'] },
                ...(utilityType ? { utilityType } : {})
            },
            orderBy: { dueDate: 'asc' }
        });

        return { abonent, bills };
    }

    /**
     * Sakinin userId-sinə bağlı olan bütün abonent kodlarını və onların borclarını gətirir (Smart Link).
     */
    async getResidentBills(userId, utilityType) {
        const abonents = await prisma.utilityabonent.findMany({
            where: { userId },
            include: {
                utilitybill: {
                    where: { 
                        status: { in: ['unpaid', 'partially_paid'] },
                        ...(utilityType ? { utilityType } : {})
                    }
                }
            }
        });

        if (utilityType) {
            return abonents.filter(a => a.utilitybill.length > 0);
        }

        return abonents;
    }

    /**
     * Excel faylını oxuyur və validasiya edib önbaxış (preview) qaytarır.
     */
    async createBillsFromExcel(userId, fileBuffer, fileName) {
        const vendor = await prisma.vendorprofile.findUnique({
            where: { userId }
        });

        if (!vendor) {
            throw ApiError.forbidden('Siz vendor deyilsiniz və ya profiliniz tapılmadı.');
        }

        const utilityType = vendor.category.toLowerCase();
        const allowedCategories = ['gas', 'electricity', 'water'];

        if (!allowedCategories.includes(utilityType)) {
            throw ApiError.badRequest('Kommunal borc yükləmək üçün vendor kateqoriyası gas, electricity və ya water olmalıdır.');
        }

        let workbook;
        try {
            workbook = xlsx.read(fileBuffer, { type: 'buffer' });
        } catch (e) {
            throw ApiError.badRequest('Excel faylı oxuna bilmədi. Zəhmət olmasa formatı yoxlayın.');
        }

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = xlsx.utils.sheet_to_json(worksheet);

        if (rows.length === 0) {
            throw ApiError.badRequest('Excel faylında heç bir məlumat tapılmadı.');
        }

        const errors = [];
        const validatedRows = [];
        const seenAbonentCodes = new Set();

        // Çevik sütun adları üçün xəritələşdirmə (case-insensitive və azərbaycan dilində açar sözlər)
        const getColumnValue = (row, keywords) => {
            const keys = Object.keys(row);
            for (const key of keys) {
                const lowerKey = key.toLowerCase().trim().replace(/_/g, ' ');
                if (keywords.some(kw => lowerKey === kw || lowerKey.includes(kw))) {
                    return row[key];
                }
            }
            return null;
        };

        rows.forEach((row, index) => {
            const rowNumber = index + 2; // Başlıq sətirini və 1-indexi nəzərə alaraq

            const abonentCode = String(getColumnValue(row, ['abonentcode', 'abonent kodu', 'abonent', 'id', 'code']) || '').trim();
            const residentName = String(getColumnValue(row, ['residentname', 'resident name', 'ad soyad', 'fullname', 'name']) || '').trim();
            const amountVal = getColumnValue(row, ['amount', 'borc', 'mebleq', 'price', 'borc mebleqi']);
            const dueDateVal = getColumnValue(row, ['duedate', 'due date', 'son tarix', 'son odenis']);
            const billingMonth = String(getColumnValue(row, ['billingmonth', 'billing month', 'ay', 'period']) || '').trim();

            // 1. Abonent Kodu Validasiyası
            if (!abonentCode) {
                errors.push({ row: rowNumber, error: 'Abonent kodu boş ola bilməz.' });
                return;
            }

            if (seenAbonentCodes.has(abonentCode)) {
                errors.push({ row: rowNumber, error: `Eyni Excel faylında təkrarlanan abonent kodu: ${abonentCode}` });
                return;
            }
            seenAbonentCodes.add(abonentCode);

            // 2. Ad Soyad Validasiyası
            if (!residentName) {
                errors.push({ row: rowNumber, error: 'Sakin Ad/Soyadı boş ola bilməz.' });
                return;
            }

            // 3. Məbləğ Validasiyası
            const amount = parseFloat(amountVal);
            if (isNaN(amount) || amount <= 0) {
                errors.push({ row: rowNumber, error: `Məbləğ düzgün daxil edilməyib və ya sıfırdan kiçikdir: ${amountVal}` });
                return;
            }

            // 4. Tarix Validasiyası ( dueDate )
            let dueDate = null;
            if (dueDateVal) {
                // Excel daxili tarix formatını dəstəkləmək
                if (typeof dueDateVal === 'number') {
                    // Excel serial date to JS Date
                    dueDate = new Date((dueDateVal - 25569) * 86400 * 1000);
                } else {
                    dueDate = new Date(dueDateVal);
                }
            }
            if (!dueDate || isNaN(dueDate.getTime())) {
                errors.push({ row: rowNumber, error: `Son ödəniş tarixi səhvdir: ${dueDateVal}` });
                return;
            }

            // 5. Ay Validasiyası (Billing Month: YYYY-MM)
            const monthRegex = /^\d{4}-\d{2}$/;
            if (!monthRegex.test(billingMonth)) {
                errors.push({ row: rowNumber, error: `Dövriyyə ayı YYYY-MM formatında olmalıdır (məs. 2026-05): ${billingMonth}` });
                return;
            }

            validatedRows.push({
                abonentCode,
                residentName,
                amount,
                dueDate,
                billingMonth
            });
        });

        if (errors.length > 0) {
            return { success: false, errors };
        }

        return {
            success: true,
            preview: validatedRows,
            rowCount: validatedRows.length,
            utilityType
        };
    }

    /**
     * Validasiya olunmuş borcları bazaya yazır (Təsdiqləmə addımı).
     */
    async confirmUpload(userId, batchId, validatedRows, fileName) {
        const vendor = await prisma.vendorprofile.findUnique({
            where: { userId }
        });
        if (!vendor) throw ApiError.forbidden('Vendor profiliniz tapılmadı.');

        const utilityType = vendor.category.toLowerCase();

        return await prisma.$transaction(async (tx) => {
            // 1. Yükləmə logunu yaratmaq
            const uploadLog = await tx.utilityuploadlog.create({
                data: {
                    batchId,
                    fileName,
                    rowCount: validatedRows.length,
                    successCount: validatedRows.length,
                    errorCount: 0,
                    uploadedByAdminId: userId
                }
            });

            // 2. Abonent və borc məlumatlarını yazmaq
            for (const row of validatedRows) {
                // Əvvəlcə abonent profilini upsert edirik (ad soyadı dəyişibsə yeniləyirik)
                // Qeyd: Eyni adda qeydiyyatlı user varsa, smart link üçün userId-ni bağlaya bilərik
                const words = row.residentName.split(' ');
                let matchedUserId = null;

                if (words.length >= 2) {
                    const potentialUser = await tx.user.findFirst({
                        where: {
                            firstName: { equals: words[0] },
                            lastName: { equals: words[1] },
                            role: 'resident'
                        }
                    });
                    if (potentialUser) matchedUserId = potentialUser.id;
                }

                await tx.utilityabonent.upsert({
                    where: { abonentCode: row.abonentCode },
                    update: { 
                        residentName: row.residentName,
                        ...(matchedUserId ? { userId: matchedUserId } : {})
                    },
                    create: {
                        abonentCode: row.abonentCode,
                        residentName: row.residentName,
                        userId: matchedUserId
                    }
                });

                // Borc qeydini yaradırıq (əgər eyni ayda borc varsa yeniləyirik)
                await tx.utilitybill.upsert({
                    where: {
                        abonentCode_utilityType_billingMonth: {
                            abonentCode: row.abonentCode,
                            utilityType,
                            billingMonth: row.billingMonth
                        }
                    },
                    update: {
                        amount: row.amount,
                        dueDate: new Date(row.dueDate),
                        batchId,
                        status: 'unpaid',
                        paidAmount: 0
                    },
                    create: {
                        abonentCode: row.abonentCode,
                        utilityType,
                        amount: row.amount,
                        dueDate: new Date(row.dueDate),
                        billingMonth: row.billingMonth,
                        batchId,
                        status: 'unpaid'
                    }
                });
            }

            return uploadLog;
        });
    }

    /**
     * Səhvən yüklənmiş Excel faylındakı bütün borcları geri qaytarır.
     */
    async rollbackUpload(userId, batchId) {
        const log = await prisma.utilityuploadlog.findUnique({
            where: { batchId }
        });

        if (!log) throw ApiError.notFound('Müvafiq yükləmə logu tapılmadı.');
        if (log.uploadedByAdminId !== userId) throw ApiError.forbidden('Bu əməliyyata icazəniz yoxdur.');
        if (log.isRolledBack) throw ApiError.badRequest('Bu yükləmə artıq geri qaytarılıb.');

        // Təhlükəsizlik: Əgər bu batch-də ödənilmiş hər hansı bir borc varsa geri qaytarmağa icazə verilmir
        const paidBillsCount = await prisma.utilitybill.count({
            where: {
                batchId,
                OR: [
                    { paidAmount: { gt: 0 } },
                    { status: { in: ['paid', 'partially_paid'] } }
                ]
            }
        });

        if (paidBillsCount > 0) {
            throw ApiError.badRequest('Bu paketi geri qaytarmaq olmaz, çünki artıq bəzi sakinlər ödəniş edib.');
        }

        return await prisma.$transaction(async (tx) => {
            // Borcları silirik
            await tx.utilitybill.deleteMany({
                where: { batchId }
            });

            // Logu yeniləyirik
            return await tx.utilityuploadlog.update({
                where: { batchId },
                data: {
                    isRolledBack: true,
                    rolledBackAt: new Date()
                }
            });
        });
    }

    /**
     * Sakin üçün ödənişi başladır (Profil yoxlanışı ilə).
     */
    async initiatePayment(userId, billPayments) {
        // billPayments = [{ billId: '...', amountToPay: 20 }]
        
        // 1. Profil doluluğu yoxlanışı
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) throw ApiError.unauthorized('İstifadəçi tapılmadı.');

        if (!user.firstName || !user.lastName || !user.email || !user.phone) {
            throw new ApiError(400, 'INCOMPLETE_PROFILE'); 
        }

        let totalAmount = 0;
        const verifiedItems = [];

        // 2. Borcların mövcudluğunu və məbləğləri yoxlamaq
        for (const item of billPayments) {
            const bill = await prisma.utilitybill.findUnique({
                where: { id: item.billId }
            });

            if (!bill) throw ApiError.notFound(`Borc tapılmadı: ${item.billId}`);
            
            const remainingDebt = bill.amount - bill.paidAmount;
            if (item.amountToPay <= 0 || item.amountToPay > remainingDebt) {
                throw ApiError.badRequest(`Ödəniləcək məbləğ (${item.amountToPay} AZN) qalıq borcdan (${remainingDebt} AZN) çox ola bilməz.`);
            }

            totalAmount += item.amountToPay;
            verifiedItems.push({
                billId: bill.id,
                amountPaid: item.amountToPay
            });
        }

        // 3. Ödəniş və ödəniş elementlərini bazada yaratmaq (Status = pending)
        const payment = await prisma.utilitypayment.create({
            data: {
                totalAmount,
                userId,
                paymentStatus: 'pending',
                utilitypaymentitem: {
                    create: verifiedItems
                }
            },
            include: {
                utilitypaymentitem: true
            }
        });

        // Burada Azericard və ya digər ödəniş provayderinin API-si çağırılaraq paymentUrl alınmalıdır.
        // Test/Mock mühiti üçün simulyasiya URL-i qaytarırıq.
        const mockTransactionId = `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        
        await prisma.utilitypayment.update({
            where: { id: payment.id },
            data: { transactionId: mockTransactionId }
        });

        return {
            paymentId: payment.id,
            transactionId: mockTransactionId,
            totalAmount,
            paymentUrl: `http://localhost:4004/api/v1/utility/mock-payment-gateway?transId=${mockTransactionId}&amount=${totalAmount}`
        };
    }

    /**
     * Provayderdən gələn Payment Webhook (callback) məlumatını emal edir.
     */
    async processPaymentWebhook(transactionId, status, providerResponse = '') {
        const payment = await prisma.utilitypayment.findUnique({
            where: { transactionId },
            include: { utilitypaymentitem: true }
        });

        if (!payment) throw ApiError.notFound('Tranzaksiya tapılmadı.');
        if (payment.paymentStatus !== 'pending') return payment; // Artıq emal olunub

        return await prisma.$transaction(async (tx) => {
            // Ödəniş statusunu yeniləyirik
            const updatedPayment = await tx.utilitypayment.update({
                where: { id: payment.id },
                data: {
                    paymentStatus: status, // 'completed' or 'failed'
                    paymentMethod: 'card'
                }
            });

            if (status === 'completed') {
                for (const item of payment.utilitypaymentitem) {
                    const bill = await tx.utilitybill.findUnique({
                        where: { id: item.billId }
                    });

                    if (bill) {
                        const newPaidAmount = bill.paidAmount + item.amountPaid;
                        const newStatus = newPaidAmount >= bill.amount ? 'paid' : 'partially_paid';

                        await tx.utilitybill.update({
                            where: { id: bill.id },
                            data: {
                                paidAmount: newPaidAmount,
                                status: newStatus
                            }
                        });
                    }
                }
            }

            return updatedPayment;
        });
    }

    /**
     * Vendorlar üçün yükləmə tarixçəsi logları.
     */
    async getUploadLogs(userId) {
        return prisma.utilityuploadlog.findMany({
            where: { uploadedByAdminId: userId },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Vendor üçün abonentlər və onların borclarının siyahısı.
     */
    async getSubscribers(userId) {
        const vendor = await prisma.vendorprofile.findUnique({
            where: { userId }
        });
        if (!vendor) throw ApiError.forbidden('Vendor profiliniz tapılmadı.');

        const utilityType = vendor.category.toLowerCase();

        return prisma.utilityabonent.findMany({
            where: {
                utilitybill: {
                    some: { utilityType }
                }
            },
            include: {
                utilitybill: {
                    where: { utilityType }
                }
            }
        });
    }

    /**
     * Dashboard üçün analitik məlumatlar.
     */
    async getAnalytics(userId) {
        const vendor = await prisma.vendorprofile.findUnique({
            where: { userId }
        });
        if (!vendor) throw ApiError.forbidden('Vendor profiliniz tapılmadı.');

        const utilityType = vendor.category.toLowerCase();

        // 1. Ümumi borc, yığılmış borc, qalıq borc
        const bills = await prisma.utilitybill.findMany({
            where: { utilityType }
        });

        let totalBilled = 0;
        let totalPaid = 0;
        let overdueCount = 0;
        const now = new Date();

        bills.forEach(bill => {
            totalBilled += bill.amount;
            totalPaid += bill.paidAmount;
            if (bill.status !== 'paid' && new Date(bill.dueDate) < now) {
                overdueCount++;
            }
        });

        const collectionRate = totalBilled > 0 ? ((totalPaid / totalBilled) * 100).toFixed(1) : 0;

        // 2. Son 7 gün üzrə günlük ödəniş həcmləri
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentPayments = await prisma.utilitypayment.findMany({
            where: {
                paymentStatus: 'completed',
                createdAt: { gte: sevenDaysAgo },
                utilitypaymentitem: {
                    some: {
                        bill: { utilityType }
                    }
                }
            },
            include: {
                utilitypaymentitem: {
                    include: { bill: true }
                }
            }
        });

        const dailyData = {};
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            dailyData[dateStr] = 0;
        }

        recentPayments.forEach(pay => {
            const dateStr = pay.createdAt.toISOString().split('T')[0];
            if (dailyData[dateStr] !== undefined) {
                // Yalnız bu vendorun kommunal tipinə aid ödəniş hissələrini toplayırıq
                pay.utilitypaymentitem.forEach(item => {
                    if (item.bill.utilityType === utilityType) {
                        dailyData[dateStr] += item.amountPaid;
                    }
                });
            }
        });

        const dailyChart = Object.keys(dailyData).map(date => ({
            date,
            amount: dailyData[date]
        }));

        return {
            summary: {
                totalBilled,
                totalPaid,
                totalRemaining: totalBilled - totalPaid,
                overdueCount,
                collectionRate: parseFloat(collectionRate)
            },
            dailyChart
        };
    }

    async getPaymentDetails(paymentId, userId) {
        const payment = await prisma.utilitypayment.findFirst({
            where: { id: paymentId, userId },
            include: {
                utilitypaymentitem: {
                    include: {
                        bill: {
                            include: {
                                abonent: true
                            }
                        }
                    }
                }
            }
        });

        if (!payment) {
            throw ApiError.notFound('Ödəniş tapılmadı.');
        }

        const firstItem = payment.utilitypaymentitem[0];
        const abonentCode = firstItem?.bill?.abonentCode || 'N/A';
        const abonentName = firstItem?.bill?.abonent?.residentName || 'Qeydiyyatsız Abonent';

        return {
            id: payment.id,
            transactionId: payment.transactionId,
            totalAmount: payment.totalAmount,
            paymentStatus: payment.paymentStatus,
            paymentMethod: payment.paymentMethod,
            createdAt: payment.createdAt,
            abonentCode,
            abonentName,
            items: payment.utilitypaymentitem.map(item => ({
                id: item.id,
                billId: item.billId,
                amountPaid: item.amountPaid,
                utilityType: item.bill?.utilityType,
                billingMonth: item.bill?.billingMonth
            }))
        };
    }

    async completePayment(paymentId, userId) {
        const payment = await prisma.utilitypayment.findFirst({
            where: { id: paymentId, userId },
            include: {
                utilitypaymentitem: {
                    include: {
                        bill: {
                            include: {
                                abonent: true
                            }
                        }
                    }
                }
            }
        });

        if (!payment) {
            throw ApiError.notFound('Ödəniş tapılmadı.');
        }

        if (payment.paymentStatus !== 'pending') {
            return this.getPaymentDetails(paymentId, userId);
        }

        await prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({
                where: { id: userId }
            });

            if (!user) {
                throw ApiError.notFound('İstifadəçi tapılmadı.');
            }

            if (user.balance < payment.totalAmount) {
                throw ApiError.badRequest('Balansınızda kifayət qədər vəsait yoxdur.');
            }

            // 1. Decrement user balance
            await tx.user.update({
                where: { id: userId },
                data: {
                    balance: {
                        decrement: payment.totalAmount
                    }
                }
            });

            // 2. Create wallet transaction
            const firstItem = payment.utilitypaymentitem[0];
            const utilityType = firstItem?.bill?.utilityType;
            const abonentCode = firstItem?.bill?.abonentCode || 'N/A';
            
            const providerNames = {
                gas: 'Azəriqaz',
                water: 'Azərsu',
                electricity: 'Azərişıq'
            };
            const providerName = providerNames[utilityType] || 'Kommunal Xidmət';
            const description = `${providerName} ödənişi (Abonent: ${abonentCode})`;

            await tx.wallettransaction.create({
                data: {
                    userId,
                    amount: payment.totalAmount,
                    type: 'payment',
                    status: 'COMPLETED',
                    description
                }
            });

            // 3. Update payment status
            await tx.utilitypayment.update({
                where: { id: payment.id },
                data: {
                    paymentStatus: 'completed',
                    paymentMethod: 'DiscoverKarabakh Wallet'
                }
            });

            // 4. Update utility bills
            for (const item of payment.utilitypaymentitem) {
                const bill = await tx.utilitybill.findUnique({
                    where: { id: item.billId }
                });

                if (bill) {
                    const newPaidAmount = bill.paidAmount + item.amountPaid;
                    const newStatus = newPaidAmount >= bill.amount ? 'paid' : 'partially_paid';

                    await tx.utilitybill.update({
                        where: { id: bill.id },
                        data: {
                            paidAmount: newPaidAmount,
                            status: newStatus
                        }
                    });
                }
            }
        });

        return this.getPaymentDetails(paymentId, userId);
    }

    /**
     * İstifadəçinin bütün kommunal ödənişlərini siyahısını qaytarır (My Trips üçün)
     */
    async getMyPayments(userId) {
        const payments = await prisma.utilitypayment.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                utilitypaymentitem: {
                    include: {
                        bill: {
                            include: { abonent: true }
                        }
                    }
                }
            }
        });

        return payments.map(payment => {
            const firstItem = payment.utilitypaymentitem[0];
            const abonentCode = firstItem?.bill?.abonentCode || 'N/A';
            const abonentName = firstItem?.bill?.abonent?.residentName || 'Qeydiyyatsız Abonent';
            const utilityType = firstItem?.bill?.utilityType || 'utility';

            return {
                id: payment.id,
                transactionId: payment.transactionId,
                totalAmount: payment.totalAmount,
                paymentStatus: payment.paymentStatus,
                paymentMethod: payment.paymentMethod,
                createdAt: payment.createdAt,
                abonentCode,
                abonentName,
                utilityType,
                itemCount: payment.utilitypaymentitem.length
            };
        });
    }
}

export const utilityService = new UtilityService();
