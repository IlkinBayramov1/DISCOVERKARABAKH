import { pricingService } from './pricing.service.js';

export const calculateRidePrice = async (req, res, next) => {
    try {
        const { distanceKm, durationMin, category, pickupLocation, dropoffLocation, waypoints } = req.body;
        const priceDetails = await pricingService.calculatePrice({
            distanceKm,
            durationMin,
            vehicleCategory: category,
            pickupLocation,
            dropoffLocation,
            waypoints
        });
        res.status(200).json({ success: true, data: priceDetails });
    } catch (error) {
        next(error);
    }
};

export const getPricingRules = async (req, res, next) => {
    try {
        const rules = await pricingService.getPricingRules();
        res.status(200).json({ success: true, data: rules });
    } catch (error) {
        next(error);
    }
};

export const createPricingRule = async (req, res, next) => {
    try {
        const rule = await pricingService.createPricingRule(req.body);
        res.status(201).json({ success: true, data: rule });
    } catch (error) {
        next(error);
    }
};

export const updatePricingRule = async (req, res, next) => {
    try {
        const rule = await pricingService.updatePricingRule(req.params.id, req.body);
        res.status(200).json({ success: true, data: rule });
    } catch (error) {
        next(error);
    }
};

export const deletePricingRule = async (req, res, next) => {
    try {
        await pricingService.deletePricingRule(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};
