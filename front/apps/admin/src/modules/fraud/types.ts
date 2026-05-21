export type BlacklistType = 'email' | 'phone' | 'ip';

export interface BlacklistEntry {
    id: string;
    type: BlacklistType;
    value: string;
    reason?: string;
    createdAt: string;
}

export interface FraudRiskLog {
    id: string;
    action: string;
    details: {
        score: number;
        reasons: string[];
        isApproved: boolean;
    };
    context: any;
    createdAt: string;
}

export interface AdminBlacklistResponse {
    success: boolean;
    count: number;
    data: BlacklistEntry[];
}

export interface AdminRiskLogsResponse {
    success: boolean;
    count: number;
    data: FraudRiskLog[];
}

export interface BlacklistCreateInput {
    type: BlacklistType;
    value: string;
    reason: string;
}

export interface AdminFraudActionResponse {
    success: boolean;
    message: string;
    data?: any;
}
