import { httpClient } from '@/shared/api/httpClient';
import type { IAnalyticsResponse } from '../types';

export const analyticsApi = {
    /**
     * Get aggregated analytics for properties.
     * Matches analytics.yaml specification.
     */
    getHotelAnalytics: (options: { startDate?: string; endDate?: string; hotelId?: string }) => {
        const query = new URLSearchParams(options as Record<string, string>).toString();
        return httpClient<IAnalyticsResponse>(`/hotels/analytics${query ? `?${query}` : ''}`);
    }
};
