import api from '../../../lib/axios';
import type { AdminUsersResponse, AdminUserActionResponse, AdminUserDetailResponse } from '../types';

export const userAdminApi = {
    /** Bütün istifadəçiləri gətirir */
    getUsers: async (): Promise<AdminUsersResponse> => {
        const response = await api.get('/admins/users');
        return response.data;
    },

    /** İstifadəçinin detallarını gətirir */
    getUserDetails: async (id: string): Promise<AdminUserDetailResponse> => {
        const response = await api.get(`/admins/users/${id}`);
        return response.data;
    },

    /** İstifadəçini ban edir */
    banUser: async (id: string): Promise<AdminUserActionResponse> => {
        const response = await api.patch(`/admins/users/${id}/ban`);
        return response.data;
    },

    /** İstifadəçinin banını qaldırır */
    unbanUser: async (id: string): Promise<AdminUserActionResponse> => {
        const response = await api.patch(`/admins/users/${id}/unban`);
        return response.data;
    },

    /** Vendoru təsdiqləyir */
    approveUser: async (id: string): Promise<AdminUserActionResponse> => {
        const response = await api.patch(`/admins/users/${id}/approve`);
        return response.data;
    },

    /** Vendoru rədd edir */
    rejectUser: async (id: string): Promise<AdminUserActionResponse> => {
        const response = await api.patch(`/admins/users/${id}/reject`);
        return response.data;
    },

    /** İstifadəçini sistemdən silir */
    deleteUser: async (id: string): Promise<AdminUserActionResponse> => {
        const response = await api.delete(`/admins/users/${id}`);
        return response.data;
    }
};

export default userAdminApi;
