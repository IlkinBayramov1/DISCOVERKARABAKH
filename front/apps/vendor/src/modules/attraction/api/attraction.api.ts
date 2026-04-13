import { httpClient } from '@/shared/api/httpClient';
import type { Attraction, AttractionCategory, AttractionReview } from '../types';

export const vendorAttractionApi = {
    // Get all attractions for this specific vendor
    getAttractions: () => 
        httpClient<{ success: boolean; data: Attraction[] }>('/attractions'),

    // Get a specific attraction
    getAttractionById: (id: string) => 
        httpClient<{ success: boolean; data: Attraction }>(`/attractions/${id}`),

    // Create a new attraction
    createAttraction: (data: Partial<Attraction>) => 
        httpClient<{ success: boolean; data: Attraction }>('/attractions', {
            method: 'POST',
            body: JSON.stringify(data)
        }),

    // Update an existing attraction
    updateAttraction: (id: string, data: Partial<Attraction>) => 
        httpClient<{ success: boolean; data: Attraction }>(`/attractions/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),

    // Delete an attraction
    deleteAttraction: (id: string) => 
        httpClient<{ success: boolean; message: string }>(`/attractions/${id}`, {
            method: 'DELETE'
        }),

    // Get categories to populate the dropdown
    getCategories: () => 
        httpClient<{ success: boolean; data: AttractionCategory[] }>('/attractions/categories'),

    // Get reviews for a specific attraction or all vendor attractions
    getReviews: (attractionId?: string) => {
        const url = attractionId 
            ? `/attractions/${attractionId}/reviews` 
            : '/attractions/reviews';
        return httpClient<{ success: boolean; data: AttractionReview[] }>(url);
    }
};
