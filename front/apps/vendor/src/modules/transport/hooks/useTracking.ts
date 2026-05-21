import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { io, Socket } from 'socket.io-client';
import { transportVendorApi } from '../api/transport.api';
import { getToken } from '../../../shared/utils/token';

export interface DriverLocationMarker {
    driverId: string;
    firstName: string;
    lastName: string;
    status: string;
    location: {
        lat: number;
        lng: number;
    } | null;
}

/**
 * Hook to immediately fetch known map layout from REST API
 */
export const useFleetInitialMap = () => {
    return useQuery({
        queryKey: ['transport-fleet-map'],
        queryFn: () => transportVendorApi.getFleetLocations().then(res => res.data),
        refetchInterval: false,
        refetchOnWindowFocus: false // rely on websocket for updates after first load
    });
};

/**
 * Hook to manage Socket.IO tracking connection.
 * It takes the initial map data and updates it on the fly when drivers move.
 */
export const useFleetLiveTracker = (vendorId: string, initialMapData?: DriverLocationMarker[]) => {
    const [markers, setMarkers] = useState<Record<string, DriverLocationMarker>>({});
    const [stats, setStats] = useState({ online: 0, busy: 0, offline: 0 });

    // Seed state with REST data
    useEffect(() => {
        if (initialMapData) {
            const mapObj: Record<string, DriverLocationMarker> = {};
            let on = 0; let b = 0; let off = 0;
            
            initialMapData.forEach(d => {
                mapObj[d.driverId] = d;
                if (d.status === 'Online') on++;
                else if (d.status === 'Busy' || d.status === 'OnTrip') b++;
                else off++;
            });
            setMarkers(mapObj);
            setStats({ online: on, busy: b, offline: off });
        }
    }, [initialMapData]);

    useEffect(() => {
        if (!vendorId) return;

        const token = getToken();
        if (!token) return;

        const SOCKET_URL = import.meta.env.VITE_API_URL ? new URL(import.meta.env.VITE_API_URL).origin : '';

        const socket: Socket = io(SOCKET_URL, {
            auth: { token }
        });

        socket.on('connect', () => {
            console.log('🔗 WebSocket Tracker Connected');
            // Join Vendor Channel
            socket.emit('joinRoom', `vendor_${vendorId}`);
        });

        // Listen for tracking updates from moving drivers
        socket.on('fleet_driver_location', (data: any) => {
            setMarkers(prev => {
                const newState = { ...prev };
                newState[data.driverId] = {
                    ...newState[data.driverId], // preserve names if exist
                    driverId: data.driverId,
                    firstName: data.firstName || 'Driver',
                    lastName: data.lastName || '',
                    location: data.location,
                    status: data.status
                };
                return newState;
            });
        });

        return () => {
            socket.disconnect();
            console.log('🛑 WebSocket Tracker Disconnected');
        };
    }, [vendorId]);

    // Convert object to easy iterable array for map plotting
    const activeMarkers = Object.values(markers).filter(m => m.location);

    return {
        markers: Object.values(markers),
        activeMarkers, // Only markers with valid GPS coordinates
        stats
    };
};
