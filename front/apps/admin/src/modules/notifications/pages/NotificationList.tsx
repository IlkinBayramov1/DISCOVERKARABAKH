import React, { useState } from 'react';
import { 
    Send, BellOff, Trash2, Search, Bell, Info, 
    Calendar, User, X, Filter, RefreshCw, Mail 
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { useNotifications, useNotificationActions } from '../hooks/useNotificationAdmin';

const NotificationList: React.FC = () => {
    // States
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState<'all' | 'announcement' | 'booking_alert' | 'system'>('all');
    const [targetFilter, setTargetFilter] = useState<'all' | 'all_target' | 'guest' | 'vendor' | 'private'>('all');
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Form States
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [target, setTarget] = useState<'all' | 'guest' | 'vendor'>('all');
    const [errorMsg, setErrorMsg] = useState('');

    // React Query Hooks
    const { data: notificationsRes, isLoading, isRefetching, refetch } = useNotifications();
    const { sendAnnouncement, isSending, deleteNotification } = useNotificationActions();

    const notifications = notificationsRes?.data || [];

    // Filter Notifications
    const filteredNotifications = notifications.filter(n => {
        // Search filter
        const matchesSearch = 
            n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            n.message.toLowerCase().includes(searchQuery.toLowerCase());

        // Type filter
        const matchesType = typeFilter === 'all' || n.type === typeFilter;

        // Target filter
        let matchesTarget = true;
        if (targetFilter === 'all_target') {
            matchesTarget = n.target === 'all';
        } else if (targetFilter === 'guest') {
            matchesTarget = n.target === 'guest';
        } else if (targetFilter === 'vendor') {
            matchesTarget = n.target === 'vendor';
        } else if (targetFilter === 'private') {
            matchesTarget = n.target !== 'all' && n.target !== 'guest' && n.target !== 'vendor';
        }

        return matchesSearch && matchesType && matchesTarget;
    });

    // Form Submit Handler
    const handleSendAnnouncement = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        if (!title.trim() || !message.trim()) {
            setErrorMsg('Başlıq və mətn sahələri doldurulmalıdır.');
            return;
        }

        try {
            await sendAnnouncement({ title, message, target });
            // Reset Form and close modal
            setTitle('');
            setMessage('');
            setTarget('all');
            setIsCreateOpen(false);
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || 'Elan göndərilərkən xəta baş verdi.');
        }
    };

    // Delete Notification Handler
    const handleDelete = async (id: string) => {
        if (window.confirm('Bu bildirişi/elanı silmək istədiyinizdən əminsiniz? Bu əməliyyat geri qaytarıla bilməz.')) {
            try {
                await deleteNotification(id);
            } catch (err) {
                console.error('Delete notification failed:', err);
            }
        }
    };

    // Date formatter helper
    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleString('az-AZ', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateStr;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Bildirişlər və Elanlar</h1>
                    <p className="text-slate-500 font-medium mt-1">Sistem tərəfindən göndərilən bildirişləri izləyin və istifadəçilərə kütləvi elanlar göndərin.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => refetch()} 
                        disabled={isLoading || isRefetching}
                        className="gap-2 shrink-0 border border-slate-200"
                    >
                        <RefreshCw className={`w-4 h-4 ${(isLoading || isRefetching) ? 'animate-spin' : ''}`} />
                        Yenilə
                    </Button>
                    <Button 
                        size="sm"
                        onClick={() => setIsCreateOpen(true)}
                        className="gap-2 shadow-sm shrink-0"
                    >
                        <Send className="w-4 h-4" />
                        Yeni Elan Göndər
                    </Button>
                </div>
            </div>

            {/* Filter Section */}
            <Card className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Başlıq və ya mətnə görə axtar..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-500 font-medium transition-colors"
                        />
                    </div>

                    {/* Type Filter */}
                    <div className="flex items-center gap-2">
                        <Filter className="text-slate-400 w-4 h-4 shrink-0" />
                        <select
                            value={typeFilter}
                            onChange={(e: any) => setTypeFilter(e.target.value)}
                            className="w-full py-2 px-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-500 font-medium transition-colors bg-white"
                        >
                            <option value="all">Bütün Tiplər</option>
                            <option value="announcement">Elan (Announcement)</option>
                            <option value="booking_alert">Rezervasiya (Booking)</option>
                            <option value="system">Sistem (System)</option>
                        </select>
                    </div>

                    {/* Target Filter */}
                    <div className="flex items-center gap-2">
                        <User className="text-slate-400 w-4 h-4 shrink-0" />
                        <select
                            value={targetFilter}
                            onChange={(e: any) => setTargetFilter(e.target.value)}
                            className="w-full py-2 px-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-500 font-medium transition-colors bg-white"
                        >
                            <option value="all">Bütün Hədəflər</option>
                            <option value="all_target">Bütün İstifadəçilər (all)</option>
                            <option value="guest">Yalnız Qonaqlar (guest)</option>
                            <option value="vendor">Yalnız Sahibkarlar (vendor)</option>
                            <option value="private">Fərdi (Özəl)</option>
                        </select>
                    </div>
                </div>
            </Card>

            {/* Notifications List */}
            {isLoading ? (
                /* Skeleton Loading State */
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="p-5 animate-pulse">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-xl shrink-0"></div>
                                <div className="space-y-3 w-full">
                                    <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                                    <div className="h-3 bg-slate-100 rounded w-3/4"></div>
                                    <div className="flex gap-2">
                                        <div className="h-5 bg-slate-100 rounded-lg w-16"></div>
                                        <div className="h-5 bg-slate-100 rounded-lg w-16"></div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : filteredNotifications.length === 0 ? (
                /* Empty State */
                <Card className="min-h-[400px] flex flex-col items-center justify-center text-center p-8">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                        <BellOff className="text-slate-300 w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Uğun Gələn Bildiriş Tapılmadı</h3>
                    <p className="text-slate-400 font-medium max-w-xs mt-1">
                        {notifications.length === 0 
                            ? "Sistemdə hələlik hər hansı bir bildiriş və ya elan mövcud deyil." 
                            : "Seçilmiş filtr parametrlərinə uyğun gələn bildiriş yoxdur."}
                    </p>
                </Card>
            ) : (
                /* Notifications Cards */
                <div className="space-y-4">
                    {filteredNotifications.map((n) => {
                        // Icon selection based on notification type
                        let icon = <Bell className="text-indigo-600 w-5 h-5" />;
                        let bgClass = 'bg-indigo-50';
                        let typeText = 'Elan';
                        let typeVariant: 'success' | 'warning' | 'error' | 'info' | 'neutral' = 'info';

                        if (n.type === 'booking_alert') {
                            icon = <Mail className="text-emerald-600 w-5 h-5" />;
                            bgClass = 'bg-emerald-50';
                            typeText = 'Rezervasiya';
                            typeVariant = 'success';
                        } else if (n.type === 'system') {
                            icon = <Info className="text-amber-600 w-5 h-5" />;
                            bgClass = 'bg-amber-50';
                            typeText = 'Sistem';
                            typeVariant = 'warning';
                        }

                        // Target audience formatting
                        let targetText = 'Hamı';
                        let targetVariant: 'success' | 'warning' | 'error' | 'info' | 'neutral' = 'neutral';
                        
                        if (n.target === 'guest') {
                            targetText = 'Qonaqlar';
                            targetVariant = 'info';
                        } else if (n.target === 'vendor') {
                            targetText = 'Sahibkarlar';
                            targetVariant = 'warning';
                        } else if (n.target !== 'all') {
                            targetText = `Fərdi (ID: ${n.target.substring(0, 8)}...)`;
                            targetVariant = 'success';
                        }

                        return (
                            <Card key={n.id} className="p-5 hover:shadow-md transition-shadow group relative overflow-hidden">
                                <div className="flex items-start gap-4">
                                    {/* Icon circle */}
                                    <div className={`w-12 h-12 ${bgClass} rounded-2xl flex items-center justify-center shrink-0`}>
                                        {icon}
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-2 flex-grow pr-8">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h4 className="font-extrabold text-slate-800 tracking-tight text-[15px]">
                                                {n.title}
                                            </h4>
                                            <Badge variant={typeVariant}>{typeText}</Badge>
                                            <Badge variant={targetVariant}>{targetText}</Badge>
                                        </div>

                                        <p className="text-slate-600 text-[13.5px] font-medium leading-relaxed max-w-3xl whitespace-pre-line">
                                            {n.message}
                                        </p>

                                        <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-400">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span>{formatDate(n.createdAt)}</span>
                                            </div>
                                            {n.bookingId && (
                                                <div className="flex items-center gap-1">
                                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                    <span className="text-emerald-600 font-bold">Rezervasiya ID: {n.bookingId.substring(0, 8)}...</span>
                                                </div>
                                            )}
                                            {n.senderId && (
                                                <div className="flex items-center gap-1">
                                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                    <span>Admin tərəfindən</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action - Delete Button */}
                                    <button
                                        onClick={() => handleDelete(n.id)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                        title="Bildirişi Sil"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Create Announcement Modal */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <Card className="w-full max-w-lg shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-5 border-b border-slate-100">
                            <div>
                                <h3 className="text-lg font-black text-slate-800 tracking-tight">Yeni Elan Göndər</h3>
                                <p className="text-xs font-semibold text-slate-400 mt-0.5">İstifadəçilərə göndəriləcək bildiriş məlumatlarını daxil edin.</p>
                            </div>
                            <button 
                                onClick={() => setIsCreateOpen(false)} 
                                className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 p-2 rounded-xl transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body / Form */}
                        <form onSubmit={handleSendAnnouncement} className="p-5 space-y-4 overflow-y-auto flex-grow">
                            {errorMsg && (
                                <div className="p-3.5 bg-rose-50 border border-rose-100/50 rounded-xl text-rose-700 text-xs font-bold leading-relaxed">
                                    {errorMsg}
                                </div>
                            )}

                            {/* Title */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Elan Başlığı</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Elanın başlığını yazın..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-500 font-medium transition-colors"
                                />
                            </div>

                            {/* Target */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Hədəf Kütlə</label>
                                <select
                                    value={target}
                                    onChange={(e: any) => setTarget(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-500 font-medium transition-colors bg-white"
                                >
                                    <option value="all">Bütün İstifadəçilər (Qonaqlar & Sahibkarlar)</option>
                                    <option value="guest">Yalnız Qonaqlar (Guests)</option>
                                    <option value="vendor">Yalnız Sahibkarlar (Vendors)</option>
                                </select>
                            </div>

                            {/* Message */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Elan Mətni</label>
                                <textarea
                                    required
                                    rows={4}
                                    placeholder="Elanın təfərrüatlı məzmununu bura daxil edin..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-500 font-medium transition-colors resize-none"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-50">
                                <Button 
                                    type="button" 
                                    variant="secondary"
                                    onClick={() => setIsCreateOpen(false)}
                                    disabled={isSending}
                                >
                                    Ləğv Et
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={isSending}
                                    className="gap-2"
                                >
                                    {isSending ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            Göndərilir...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            Göndər
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default NotificationList;
