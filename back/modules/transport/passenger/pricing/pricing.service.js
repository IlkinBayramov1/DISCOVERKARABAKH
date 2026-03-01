import { pricingRepository } from './pricing.repository.js';

class PricingService {
    async calculatePrice(distanceKm, durationMin, vehicleCategory, pricingType = 'PerKm') {
        // Fetch active pricing rules (mocking simple logic for now)
        // In real app, might query DB for Rate per Km for specific category.

        let basePrice = 2.0; // Starting fee
        let perKm = 1.0;
        let perMin = 0.2;

        // Adjust rates based on category
        switch (vehicleCategory) {
            case 'Business':
                basePrice = 5.0;
                perKm = 2.0;
                break;
            case 'Premium':
                basePrice = 10.0;
                perKm = 3.5;
                break;
            case 'Minivan':
                basePrice = 6.0;
                perKm = 1.8;
                break;
            case 'Bus':
                basePrice = 15.0;
                perKm = 5.0;
                break;
            default: // Economy
                basePrice = 2.0;
                perKm = 1.0;
        }

        let total = basePrice;
        if (pricingType === 'PerKm' && distanceKm) {
            total += distanceKm * perKm;
            if (durationMin) total += durationMin * perMin; // Traffic time
        } else if (pricingType === 'Hourly' && durationMin) {
            total = (durationMin / 60) * (perKm * 20); // Rough hourly rate
        } else if (pricingType === 'Fixed') {
            // Fixed pricing would come from predefined routes usually
        }

        return parseFloat(total.toFixed(2));
    }

    // CRUD for admin to set prices
    async createPricingRule(data) {
        return pricingRepository.create(data);
    }

    async getPricingRules() {
        return pricingRepository.findAll();
    }
}

export const pricingService = new PricingService();
