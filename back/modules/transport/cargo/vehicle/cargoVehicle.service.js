import { cargoVehicleRepository } from './cargoVehicle.repository.js';
import { ApiError } from '../../../../core/api.error.js';

class CargoVehicleService {
    async registerVehicle(vendorUserId, data) {
        return cargoVehicleRepository.create({
            ...data,
            vendorId: vendorUserId,
            status: 'Available',
            currentLoadWeight: 0,
            currentLoadVolume: 0
        });
    }

    async getVehicles(filters) {
        return cargoVehicleRepository.findAll(filters);
    }

    async getVehicleById(id) {
        const vehicle = await cargoVehicleRepository.findById(id);
        if (!vehicle) throw ApiError.notFound('Cargo vehicle not found');
        return vehicle;
    }

    async updateVehicle(id, vendorUserId, role, data) {
        const vehicle = await this.getVehicleById(id);

        if (role !== 'admin' && vehicle.vendorId !== vendorUserId) {
            throw ApiError.forbidden('You do not own this cargo vehicle');
        }

        return cargoVehicleRepository.update(id, data);
    }

    async deleteVehicle(id, vendorUserId, role) {
        const vehicle = await this.getVehicleById(id);

        if (role !== 'admin' && vehicle.vendorId !== vendorUserId) {
            throw ApiError.forbidden('You do not own this cargo vehicle');
        }

        if (vehicle.currentLoadWeight > 0) {
            throw ApiError.badRequest('Cannot delete a vehicle currently loaded with cargo');
        }

        return cargoVehicleRepository.delete(id);
    }
}

export const cargoVehicleService = new CargoVehicleService();
