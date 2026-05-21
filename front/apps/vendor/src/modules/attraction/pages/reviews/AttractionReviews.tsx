import { useState, useEffect } from 'react';
import { 
    Star, MessageSquare, Flag, Send, X, 
    Image as ImageIcon, CheckCircle2, AlertCircle, RefreshCw
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

export default function AttractionReviews() {
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

    const handleReply = async (review: AttractionReview) => {
        if (!replyText.trim()) return;
        const success = await submitReply(review.id, replyText, review.attractionId);
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
        const baseUrl = import.meta.env.VITE_API_URL ? new URL(import.meta.env.VITE_API_URL).origin : '';
        return `${baseUrl}/${url.startsWith('/') ? url.slice(1) : url}`;
    };

    return (
        <div className="dk-rev-layout">
            <div className="dk-rev-container">
                
                {/* HEADER */}
                <header className="dk-rev-header">
                    <div className="header-text">
                        <h1 className="dk-title">Rəylərin İdarəedilməsi</h1>
                        <p className="dk-subtitle">Ziyarətçilərin təcrübələrini oxuyun və onlarla əlaqə saxlayın.</p>
                    </div>
                    
                    <div className="dk-select-wrap">
                        <select 
                            className="dk-select-filter"
                            value={selectedAttractionId} 
                            onChange={(e) => setSelectedAttractionId(e.target.value)}
                        >
                            <option value="all">Bütün Məkanlar</option>
                            {attractions.map(attr => (
                                <option key={attr.id} value={attr.id}>{attr.name}</option>
                            ))}
                        </select>
                    </div>
                </header>

                {/* SUMMARY CARDS */}
                <div className="dk-rev-summary-row">
                    <div className="dk-summary-card">
                        <div className="stat-content">
                            <span className="big-number text-amber-500">{averageRating.toFixed(1)}</span>
                            <div className="stars-display">
                                {'★'.repeat(Math.round(averageRating))}
                                <span className="empty-stars">{'★'.repeat(5 - Math.round(averageRating))}</span>
                            </div>
                            <span className="label">Orta Reytinq</span>
                        </div>
                    </div>
                    <div className="dk-summary-card">
                        <div className="stat-content">
                            <span className="big-number text-blue-600">{reviews.length}</span>
                            <div className="stars-display text-blue-500"><MessageSquare size={24} /></div>
                            <span className="label">Toplam Rəy</span>
                        </div>
                    </div>
                </div>

                {/* FILTERS */}
                <div className="dk-rev-filters">
                    <button 
                        className={`dk-rating-btn ${ratingFilter === null ? 'active' : ''}`}
                        onClick={() => setRatingFilter(null)}
                    >
                        Hamısı
                    </button>
                    {[5, 4, 3, 2, 1].map(num => (
                        <button 
                            key={num}
                            className={`dk-rating-btn ${ratingFilter === num ? 'active' : ''}`}
                            onClick={() => setRatingFilter(num)}
                        >
                            {num} <Star size={14} fill={ratingFilter === num ? "currentColor" : "none"} />
                        </button>
                    ))}
                </div>

                {/* REVIEWS LIST */}
                <div className="dk-rev-list">
                    {loading ? (
                        <div className="dk-rev-loading">
                            <RefreshCw size={40} className="spin-icon" />
                            <p>Rəylər sinxronizasiya olunur...</p>
                        </div>
                    ) : error ? (
                        <div className="dk-alert-error">
                            <AlertCircle size={40} className="error-icon" />
                            <h3>Rəyləri yükləmək mümkün olmadı</h3>
                            <p>{error}</p>
                            <button onClick={() => refetch()} className="dk-btn-primary mt-4">Yenidən yoxla</button>
                        </div>
                    ) : filteredReviews.length === 0 ? (
                        <div className="dk-rev-empty">
                            <div className="empty-icon-circle"><ImageIcon size={40} /></div>
                            <h3>Hələ ki rəy yoxdur</h3>
                            <p>Seçilmiş kriteriyalara uyğun rəy tapılmadı.</p>
                            {ratingFilter !== null && (
                                <button className="dk-btn-ghost mt-4" onClick={() => setRatingFilter(null)}>Filtrləri Sıfırla</button>
                            )}
                        </div>
                    ) : (
                        filteredReviews.map(review => (
                            <div key={review.id} className="dk-review-card">
                                
                                <div className="dk-review-header">
                                    <div className="reviewer-info">
                                        <div className="reviewer-avatar">
                                            {review.user?.firstName?.[0] || 'Q'}
                                        </div>
                                        <div className="reviewer-name-box">
                                            <h4>{review.user?.firstName} {review.user?.lastName}</h4>
                                            <span className="review-date">
                                                {new Date(review.createdAt).toLocaleDateString('az-AZ')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="review-meta">
                                        <div className="dk-rating-stars">
                                            {'★'.repeat(review.rating)}
                                            <span className="empty-stars">{'★'.repeat(5 - review.rating)}</span>
                                        </div>
                                        <span className="dk-attraction-tag">
                                            {attractions.find(a => a.id === review.attractionId)?.name || 'Məkan'}
                                        </span>
                                    </div>
                                </div>

                                <div className="dk-review-body">
                                    <p className="review-comment">
                                        {review.comment || <i className="text-slate-400">Şərh qeyd olunmayıb.</i>}
                                    </p>
                                    
                                    {review.images && review.images.length > 0 && (
                                        <div className="review-photos-grid">
                                            {review.images.map((img, idx) => (
                                                <img 
                                                    key={idx} 
                                                    src={getFullImageUrl(img)} 
                                                    alt="Review attachment" 
                                                    className="review-photo"
                                                    onClick={() => window.open(getFullImageUrl(img), '_blank')}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="dk-review-footer">
                                    <div className="dk-action-btns">
                                        <button 
                                            className="dk-btn-inline reply"
                                            onClick={() => setReplyingTo(replyingTo === review.id ? null : review.id)}
                                        >
                                            <MessageSquare size={16} /> Cavabla
                                        </button>
                                        <button 
                                            className="dk-btn-inline report"
                                            onClick={() => setReportingReview(review)}
                                        >
                                            <Flag size={16} /> Şikayət et
                                        </button>
                                    </div>
                                    {review.status === 'approved' && (
                                        <span className="dk-status-pill approved"><CheckCircle2 size={14} /> Təsdiqlənib</span>
                                    )}
                                </div>

                                {/* VENDOR REPLY DISPLAY */}
                                {review.vendorReply && (
                                    <div className="dk-vendor-reply-display">
                                        <div className="reply-header">
                                            <MessageSquare size={14} />
                                            <span>Sizin Cavabınız:</span>
                                        </div>
                                        <p>{review.vendorReply}</p>
                                    </div>
                                )}

                                {/* REPLY BOX */}
                                {replyingTo === review.id && (
                                    <div className="dk-reply-box animate-slide-down">
                                        <div className="templates-wrap">
                                            <span className="template-label">Sürətli Cavablar:</span>
                                            {REPLY_TEMPLATES.map((tmpl, idx) => (
                                                <button 
                                                    key={idx} className="dk-template-btn"
                                                    onClick={() => setReplyText(tmpl)}
                                                >
                                                    {tmpl.slice(0, 24)}...
                                                </button>
                                            ))}
                                        </div>
                                        <textarea 
                                            className="dk-reply-textarea"
                                            placeholder="Ziyarətçiyə peşəkar cavabınızı bura yazın..."
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                        />
                                        <div className="reply-actions">
                                            <button className="dk-btn-ghost small" onClick={() => setReplyingTo(null)}>Ləğv et</button>
                                            <button 
                                                className="dk-btn-primary small" 
                                                onClick={() => handleReply(review)}
                                            >
                                                <Send size={14} /> Cavabı Göndər
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* REPORT MODAL */}
                {reportingReview && (
                    <div className="dk-modal-overlay">
                        <div className="dk-modal-card animate-pop-up">
                            <header className="modal-header">
                                <h2>Rəydən şikayət et</h2>
                                <button className="btn-close-modal" onClick={() => setReportingReview(null)}>
                                    <X size={20} />
                                </button>
                            </header>
                            <div className="modal-body">
                                <p className="modal-hint">Zəhmət olmasa şikayətinizin əsas səbəbini seçin:</p>
                                <div className="dk-report-reasons">
                                    {REPORT_REASONS.map(reason => (
                                        <div 
                                            key={reason} 
                                            className={`dk-reason-pill ${reportReason === reason ? 'active' : ''}`}
                                            onClick={() => setReportReason(reason)}
                                        >
                                            {reason}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="dk-btn-ghost" onClick={() => setReportingReview(null)}>Bağla</button>
                                <button 
                                    className="dk-btn-danger" 
                                    disabled={!reportReason}
                                    onClick={handleReport}
                                >
                                    <Flag size={16} /> Şikayəti Göndər
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}