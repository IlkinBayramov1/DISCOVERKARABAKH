import React, { useState } from 'react';
import {
    Star, ShieldAlert, Search, Check, X, Trash2,
    MessageSquare, RefreshCw
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { 
    useReviews, 
    useReviewActions, 
    useReports, 
    useReportActions 
} from '../hooks/useReviewModeration';
import type { ReviewStatus, AdminReview, AdminReport } from '../types';

const ModerationList: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'reviews' | 'reports'>('reviews');

    // Review Filters
    const [reviewSearch, setReviewSearch] = useState('');
    const [reviewType, setReviewType] = useState<'all' | 'general' | 'room' | 'attraction'>('all');
    const [reviewStatus, setReviewStatus] = useState<'all' | ReviewStatus>('all');
    const [reviewRating, setReviewRating] = useState<'all' | number>('all');

    // Report Filters
    const [reportSearch, setReportSearch] = useState('');
    const [reportStatus, setReportStatus] = useState<'all' | 'pending' | 'resolved' | 'dismissed'>('all');

    // Modal state for reading long text
    const [selectedText, setSelectedText] = useState<{ title: string; body: string } | null>(null);

    // Queries & Mutations
    const reviewParams: any = {};
    if (reviewType !== 'all') reviewParams.type = reviewType;
    if (reviewStatus !== 'all') reviewParams.status = reviewStatus;
    if (reviewRating !== 'all') reviewParams.rating = reviewRating;

    const { data: reviewsRes, isLoading: isReviewsLoading, refetch: refetchReviews } = useReviews(reviewParams);
    const { data: reportsRes, isLoading: isReportsLoading, refetch: refetchReports } = useReports(
        reportStatus !== 'all' ? { status: reportStatus } : {}
    );

    const { updateStatus, deleteReview } = useReviewActions();
    const { updateReportStatus } = useReportActions();

    const reviews = reviewsRes?.data || [];
    const reports = reportsRes?.data || [];

    // Filter local reviews by search query (businessName or userEmail)
    const filteredReviews = reviews.filter(r => {
        const query = reviewSearch.toLowerCase();
        return r.businessName.toLowerCase().includes(query) || r.userEmail.toLowerCase().includes(query);
    });

    // Filter local reports by search query (businessName, author, reporter, reason)
    const filteredReports = reports.filter(rep => {
        const query = reportSearch.toLowerCase();
        const detail = rep.reviewDetail || {};
        return (
            rep.reporterEmail.toLowerCase().includes(query) ||
            rep.reason.toLowerCase().includes(query) ||
            (rep.customNote || '').toLowerCase().includes(query) ||
            (detail.businessName || '').toLowerCase().includes(query) ||
            (detail.userEmail || '').toLowerCase().includes(query)
        );
    });

    // Actions
    const handleApprove = async (id: string, type: string) => {
        try {
            await updateStatus({ id, status: 'approved', type: type as any });
        } catch (error) {
            console.error('Approve failed:', error);
        }
    };

    const handleReject = async (id: string, type: string) => {
        try {
            await updateStatus({ id, status: 'rejected', type: type as any });
        } catch (error) {
            console.error('Reject failed:', error);
        }
    };

    const handleDeleteReview = async (id: string, type: string) => {
        if (window.confirm('Bu rəyi tamamilə silmək istədiyinizdən əminsiniz? Rəyə bağlı olan bütün şikayətlər də silinəcək.')) {
            try {
                await deleteReview({ id, type: type as any });
                refetchReports(); // Refresh reports just in case a report was resolved because of this delete
            } catch (error) {
                console.error('Delete failed:', error);
            }
        }
    };

    const handleDismissReport = async (reportId: string) => {
        try {
            await updateReportStatus({ reportId, status: 'dismissed' });
        } catch (error) {
            console.error('Dismiss report failed:', error);
        }
    };

    const handleDeleteReportedReview = async (reportId: string, reviewId: string, reviewType: string) => {
        if (window.confirm('Şikayət edilən rəyi silmək istədiyinizdən əminsiniz? Bu əməliyyat rəyi siləcək və şikayəti həll edilmiş (resolved) olaraq qeyd edəcək.')) {
            try {
                // First delete the review (which also deletes the report thanks to our transaction)
                await deleteReview({ id: reviewId, type: reviewType as any });
                // Update report status just to be safe (if not already deleted or resolved)
                await updateReportStatus({ reportId, status: 'resolved' });
            } catch (error) {
                console.error('Delete reported review failed:', error);
            }
        }
    };

    // Helper: Star rating render
    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                        key={star} 
                        className={`w-3.5 h-3.5 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} 
                    />
                ))}
            </div>
        );
    };

    // Helper: Business Type Badge style
    const getBusinessTypeBadge = (type: string) => {
        let variant: 'info' | 'success' | 'warning' | 'neutral' | 'error' = 'info';
        switch (type.toLowerCase()) {
            case 'hotel': variant = 'success'; break;
            case 'room': variant = 'warning'; break;
            case 'attraction': variant = 'error'; break;
            case 'restaurant': variant = 'info'; break;
            default: variant = 'neutral';
        }
        return (
            <Badge variant={variant} className="capitalize text-[10px]">
                {type}
            </Badge>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Rəy və Şikayət Moderasiyası</h1>
                    <p className="text-slate-500 font-medium mt-1">İstifadəçi rəyləri, keyfiyyət nəzarəti və şikayətləri buradan idarə edin.</p>
                </div>
                <Button 
                    onClick={() => { activeTab === 'reviews' ? refetchReviews() : refetchReports() }} 
                    variant="outline" 
                    className="p-2.5"
                >
                    <RefreshCw className="w-4 h-4 text-slate-500" />
                </Button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('reviews')}
                    className={`py-3 px-6 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
                        activeTab === 'reviews'
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                >
                    <MessageSquare className="w-4 h-4" />
                    Rəylərin Moderasiyası
                </button>
                <button
                    onClick={() => setActiveTab('reports')}
                    className={`py-3 px-6 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
                        activeTab === 'reports'
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                >
                    <ShieldAlert className="w-4 h-4" />
                    Rəy Şikayətləri
                    {reports.filter((r: any) => r.status === 'pending').length > 0 && (
                        <Badge variant="error" className="ml-1 text-[10px] px-1.5 py-0.5">
                            {reports.filter((r: any) => r.status === 'pending').length} Yeni
                        </Badge>
                    )}
                </button>
            </div>

            {/* Tab contents */}
            {activeTab === 'reviews' ? (
                <div className="space-y-6">
                    {/* Filters Bar */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
                        {/* Search */}
                        <div className="relative">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Məkan və ya email ilə axtar..."
                                value={reviewSearch}
                                onChange={(e) => setReviewSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700 placeholder-slate-400 text-sm"
                            />
                        </div>

                        {/* Review Type */}
                        <div className="relative">
                            <select
                                value={reviewType}
                                onChange={(e) => setReviewType(e.target.value as any)}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-slate-600 text-sm bg-white cursor-pointer"
                            >
                                <option value="all">Rəy Tipi: Hamısı</option>
                                <option value="general">Ümumi Rəylər</option>
                                <option value="room">Otaq Rəyləri</option>
                                <option value="attraction">Attraction Rəyləri</option>
                            </select>
                        </div>

                        {/* Status */}
                        <div className="relative">
                            <select
                                value={reviewStatus}
                                onChange={(e) => setReviewStatus(e.target.value as any)}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-slate-600 text-sm bg-white cursor-pointer"
                            >
                                <option value="all">Status: Hamısı</option>
                                <option value="pending">Gözləyənlər</option>
                                <option value="approved">Təsdiqlənənlər</option>
                                <option value="rejected">Rədd edilənlər</option>
                                <option value="flagged">Bayraqlanmışlar</option>
                            </select>
                        </div>

                        {/* Rating */}
                        <div className="relative">
                            <select
                                value={reviewRating}
                                onChange={(e) => setReviewRating(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-slate-600 text-sm bg-white cursor-pointer"
                            >
                                <option value="all">Reytinq: Hamısı</option>
                                <option value="5">5 Ulduz</option>
                                <option value="4">4 Ulduz</option>
                                <option value="3">3 Ulduz</option>
                                <option value="2">2 Ulduz</option>
                                <option value="1">1 Ulduz</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <Card noPadding>
                        {isReviewsLoading ? (
                            <div className="py-20 flex flex-col items-center justify-center text-slate-400 font-medium gap-3">
                                <RefreshCw className="animate-spin h-5 w-5 text-indigo-500" />
                                Rəylər yüklənir...
                            </div>
                        ) : filteredReviews.length === 0 ? (
                            <div className="py-20 text-center text-slate-400 font-medium">Heç bir rəy tapılmadı.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                            <th className="px-6 py-4">Məkan / Biznes</th>
                                            <th className="px-6 py-4">Müəllif</th>
                                            <th className="px-6 py-4">Reytinq</th>
                                            <th className="px-6 py-4">Şərh</th>
                                            <th className="px-6 py-4">Tarix</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Əməliyyatlar</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-sm">
                                        {filteredReviews.map((r: AdminReview) => {
                                            let statusVariant: 'success' | 'warning' | 'error' | 'neutral' = 'warning';
                                            if (r.status === 'approved') statusVariant = 'success';
                                            else if (r.status === 'rejected') statusVariant = 'error';

                                            const isLongComment = r.comment.length > 60;
                                            const displayComment = isLongComment 
                                                ? `${r.comment.substring(0, 60)}...`
                                                : r.comment;

                                            return (
                                                <tr key={r.id} className="hover:bg-slate-50/30 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="font-bold text-slate-700">{r.businessName}</span>
                                                            <div className="flex">{getBusinessTypeBadge(r.businessType)}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-slate-600">{r.userEmail}</td>
                                                    <td className="px-6 py-4">{renderStars(r.rating)}</td>
                                                    <td className="px-6 py-4 max-w-xs">
                                                        <div className="text-slate-600 font-medium break-words">
                                                            {displayComment}
                                                            {isLongComment && (
                                                                <button 
                                                                    onClick={() => setSelectedText({ title: r.businessName, body: r.comment })}
                                                                    className="text-xs text-indigo-600 hover:underline font-bold ml-1"
                                                                >
                                                                    Daha çox
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-xs font-semibold text-slate-400">
                                                        {new Date(r.createdAt).toLocaleDateString('az-AZ')}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Badge variant={statusVariant} dot>
                                                            {r.status === 'approved' ? 'Təsdiqli' : r.status === 'rejected' ? 'Rədd edilib' : 'Gözləyir'}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            {r.status !== 'approved' && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="text-emerald-600 hover:bg-emerald-50 border-emerald-100"
                                                                    onClick={() => handleApprove(r.id, r.businessType)}
                                                                >
                                                                    <Check className="w-3.5 h-3.5" />
                                                                </Button>
                                                            )}
                                                            {r.status !== 'rejected' && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="text-rose-600 hover:bg-rose-50 border-rose-100"
                                                                    onClick={() => handleReject(r.id, r.businessType)}
                                                                >
                                                                    <X className="w-3.5 h-3.5" />
                                                                </Button>
                                                            )}
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="text-rose-600 hover:bg-rose-50 border-rose-100"
                                                                onClick={() => handleDeleteReview(r.id, r.businessType)}
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Filters Bar */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
                        {/* Search */}
                        <div className="relative">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Şikayətçi, rəy mətni və ya səbəb axtar..."
                                value={reportSearch}
                                onChange={(e) => setReportSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700 placeholder-slate-400 text-sm"
                            />
                        </div>

                        {/* Status */}
                        <div className="relative">
                            <select
                                value={reportStatus}
                                onChange={(e) => setReportStatus(e.target.value as any)}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-slate-600 text-sm bg-white cursor-pointer"
                            >
                                <option value="all">Status: Hamısı</option>
                                <option value="pending">Gözləyənlər</option>
                                <option value="resolved">Həll edilmişlər</option>
                                <option value="dismissed">Rədd edilmiş şikayətlər</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <Card noPadding>
                        {isReportsLoading ? (
                            <div className="py-20 flex flex-col items-center justify-center text-slate-400 font-medium gap-3">
                                <RefreshCw className="animate-spin h-5 w-5 text-indigo-500" />
                                Şikayətlər yüklənir...
                            </div>
                        ) : filteredReports.length === 0 ? (
                            <div className="py-20 text-center text-slate-400 font-medium">Heç bir şikayət tapılmadı.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                            <th className="px-6 py-4">Şikayət Edilən Rəy</th>
                                            <th className="px-6 py-4">Şikayət Səbəbi</th>
                                            <th className="px-6 py-4">Şikayətçi</th>
                                            <th className="px-6 py-4">Tarix</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Əməliyyatlar</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-sm">
                                        {filteredReports.map((rep: AdminReport) => {
                                            const detail = rep.reviewDetail || {};
                                            let statusVariant: 'success' | 'warning' | 'error' | 'neutral' = 'warning';
                                            if (rep.status === 'resolved') statusVariant = 'success';
                                            else if (rep.status === 'dismissed') statusVariant = 'neutral';

                                            const isLongComment = (detail.comment || '').length > 50;
                                            const displayComment = isLongComment 
                                                ? `${detail.comment.substring(0, 50)}...`
                                                : detail.comment || '';

                                            return (
                                                <tr key={rep.id} className="hover:bg-slate-50/30 transition-colors">
                                                    <td className="px-6 py-4 max-w-xs">
                                                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5">
                                                            <div className="flex items-center justify-between gap-2">
                                                                <span className="text-[11px] font-bold text-slate-700 truncate">{detail.businessName || 'Naməlum'}</span>
                                                                {detail.businessType && getBusinessTypeBadge(detail.businessType)}
                                                            </div>
                                                            <div className="text-xs text-slate-600 font-medium italic break-words">
                                                                "{displayComment}"
                                                                {isLongComment && (
                                                                    <button 
                                                                        onClick={() => setSelectedText({ title: detail.businessName || 'Rəy mətni', body: detail.comment })}
                                                                        className="text-[11px] text-indigo-600 hover:underline font-bold ml-1"
                                                                    >
                                                                        Daha çox
                                                                    </button>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold pt-1 border-t border-slate-100/50">
                                                                <span>{detail.userEmail || 'Anonymous'}</span>
                                                                {detail.rating !== undefined && renderStars(detail.rating)}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="font-bold text-slate-700 capitalize">{rep.reason}</span>
                                                            {rep.customNote && (
                                                                <span className="text-xs text-slate-400 font-medium break-words max-w-xs">
                                                                    Qeyd: {rep.customNote}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 font-semibold text-slate-600">{rep.reporterEmail}</td>
                                                    <td className="px-6 py-4 text-xs font-semibold text-slate-400">
                                                        {new Date(rep.createdAt).toLocaleDateString('az-AZ')}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Badge variant={statusVariant} dot>
                                                            {rep.status === 'resolved' ? 'Həll edilib' : rep.status === 'dismissed' ? 'Rədd edilib' : 'Gözləyir'}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            {rep.status === 'pending' && (
                                                                <>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="text-emerald-600 hover:bg-emerald-50 border-emerald-100"
                                                                        onClick={() => handleDismissReport(rep.id)}
                                                                        title="Şikayəti rədd et (Rəyi saxla)"
                                                                    >
                                                                        <Check className="w-3.5 h-3.5" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="text-rose-600 hover:bg-rose-50 border-rose-100"
                                                                        onClick={() => handleDeleteReportedReview(rep.id, rep.reviewId, detail.businessType)}
                                                                        title="Rəyi sil"
                                                                    >
                                                                        <Trash2 className="w-3.5 h-3.5" />
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>
                </div>
            )}

            {/* Read More Modal */}
            {selectedText && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
                        onClick={() => setSelectedText(null)} 
                    />
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 space-y-4 relative z-10 transform animate-in zoom-in duration-200">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-indigo-500" />
                                {selectedText.title}
                            </h3>
                            <button 
                                onClick={() => setSelectedText(null)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="text-slate-600 font-medium text-sm leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto pr-1">
                            {selectedText.body}
                        </div>
                        <div className="pt-2 border-t border-slate-100 flex justify-end">
                            <Button onClick={() => setSelectedText(null)} className="px-4 py-2 text-xs">
                                Bağla
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModerationList;
