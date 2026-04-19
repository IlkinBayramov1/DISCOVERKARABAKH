import { httpClient } from '../../../shared/api/httpClient';
import type { IProfileResponse, IUserProfile } from '../types/profile.types';

export const profileApi = {
    getProfile: async (): Promise<IProfileResponse> => {
        const response = await httpClient.get<IProfileResponse>('/users/profile');
        return response.data;
    },

    updateProfile: async (data: Partial<IUserProfile & any>): Promise<IProfileResponse> => {
        const response = await httpClient.put<IProfileResponse>('/users/profile', data);
        return response.data;
    },

    uploadAvatar: async (file: File): Promise<{ success: boolean; url: string }> => {
        const formData = new FormData();
        formData.append('image', file);
        const response = await httpClient.post<{ success: boolean; url: string }>('/upload/single', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
};
