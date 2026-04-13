import { httpClient } from '@/shared/api/httpClient';
import type { IBlacklist, IBlacklistPayload, IFraudRiskLog } from '../types';

export const fraudApi = {
    // BLACKLIST: Get all blacklisted entries
    getBlacklist: () =>
        httpClient<IBlacklist[]>('/hotels/fraud/blacklist'),

    // BLACKLIST: Add an entry
    addToBlacklist: (data: IBlacklistPayload) =>
        httpClient<{ message: string }>('/hotels/fraud/blacklist', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    // BLACKLIST: Remove an entry
    removeFromBlacklist: (id: string) =>
        httpClient<{ message: string }>(`/hotels/fraud/blacklist/${id}`, {
            method: 'DELETE'
        }),

    // RISK LOGS: Get fraud evaluation history
    getRiskLogs: () =>
        httpClient<IFraudRiskLog[]>('/hotels/fraud/blacklist/risk-logs'),
};
