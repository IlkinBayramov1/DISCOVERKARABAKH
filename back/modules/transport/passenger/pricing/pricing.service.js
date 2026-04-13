import { pricingRepository } from './pricing.repository.js';
import { osrmService } from './osrm.service.js';

class PricingService {
    async calculatePrice({ distanceKm, durationMin, vehicleCategory, pickupLocation, dropoffLocation, waypoints = [], pricingType = 'PerKm' }) {
        // 1. Determine Distance & Duration
        let calcDistance = distanceKm || 0;
        let calcDuration = durationMin || 0;

        if (!calcDistance && pickupLocation?.lat && dropoffLocation?.lat) {
            try {
                // Prepare coordinate array for OSRM
                const coords = [
                    { lat: pickupLocation.lat, lng: pickupLocation.lng }
                ];

                if (waypoints && waypoints.length > 0) {
                    waypoints.forEach(wp => {
                        if (wp.lat && wp.lng) coords.push({ lat: wp.lat, lng: wp.lng });
                    });
                }

                coords.push({ lat: dropoffLocation.lat, lng: dropoffLocation.lng });

                // Fetch real routing data
                const routingProps = await osrmService.getDrivingDistanceAndDuration(coords);
                calcDistance = routingProps.distanceKm;
                calcDuration = routingProps.durationMin;
            } catch (err) {
                console.error("Pricing OSRM calc failed, falling back to 0 distance:", err.message);
            }
        }

        // 2. Fetch active pricing rules (mocking simple logic for now)
        let basePrice = 2.0; // Starting fee
        let perKm = 1.0;
        let perMin = 0.2;

        // Adjust rates based on category
        switch (vehicleCategory?.toLowerCase()) {
            case 'business':
                basePrice = 5.0; perKm = 2.0; break;
            case 'premium':
                basePrice = 10.0; perKm = 3.5; break;
            case 'minivan':
                basePrice = 6.0; perKm = 1.8; break;
            case 'bus':
                basePrice = 15.0; perKm = 5.0; break;
            default: // Economy
                basePrice = 2.0; perKm = 1.0;
        }

        let total = basePrice;
        if (pricingType === 'PerKm' && calcDistance) {
            total += calcDistance * perKm;
            if (calcDuration) total += calcDuration * perMin; // Traffic time
        } else if (pricingType === 'Hourly' && calcDuration) {
            total = (calcDuration / 60) * (perKm * 20); // Rough hourly rate
        }

        return {
            price: parseFloat(total.toFixed(2)),
            currency: 'AZN',
            distanceKm: calcDistance,
            durationMin: calcDuration
        };
    }

    // CRUD for admin to set prices
    async createPricingRule(data) {
        return pricingRepository.create(data);
    }

    async getPricingRules() {
        return pricingRepository.findAll();
    }

    async updatePricingRule(id, data) {
        return pricingRepository.update(id, data);
    }

    async deletePricingRule(id) {
        return pricingRepository.delete(id);
    }
}

export const pricingService = new PricingService();
