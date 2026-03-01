import { attractionWorkingHoursRepository } from './attractionWorkingHours.repository.js';
import { ApiError } from '../../../../core/api.error.js';

class AttractionWorkingHoursService {

    /**
     * @param {string} attractionId 
     * @param {Array} schedule - e.g [{dayOfWeek: 1, openTime: '09:00', closeTime: '18:00', isClosed: false}]
     */
    async setSchedule(attractionId, schedule) {
        if (!Array.isArray(schedule)) {
            throw ApiError.badRequest('Schedule must be an array of daily configurations');
        }

        const promises = schedule.map(dayRule => {
            return attractionWorkingHoursRepository.upsert(
                attractionId,
                dayRule.dayOfWeek,
                {
                    openTime: dayRule.openTime || null,
                    closeTime: dayRule.closeTime || null,
                    isClosed: dayRule.isClosed || false
                }
            );
        });

        await Promise.all(promises);
        return await this.getSchedule(attractionId);
    }

    async getSchedule(attractionId) {
        return await attractionWorkingHoursRepository.findByAttractionId(attractionId);
    }
}

export const attractionWorkingHoursService = new AttractionWorkingHoursService();
