import { useState } from 'react';
import { vendorAttractionApi } from '../api/attraction.api';

export function useAttractionReports() {
    const [reporting, setReporting] = useState<boolean>(false);
    const [reportError, setReportError] = useState<string | null>(null);

    const reportReview = async (attractionId: string, reviewId: string, data: { reason: string; customNote?: string }) => {
        if (!attractionId || !reviewId) return false;

        setReporting(true);
        setReportError(null);
        try {
            await vendorAttractionApi.reportReview(attractionId, reviewId, data);
            return true;
        } catch (err: any) {
            setReportError(err.message || 'Şikayət göndərilərkən xəta baş verdi');
            return false;
        } finally {
            setReporting(false);
        }
    };

    return {
        reportReview,
        reporting,
        reportError
    };
}
