import React, { useState, useEffect } from 'react';
import { 
    Star, MessageSquare, Flag, Send, X, 
    Image as ImageIcon, CheckCircle2 
} from 'lucide-react';
import { vendorAttractionApi } from '../../api/attraction.api';
import { useAttractionReviews } from '../../hooks/useAttractionReviews';
import { useAttractionReports } from '../../hooks/useAttractionReports';
import type { AttractionReview, Attraction } from '../../types';
import './AttractionReviews.css';

const REPLY_TEMPLATES = [
    "Ziyarətiniz üçün çox təşəkkür edirik! Sizi yenidən görməyə şad olarıq.",
    "Gözəl rəyiniz üçün minnətdarıq! Məmnun qalmağınız bizi sevindirdi.",
    "Təcrübənizi bizimlə paylaşdığınız üçün təşəkkürlər. Təkliflərinizi nəzərə alacağıq.",
    "Geri bildiriminiz üçün təşəkkürlər. Növbəti ziyarətinizdə daha yaxşı xidmət göstərməyə çalışacağıq."
];

const REPORT_REASONS = [
    "Spam və ya saxta məzmun",
    "Təhqiramiz ifadələr",
    "Mövzuya aid olmayan rəy",
    "Məxfilik qaydalarının pozulması"
];

