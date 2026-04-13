import { pricingService } from './modules/transport/passenger/pricing/pricing.service.js';

async function test() {
    console.log("Testing calculatePrice with Fuzuli Airport to Shusha Hotel coordinates...");

    // Coordinates approximate
    const fuzuliAirport = { lat: 39.5936, lng: 47.1994 };
    const shushaHotel = { lat: 39.7537, lng: 46.7465 };

    const payload = {
        pickupLocation: fuzuliAirport,
        dropoffLocation: shushaHotel,
        vehicleCategory: 'Economy' // Expected rates: base 2.0, 1.0 per km, 0.2 per min
    };

    try {
        const result = await pricingService.calculatePrice(payload);
        console.log("Price Calculation Result:");
        console.log(result);
    } catch (e) {
        console.error("Test failed:", e.message);
    }
}

test();
