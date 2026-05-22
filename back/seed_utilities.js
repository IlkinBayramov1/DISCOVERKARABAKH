import prisma from './config/db.js';

async function seed() {
    console.log('Test məlumatları yaradılır...');
    try {
        const abonents = [
            { code: 'AZ10001', name: 'Əli Həsənov' },
            { code: 'AZ10002', name: 'Vəli Əliyev' },
            { code: 'AZ10003', name: 'Günel Məmmədova' },
            { code: 'AZ10004', name: 'Leyla Hüseynova' },
            { code: 'AZ10005', name: 'Rəşad Məmmədov' },
            { code: 'AZ10006', name: 'Aysel Kərimova' },
            { code: 'AZ10007', name: 'İlkin Bayramov' },
            { code: 'AZ10008', name: 'Nigar Mustafayeva' },
            { code: 'AZ10009', name: 'Elvin Quliyev' },
            { code: 'AZ10010', name: 'Fərid Səmədov' },
            { code: 'AZ10011', name: 'Ləman Məlikova' },
            { code: 'AZ10012', name: 'Samir Cavadov' },
            { code: 'AZ10013', name: 'Fidan Əliyeva' },
        ];

        for (const ab of abonents) {
            // Abonent profili
            await prisma.utilityabonent.upsert({
                where: { abonentCode: ab.code },
                update: {},
                create: { abonentCode: ab.code, residentName: ab.name }
            });

            // Qaz, Su və İşıq üçün borclar
            const types = ['gas', 'water', 'electricity'];
            for (const t of types) {
                // 15 ilə 65 AZN arası təsadüfi məbləğ
                const randomAmount = Math.floor(Math.random() * 50) + 15;
                
                await prisma.utilitybill.upsert({
                    where: {
                        abonentCode_utilityType_billingMonth: {
                            abonentCode: ab.code,
                            utilityType: t,
                            billingMonth: '2026-05'
                        }
                    },
                    update: {},
                    create: {
                        abonentCode: ab.code,
                        utilityType: t,
                        amount: randomAmount,
                        dueDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
                        billingMonth: '2026-05',
                        status: 'unpaid',
                        batchId: 'mock-batch-123'
                    }
                });
            }
        }
        console.log('Möhtəşəm! AZ10001-dən AZ10013-ə qədər bütün abonentlər və onların borcları uğurla yaradıldı.');
    } catch (e) {
        console.error('Xəta baş verdi:', e);
    } finally {
        await prisma.$disconnect();
    }
}

seed();
