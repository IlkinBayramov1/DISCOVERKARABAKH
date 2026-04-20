import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import './ReportReviewModal.css';

interface ReportReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reason: string, customNote?: string) => Promise<{ success: boolean; error?: string }>;
}

export const ReportReviewModal: React.FC<ReportReviewModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [reason, setReason] = useState('Spam');
    const [customNote, setCustomNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const reasons = ['Spam', 'Insult', 'Irrelevant', 'Fake', 'Other'];

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const result = await onSubmit(reason, customNote);
        if (result.success) {
            onClose();
        } else {
            setError(result.error || 'Failed to submit report');
        }
        setIsSubmitting(false);
    };

    return (
        <div className="modal-overlay">
            <div className="report-modal glass">
                <div className="modal-header">
                    <div className="header-title">
                        <AlertTriangle className="report-icon" size={20} />
                        <h3>Report Review</h3>
                    </div>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <form onSubmit={handleFormSubmit}>
                    <div className="form-group">
                        <label>Reason for reporting</label>
                        <select 
                            value={reason} 
                            onChange={(e) => setReason(e.target.value)}
                            className="glass-input"
                        >
                            {reasons.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Additional Context (Optional)</label>
                        <textarea 
                            value={customNote}
                            onChange={(e) => setCustomNote(e.target.value)}
                            placeholder="Tell us more about why you are reporting this review..."
                            className="glass-input"
                        />
                    </div>

                    {error && <div className="modal-error">{error}</div>}

                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="submit-btn" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Report'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
