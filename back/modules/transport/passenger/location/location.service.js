import locationRepository from './location.repository.js';
import { ApiError } from '../../../../core/api.error.js';
import prisma from '../../../../config/db.js';

class LocationService {
    async search(query) {
        if (!query || query.trim().length === 0) {
            return [];
        }
        const results = await locationRepository.searchLocations(query.trim());
        return results.map(this._mapToFrontend);
    }

    async incrementPopularity(locationId) {
        try {
            await prisma.location.update({
                where: { id: parseInt(locationId) },
                data: { popularity: { increment: 1 } }
            });
            return true;
        } catch (error) {
            console.error("Increment Popularity Error:", error);
            return false;
        }
    }

    async createLocation(data, userId, role) {
        const payload = {
            name: data.name,
            address: data.address,
            lat: data.coordinates.lat,
            lng: data.coordinates.lng,
            type: data.type || 'Custom'
        };

        if (role === 'vendor') {
            payload.vendorId = userId; // Associate with the specific vendor
        }
        const created = await locationRepository.create(payload);
        return this._mapToFrontend(created);
    }

    async getLocations(userId, role, query = {}) {
        // Non-admins only see theirs
        const vendorIdScope = role === 'admin' ? null : userId;
        const locations = await locationRepository.getLocationsByVendor(vendorIdScope, query);
        return locations.map(this._mapToFrontend);
    }

    async updateLocation(id, data, userId, role) {
        const location = await locationRepository.findById(id);
        if (!location) throw ApiError.notFound('Location not found');

        // Check ownership if vendor
        if (role === 'vendor' && location.vendorId !== userId) {
            throw ApiError.forbidden('You do not have permission to update this location');
        }

        const payload = {
            name: data.name,
            address: data.address,
            lat: data.coordinates?.lat,
            lng: data.coordinates?.lng,
            type: data.type
        };

        const updated = await locationRepository.update(id, payload);
        return this._mapToFrontend(updated);
    }

    // Helper mapper
    _mapToFrontend(loc) {
        if (!loc) return loc;
        return {
            id: loc.id.toString(),
            name: loc.name,
            address: loc.address,
            type: loc.type,
            popularity: loc.popularity,
            vendorId: loc.vendorId,
            coordinates: {
                lat: loc.lat,
                lng: loc.lng
            }
        };
    }

    async deleteLocation(id, userId, role) {
        const location = await locationRepository.findById(id);
        if (!location) throw ApiError.notFound('Location not found');

        if (role === 'vendor' && location.vendorId !== userId) {
            throw ApiError.forbidden('You do not have permission to delete this location');
        }

        return await locationRepository.delete(id);
    }
}

export default new LocationService();
