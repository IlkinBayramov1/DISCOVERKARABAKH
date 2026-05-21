import api from '../../../lib/axios';
import type { 
    AdminBusinessResponse, 
    PendingBusinessesResponse, 
    AdminBusinessActionResponse,
    BusinessType
} from '../types';

export const businessAdminApi = {
    /** Bütün biznesləri gətirir (Tip və status filtrli) */
    getAllBusinesses: async (type?: BusinessType, status?: string): Promise<AdminBusinessResponse> => {
        const response = await api.get('/admins/businesses', {
            params: { type, status }
        });
        return response.data;
    },

    /** Təsdiq gözləyən müraciətləri gətirir (Hotels, Restaurants, Tours) */
    getPendingBusinesses: async (): Promise<PendingBusinessesResponse> => {
        const response = await api.get('/admins/businesses/pending');
        return response.data;
    },

    /** Biznesi təsdiqləyir (active statusuna keçirir) */
    approveBusiness: async (type: BusinessType, id: string): Promise<AdminBusinessActionResponse> => {
        const response = await api.patch(`/admins/businesses/${type}/${id}/approve`);
        return response.data;
    },

    /** Biznesi rədd edir (rejected statusuna keçirir) */
    rejectBusiness: async (type: BusinessType, id: string): Promise<AdminBusinessActionResponse> => {
        const response = await api.patch(`/admins/businesses/${type}/${id}/reject`);
        return response.data;
    },

    /** Hotelin bütün detallarını gətirir */
    getHotelDetails: async (id: string): Promise<any> => {
        const response = await api.get(`/admins/businesses/hotel/${id}`);
        return response.data;
    }
};

export default businessAdminApi;
