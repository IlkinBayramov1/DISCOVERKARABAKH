import { httpClient } from '../../../shared/api/httpClient';

export interface UtilityAbonent {
    id: string;
    abonentCode: string;
    residentName: string;
    localAddress: string | null;
    utilitybill: UtilityBill[];
}

export interface UtilityBill {
    id: string;
    utilityType: string;
    amount: number;
    paidAmount: number;
    status: 'unpaid' | 'partially_paid' | 'paid';
    dueDate: string;
    billingMonth: string;
}

export interface SearchResponse {
    abonent: UtilityAbonent | null;
    bills: UtilityBill[];
}

export interface PaymentInitiateResponse {
    paymentId: string;
    transactionId: string;
    totalAmount: number;
    paymentUrl: string;
}

export const utilityApi = {
    // Abonent kodu ilə anonim və ya qeydiyyatlı axtarış
    searchBills: (code: string, type?: string) => {
        const query = type ? `&type=${type}` : '';
        return httpClient<{ data: SearchResponse }>(`/utility/search?code=${encodeURIComponent(code)}${query}`);
    },

    // Qeydiyyatdan keçmiş istifadəçinin özünə bağlı abonent kodları (Smart Link)
    getResidentBills: (type?: string) => {
        const query = type ? `?type=${type}` : '';
        return httpClient<{ data: UtilityAbonent[] }>(`/utility/resident-bills${query}`);
    },

    // Seçilmiş borclar üçün ödəniş sessiyasının başladılması
    initiatePayment: (billPayments: Array<{ billId: string; amountToPay: number }>) => {
        return httpClient<{ data: PaymentInitiateResponse }>('/utility/pay', {
            method: 'POST',
            data: { billPayments }
        });
    },

    // Ödəniş detallarını əldə etmək
    getPaymentDetails: (paymentId: string) => {
        return httpClient<{ data: any }>(`/utility/payment/${paymentId}`);
    },

    // Ödənişi tamamlamaq
    completePayment: (paymentId: string) => {
        return httpClient<{ data: any }>(`/utility/payment/${paymentId}/complete`, {
            method: 'POST'
        });
    },

    // İstifadəçinin bütün kommunal ödənişlərini gətirmək (My Trips üçün)
    getMyPayments: () => {
        return httpClient<{ data: any[] }>('/utility/my-payments');
    }
};
