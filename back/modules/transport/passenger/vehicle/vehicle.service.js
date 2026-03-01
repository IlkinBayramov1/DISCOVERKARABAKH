import { vehicleRepository } from './vehicle.repository.js';
import { ApiError } from '../../../../core/api.error.js';

class VehicleService {
    async createVehicle(userId, data) {
        // Vendor creates vehicle, so vendorId = userId
        // Admin might create for specific vendor? For now assume logged in user is vendor/owner.
        // If admin, maybe allow passing vendorId.

        const vehicleData = {
            ...data,
            vendorId: userId // The creator is the owner (Vendor)
        };

        return vehicleRepository.create(vehicleData);
    }

    async getVehicleById(id) {
        const vehicle = await vehicleRepository.findById(id);
        if (!vehicle) throw ApiError.notFound('Vehicle not found');
        return vehicle;
    }

    async getVehicles(userId, query, role) {
        // If Admin, can see all? Or filter by vendorId param.
        // If Vendor, only see own.

        let filter = { ...query };
        if (role !== 'admin') {
            filter.vendorId = userId;
        } else if (query.vendorId) {
            filter.vendorId = query.vendorId; // Admin filtering by specific vendor
        }

        // Pagination
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const skip = (page - 1) * limit;

        return vehicleRepository.findAll(filter, skip, limit);
    }

    async updateVehicle(id, userId, data, role) {
        const vehicle = await this.getVehicleById(id);

        // Ownership check
        if (role !== 'admin' && vehicle.vendorId !== userId) {
            throw ApiError.forbidden('You do not own this vehicle');
        }

        return vehicleRepository.update(id, data);
    }

    async deleteVehicle(id, userId, role) {
        const vehicle = await this.getVehicleById(id);

        // Ownership check
        if (role !== 'admin' && vehicle.vendorId !== userId) {
            throw ApiError.forbidden('You do not own this vehicle');
        }

        return vehicleRepository.delete(id);
    }
}

export const vehicleService = new VehicleService();