export const AttractionReviews: React.FC = () => {
    const [selectedAttractionId, setSelectedAttractionId] = useState<string>('all');
    const [attractions, setAttractions] = useState<Attraction[]>([]);
    const [ratingFilter, setRatingFilter] = useState<number | null>(null);
    
    // Hooks
    const { 
        reviews, loading, error, refetch, replyToReview: submitReply 
    } = useAttractionReviews(selectedAttractionId === 'all' ? undefined : selectedAttractionId);
    
    const { reportReview: submitReport } = useAttractionReports();

    // UI States
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');
    const [reportingReview, setReportingReview] = useState<AttractionReview | null>(null);
    const [reportReason, setReportReason] = useState('');

    useEffect(() => {
        const loadAttractions = async () => {
            try {
                const res = await vendorAttractionApi.getAttractions();
                setAttractions(res.data || []);
            } catch (err) {
                console.error('Failed to load attractions', err);
            }
        };
        loadAttractions();
    }, []);

    const handleReply = async (reviewId: string) => {
        if (!replyText.trim()) return;
        const success = await submitReply(reviewId, replyText);
        if (success) {
            setReplyingTo(null);
            setReplyText('');
            refetch();
        }
    };

    const handleReport = async () => {
        if (!reportingReview || !reportReason) return;
        const success = await submitReport(reportingReview.attractionId, reportingReview.id, {
            reason: reportReason
        });
        if (success) {
            setReportingReview(null);
            setReportReason('');
            alert('Şikayət uğurla göndərildi. Moderatorlar tərəfindən araşdırılacaq.');
        }
    };

    const filteredReviews = ratingFilter 
        ? reviews.filter(r => r.rating === ratingFilter)
        : reviews;

    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    const getFullImageUrl = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:4004';
        return `${baseUrl}/${url.startsWith('/') ? url.slice(1) : url}`;
    };

    return (
        <div className="attraction-reviews-page">
            <header className="page-header">
                <div>
                    <h1>Rəylərin İdarəedilməsi</h1>
                    <p>Ziyarətçilərin təcrübələrini oxuyun və onlarla əlaqə saxlayın.</p>
                </div>
                
                <select 
                    className="filter-select"
                    value={selectedAttractionId} 
                    onChange={(e) => setSelectedAttractionId(e.target.value)}
                >
                    <option value="all">Bütün Məkanlar</option>
                    {attractions.map(attr => (
                        <option key={attr.id} value={attr.id}>{attr.name}</option>
                    ))}
                </select>
            </header>

            <div className="reviews-summary-card">
                <div className="summary-stat">
                    <span className="big-number">{averageRating.toFixed(1)}</span>
                    <div className="stars-display">
                        {'★'.repeat(Math.round(averageRating))}
                        {'☆'.repeat(5 - Math.round(averageRating))}
                    </div>
                    <span className="label">Orta Reytinq</span>
                </div>
                <div className="summary-stat">
                    <span className="big-number">{reviews.length}</span>
                    <div className="stars-display"><MessageSquare size={20} /></div>
                    <span className="label">Toplam Rəy</span>
                </div>
            </div>

            <div className="filters-row">
                <div className="rating-filters">
                    <button 
                        className={`rating-btn ${ratingFilter === null ? 'active' : ''}`}
                        onClick={() => setRatingFilter(null)}
                    >
                        Hamısı
                    </button>
                    {[5, 4, 3, 2, 1].map(num => (
                        <button 
                            key={num}
                            className={`rating-btn ${ratingFilter === num ? 'active' : ''}`}
                            onClick={() => setRatingFilter(num)}
                        >
                            {num} <Star size={14} fill={ratingFilter === num ? "white" : "currentColor"} />
                        </button>
                    ))}
                </div>
            </div>

            <div className="reviews-list">
                {loading ? (
                    <div className="loading-state">Rəylər yüklənir...</div>
                ) : error ? (
                    <div className="error-state" style={{ textAlign: 'center', padding: '40px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '24px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                        <Flag size={48} color="#ef4444" style={{ marginBottom: '16px' }} />
                        <h3 style={{ color: '#ef4444', marginBottom: '8px' }}>Rəyləri yükləmək mümkün olmadı</h3>
                        <p style={{ color: '#94a3b8', marginBottom: '20px' }}>{error}</p>
                        <button onClick={() => refetch()} className="btn-action reply active" style={{ backgroundColor: '#3b82f6', color: 'white' }}>Yenidən yoxla</button>
                    </div>
                ) : filteredReviews.length === 0 ? (
                    <div className="empty-state">
                        <ImageIcon size={48} className="empty-icon" />
                        <h3>Hələ ki rəy yoxdur</h3>
                        <p>Seçilmiş kriteriyalara uyğun rəy tapılmadı.</p>
                    </div>
                ) : (
                    filteredReviews.map(review => (
                        <div key={review.id} className="review-card">
                            <div className="review-header">
                                <div className="reviewer-info">
                                    <div className="reviewer-avatar">
                                        {review.user?.firstName?.[0] || 'U'}
                                    </div>
                                    <div className="reviewer-name">
                                        <h4>{review.user?.firstName} {review.user?.lastName}</h4>
                                        <span className="review-date">
                                            {new Date(review.createdAt).toLocaleDateString('az-AZ')}
                                        </span>
                                    </div>
                                </div>
                                <div className="review-meta">
                                    <div className="rating-stars">
                                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                    </div>
                                    <span className="attraction-tag">
                                        {attractions.find(a => a.id === review.attractionId)?.name || 'Məkan'}
                                    </span>
                                </div>
                            </div>

                            <div className="review-body">
                                <p className="review-comment">
                                    {review.comment || <i>Şərh qeyd olunmayıb.</i>}
                                </p>
                                
                                {review.images && review.images.length > 0 && (
                                    <div className="review-photos">
                                        {review.images.map((img, idx) => (
                                            <img 
                                                key={idx} 
                                                src={getFullImageUrl(img)} 
                                                alt="Review" 
                                                className="review-photo"
                                                onClick={() => window.open(getFullImageUrl(img), '_blank')}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="review-actions">
                                <div className="action-btns">
                                    <button 
                                        className="btn-action reply"
                                        onClick={() => setReplyingTo(replyingTo === review.id ? null : review.id)}
                                    >
                                        <MessageSquare size={16} /> Cavabla
                                    </button>
                                    <button 
                                        className="btn-action report"
                                        onClick={() => setReportingReview(review)}
                                    >
                                        <Flag size={16} /> Şikayət et
                                    </button>
                                </div>
                                {review.status === 'approved' && (
                                    <span className="status-badge active"><CheckCircle2 size={12} /> Cavablanıb</span>
                                )}
                            </div>

                            {replyingTo === review.id && (
                                <div className="reply-section">
                                    <div className="templates-row">
                                        <span className="reply-label">Şablonlar:</span>
                                        {REPLY_TEMPLATES.map((tmpl, idx) => (
                                            <button 
                                                key={idx} 
                                                className="template-btn"
                                                onClick={() => setReplyText(tmpl)}
                                            >
                                                {tmpl.slice(0, 20)}...
                                            </button>
                                        ))}
                                    </div>
                                    <textarea 
                                        className="reply-textarea"
                                        placeholder="Cavabınızı bura yazın..."
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                    />
                                    <div className="reply-footer">
                                        <button className="btn-action" onClick={() => setReplyingTo(null)}>Ləğv et</button>
                                        <button 
                                            className="btn-action reply active" 
                                            style={{ backgroundColor: '#3b82f6', color: 'white' }}
                                            onClick={() => handleReply(review.id)}
                                        >
                                            <Send size={16} /> Göndər
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Show existing reply if any logic exists on backend for it */}
                            {/* For now we just show a badge if status is approved */}
                        </div>
                    ))
                )}
            </div>

            {reportingReview && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                            <h2>Rəydən şikayət et</h2>
                            <button onClick={() => setReportingReview(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </header>
                        <p style={{ color: '#94a3b8', marginBottom: 20 }}>Zəhmət olmasa şikayət səbəbini seçin:</p>
                        <div className="report-reasons">
                            {REPORT_REASONS.map(reason => (
                                <div 
                                    key={reason} 
                                    className={`reason-option ${reportReason === reason ? 'active' : ''}`}
                                    onClick={() => setReportReason(reason)}
                                    style={reportReason === reason ? { border: '1px solid #3b82f6', background: 'rgba(59, 130, 246, 0.1)' } : {}}
                                >
                                    {reason}
                                </div>
                            ))}
                        </div>
                        <div className="reply-footer">
                            <button className="btn-action" onClick={() => setReportingReview(null)}>Bağla</button>
                            <button 
                                className="btn-action report active" 
                                style={{ backgroundColor: '#ef4444', color: 'white', border: 'none' }}
                                disabled={!reportReason}
                                onClick={handleReport}
                            >
                                Şikayəti göndər
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttractionReviews;
