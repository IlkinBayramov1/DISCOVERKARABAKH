import { pricingService } from './pricing.service.js';

export const calculateRidePrice = async (req, res, next) => {
    try {
        const { distanceKm, durationMin, category } = req.body;
        const price = await pricingService.calculatePrice(distanceKm, durationMin, category);
        res.status(200).json({ success: true, data: { price, currency: 'AZN' } });
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
