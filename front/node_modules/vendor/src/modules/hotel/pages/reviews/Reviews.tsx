import { useState, useMemo } from 'react';
import { 
    Star, 
    MessageSquare, 
    Reply, 
    Send, 
    Filter, 
    RefreshCw,
    X,
    Search,
    TrendingUp,
    ShieldCheck,
    Calendar,
    Hotel,
    User,
    CheckCircle2,
    AlertCircle,
    Info,
    Smile,
    Meh,
    Frown
} from 'lucide-react';
import { useReviews } from '../../hooks/useReviews';
import './Reviews.css';

export default function Reviews() {
    const { reviews, loading, error, replyToReview } = useReviews(true);
    const [filterRating, setFilterRating] = useState<number | 'all'>('all');
    const [filterStatus, setFilterStatus] = useState<'all' | 'answered' | 'unanswered'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');
    const [submittingReply, setSubmittingReply] = useState(false);

    // ANALYTICS & SENTIMENT ARCHITECTURE
    const stats = useMemo(() => {
        if (!reviews || reviews.length === 0) return null;
        
        const total = reviews.length;
        const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / total;
        const answered = reviews.filter(r => !!r.vendorReply).length;
        
        const distribution = [5, 4, 3, 2, 1].map(star => {
            const count = reviews.filter(r => Math.round(r.rating) === star).length;
            return { star, count, pct: Math.round((count / total) * 100) };
        });

        // Sentiment Classification
        const positive = reviews.filter(r => r.rating >= 4).length;
        const critical = reviews.filter(r => r.rating <= 2.5).length;
        const neutral = total - positive - critical;

        return {
            avg: avg.toFixed(1),
            total,
            responseRate: Math.round((answered / total) * 100),
            distribution,
            sentiment: {
                positivePct: Math.round((positive / total) * 100),
                neutralPct: Math.round((neutral / total) * 100),
                criticalPct: Math.round((critical / total) * 100)
            },
            trustScore: Math.round((avg / 5) * 100)
        };
    }, [reviews]);

    // INTELLIGENCE FILTERING
    const filteredReviews = useMemo(() => {
        return reviews.filter(r => {
            const ratingMatch = filterRating === 'all' || Math.round(r.rating) === filterRating;
            const statusMatch = filterStatus === 'all' || 
                (filterStatus === 'answered' ? !!r.vendorReply : !r.vendorReply);
            
            const guestName = (r.user.firstName || r.user.email).toLowerCase();
            const comment = (r.comment || '').toLowerCase();
            const searchMatch = searchQuery === '' || 
                guestName.includes(searchQuery.toLowerCase()) || 
                comment.includes(searchQuery.toLowerCase());

            return ratingMatch && statusMatch && searchMatch;
        });
    }, [reviews, filterRating, filterStatus, searchQuery]);

    const handleReplySubmit = async (reviewId: string) => {
        if (!replyText.trim()) return;
        setSubmittingReply(true);
        const success = await replyToReview(reviewId, replyText);
        if (success) {
            setReplyingTo(null);
            setReplyText('');
        }
        setSubmittingReply(false);
    };

    if (error) return <div className="alert-box error p-8 rounded-3xl bg-rose-50 text-rose-600 font-black flex items-center gap-4 m-8"><AlertCircle /> {error}</div>;

    return (
        <div className="reviews-container">
            {/* HEADER */}
            <div className="dashboard-header mb-12 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 flex items-center gap-4">
                        <MessageSquare size={32} className="text-blue-600" /> Feedback Center
                    </h1>
                    <p className="text-slate-400 font-bold mt-2">Reputation management and high-fidelity sentiment analytics</p>
                </div>
                <div className="header-meta">
                    <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
                        <ShieldCheck size={20} className="text-emerald-500" />
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Brand Trust Score Index</span>
                        <span className="text-xl font-black text-slate-800">{stats?.trustScore || 0}%</span>
                    </div>
                </div>
            </div>

            {loading && reviews.length === 0 ? (
                <div className="matrix-loader-overlay p-40 text-center">
                    <RefreshCw size={56} className="spin text-blue-500 mx-auto mb-6" />
                    <p className="font-black text-slate-400 text-lg">Synthesizing Guest Insights...</p>
                </div>
            ) : stats && (
                <>
                    {/* SENTIMENT HERO */}
                    <div className="sentiment-hero">
                        <div className="analytics-card-premium">
                            <span className="label-premium">Emotional Index</span>
                            <div className="avg-rating-xl">
                                {stats.avg} <span>/ 5.0</span>
                            </div>
                            <div className="flex gap-1 mt-4">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <Star 
                                        key={i} 
                                        size={20} 
                                        fill={i <= Number(stats.avg) ? "#fbbf24" : "none"} 
                                        color={i <= Number(stats.avg) ? "#fbbf24" : "#e2e8f0"} 
                                    />
                                ))}
                            </div>
                            <div className="mt-8 flex gap-4">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-400 uppercase">Growth</span>
                                    <span className="text-emerald-500 font-black flex items-center gap-1 text-sm"><TrendingUp size={14} /> +2.4%</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-400 uppercase">Sample Size</span>
                                    <span className="text-slate-800 font-black text-sm">{stats.total} Reviews</span>
                                </div>
                            </div>
                        </div>

                        <div className="analytics-card-premium">
                            <span className="label-premium">Sentiment Distribution</span>
                            <div className="distribution-blueprint">
                                <div className="dist-row">
                                    <Smile size={18} className="text-emerald-500" />
                                    <div className="dist-bar-track"><div className="dist-bar-fill !bg-emerald-500" style={{ width: `${stats.sentiment.positivePct}%` }}></div></div>
                                    <span className="w-12 text-right">{stats.sentiment.positivePct}%</span>
                                </div>
                                <div className="dist-row">
                                    <Meh size={18} className="text-amber-500" />
                                    <div className="dist-bar-track"><div className="dist-bar-fill !bg-amber-500" style={{ width: `${stats.sentiment.neutralPct}%` }}></div></div>
                                    <span className="w-12 text-right">{stats.sentiment.neutralPct}%</span>
                                </div>
                                <div className="dist-row">
                                    <Frown size={18} className="text-rose-500" />
                                    <div className="dist-bar-track"><div className="dist-bar-fill !bg-rose-500" style={{ width: `${stats.sentiment.criticalPct}%` }}></div></div>
                                    <span className="w-12 text-right">{stats.sentiment.criticalPct}%</span>
                                </div>
                            </div>
                        </div>

                        <div className="analytics-card-premium highlight">
                            <span className="label-premium">Engagement KPI</span>
                            <div className="avg-rating-xl text-white">
                                {stats.responseRate}% <span>Rep.</span>
                            </div>
                            <p className="mt-6 text-sm font-bold text-white/70 italic">
                                {stats.responseRate >= 80 ? '"Your pro-active engagement strengthens brand loyalty in Shusha."' : '"Consistent responses are the cornerstone of guest trust."'}
                            </p>
                        </div>
                    </div>

                    {/* INTELLIGENCE BAR */}
                    <div className="intelligence-bar">
                        <div className="search-hub">
                            <Search size={18} className="text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Scan guest feedback or identity tags..." 
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                        
                        <div className="filter-pills">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase mr-2">Filter Matrix</span>
                                {['all', 5, 4, 3, 2, 1].map(val => (
                                    <button 
                                        key={val}
                                        className={`filter-pill ${filterRating === val ? 'active' : ''}`}
                                        onClick={() => setFilterRating(val as any)}
                                    >
                                        {val === 'all' ? 'Unified' : <>{val} <Star size={12} fill="currentColor" /></>}
                                    </button>
                                ))}
                            </div>
                            <div className="w-[2px] h-8 bg-slate-100 mx-2" />
                            <select 
                                className="filter-pill !bg-slate-50 border-none appearance-none cursor-pointer"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as any)}
                            >
                                <option value="all">All Channels</option>
                                <option value="answered">Answered Only</option>
                                <option value="unanswered">Critical (Unanswered)</option>
                            </select>
                        </div>
                    </div>

                    {/* REVIEW MATRIX */}
                    <div className="review-matrix">
                        {filteredReviews.length === 0 ? (
                            <div className="analytics-card-premium p-20 text-center items-center">
                                <Filter size={48} className="text-slate-200 mb-4" />
                                <h3 className="text-xl font-black text-slate-800">No matching insights</h3>
                                <p className="text-slate-400 font-bold max-w-sm mt-2">The current intelligence filters returned zero results. Resetting view to All Channels.</p>
                                <button className="mt-8 text-blue-600 font-black text-sm uppercase" onClick={() => {setFilterRating('all'); setFilterStatus('all'); setSearchQuery('');}}>Reset Matrix</button>
                            </div>
                        ) : filteredReviews.map(review => {
                            const sentiment = review.rating >= 4 ? 'positive' : review.rating <= 2.5 ? 'critical' : 'neutral';
                            return (
                                <div key={review.id} className={`review-card-premium sentiment-${sentiment}`}>
                                    <div className="guest-profile-header">
                                        <div className="guest-identity">
                                            <div className="avatar-blueprint">
                                                {(review.user.firstName || review.user.email)[0].toUpperCase()}
                                            </div>
                                            <div className="guest-info">
                                                <h4>
                                                    {review.user.firstName ? `${review.user.firstName} ${review.user.lastName || ''}` : review.user.email.split('@')[0]}
                                                </h4>
                                                <div className="guest-context">
                                                    <Calendar size={14} /> {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    <span className="text-slate-200">/</span>
                                                    <Hotel size={14} /> <span className="property-badge">{review.hotel?.name}</span>
                                                    {review.roomType && (
                                                        <>
                                                            <span className="text-slate-200">/</span>
                                                            <User size={14} /> <span>{review.roomType.name}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rating-display-box">
                                            <div className="score-xl">{review.rating.toFixed(1)}</div>
                                            <div className="flex gap-1 justify-end">
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <Star key={i} size={14} fill={i <= review.rating ? "#fbbf24" : "none"} color={i <= review.rating ? "#fbbf24" : "#e2e8f0"} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="review-content">
                                        {review.comment ? (
                                            <p className="text-lg font-bold text-slate-700 leading-relaxed italic">"{review.comment}"</p>
                                        ) : (
                                            <p className="text-slate-400 font-bold italic border-l-4 border-slate-100 pl-6">The guest opted for a silent numerical rating without commentary.</p>
                                        )}
                                    </div>

                                    <div className="reply-hub-container">
                                        {review.vendorReply ? (
                                            <div className="reply-bubble">
                                                <div className="official-seal">
                                                    <CheckCircle2 size={14} /> Official Response Profile
                                                </div>
                                                <p className="reply-text-premium">{review.vendorReply}</p>
                                            </div>
                                        ) : replyingTo === review.id ? (
                                            <div className="reply-composer animate-in fade-in slide-in-from-top-4 duration-300">
                                                <div className="flex justify-between items-center mb-2">
                                                    <div className="official-seal !text-blue-600"><Reply size={14} /> Strategy Response Hub</div>
                                                    <button className="text-slate-400 hover:text-slate-600" onClick={() => setReplyingTo(null)}><X size={20} /></button>
                                                </div>
                                                <textarea 
                                                    className="reply-textarea-premium"
                                                    placeholder="Construct a professional response to address the guest's feedback..."
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    autoFocus
                                                ></textarea>
                                                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase italic flex items-center gap-2">
                                                        <Info size={14} /> Responses are public and impact your Brand Trust Index.
                                                    </p>
                                                    <button 
                                                        className="btn-send-reply hover:scale-105 transition-transform"
                                                        onClick={() => handleReplySubmit(review.id)}
                                                        disabled={submittingReply || !replyText.trim()}
                                                    >
                                                        {submittingReply ? <RefreshCw size={20} className="spin" /> : <><Send size={20} /> Deploy Response</>}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button 
                                                className="reply-trigger-btn"
                                                onClick={() => {
                                                    setReplyingTo(review.id);
                                                    setReplyText('');
                                                }}
                                            >
                                                <Reply size={18} /> Strategize Response
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
