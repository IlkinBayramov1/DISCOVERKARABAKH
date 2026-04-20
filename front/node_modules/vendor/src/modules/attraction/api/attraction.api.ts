import { httpClient } from '@/shared/api/httpClient';
import type { Attraction, AttractionCategory, AttractionReview } from '../types';

export const vendorAttractionApi = {
    // Get all attractions for this specific vendor, with optional filters
    getAttractions: (params: Record<string, any> = {}) => {
        const query = new URLSearchParams(params).toString();
        const url = query ? `/attractions?${query}` : '/attractions';
        return httpClient<{ success: boolean; data: Attraction[]; totalItems?: number }>(url);
    },

    // Get a specific attraction
    getAttractionById: (id: string) => 
        httpClient<{ success: boolean; data: Attraction }>(`/attractions/${id}`),

    // Get current weather for a city or specific attraction ID
    getWeather: (idOrCity: string) => {
        // If it looks like a city name (non-UUID-ish), use the new weather?city= route
        const isCity = !idOrCity.includes('-') && idOrCity.length < 30; 
        const url = isCity ? `/attractions/weather?city=${idOrCity}` : `/attractions/${idOrCity}/weather`;
        return httpClient<{ success: boolean; data: any }>(url);
    },

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
    },

    // Get deep analytics for a specific attraction
    getAnalytics: (id: string, days: number = 90) =>
        httpClient<{ success: boolean; data: any }>(`/attractions/${id}/analytics?days=${days}`),

    // Report an inappropriate review
    reportReview: (attractionId: string, reviewId: string, data: { reason: string; customNote?: string }) =>
        httpClient<{ success: boolean; message: string }>(`/attractions/${attractionId}/reviews/${reviewId}/report`, {
            method: 'POST',
            body: JSON.stringify(data)
        }),

    // Reply to a review (Vendor action)
    replyToReview: (attractionId: string, reviewId: string, reply: string) =>
        httpClient<{ success: boolean; data: any }>(`/attractions/${attractionId}/reviews/${reviewId}/reply`, {
            method: 'POST',
            body: JSON.stringify({ reply })
        }),
};
