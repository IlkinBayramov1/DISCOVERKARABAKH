import { useQuery } from '@tanstack/react-query';
import { transportApi } from '../api/transport.web.api';

export const useVehicle = (id: string | undefined) => {
    return useQuery({
        queryKey: ['vehicle', id],
        queryFn: () => (id ? transportApi.getVehicleById(id) : null),
        enabled: !!id,
    });
};
