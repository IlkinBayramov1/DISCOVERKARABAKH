import { useState } from 'react';
import { httpClient } from '../../../shared/api/httpClient';

export function useUpload() {
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    /**
     * Uploads an array of File objects to the backend and returns their generated static URLs.
     */
    const uploadImages = async (files: File[]): Promise<string[]> => {
        if (!files || files.length === 0) return [];

        setUploading(true);
        setUploadError(null);

        const formData = new FormData();
        files.forEach(file => {
            formData.append('images', file);
        });

        try {
            // httpClient automatically adds the JWT token
            const response = await httpClient<{ success: boolean; urls: string[] }>('/upload', {
                method: 'POST',
                body: formData
            });

            if (response && response.urls) {
                return response.urls;
            }
            return [];
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Failed to upload images';
            setUploadError(msg);
            throw new Error(msg);
        } finally {
            setUploading(false);
        }
    };

    return {
        uploadImages,
        uploading,
        uploadError
    };
}
