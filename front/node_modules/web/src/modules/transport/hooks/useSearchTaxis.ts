import { useMutation } from '@tanstack/react-query';
import { transportApi, type SearchTaxisPayload } from '../api/transport.web.api';

export const useSearchTaxis = () => {
    return useMutation({
        mutationFn: (payload: SearchTaxisPayload) => transportApi.searchTaxis(payload),
    });
};
