import React, { useState } from 'react';
import { 
    X, MapPin, Star, Building2, Phone, Mail, 
    Image as ImageIcon, CreditCard, DollarSign, 
    Calendar, MessageSquare, ShieldAlert, FileText, Truck, Compass, Landmark
} from 'lucide-react';
import type { AdminBusiness, Booking, Review, UtilityBill } from '../types';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Card from '../../../components/ui/Card';

interface BusinessDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    business: AdminBusiness | null;
    isLoading: boolean;
    onApprove: (type: string, id: string) => void;
    isApproving: boolean;
    onReject: (type: string, id: string) => void;
    isRejecting: boolean;
}

const BusinessDetailsModal: React.FC<BusinessDetailsModalProps> = ({
    isOpen,
    onClose,
    business,
    isLoading,
    isApproving,
    onReject,
    isRejecting
}) => {
    const [activeSection, setActiveSection] = useState<'info' | 'bookings' | 'reviews' | 'finance'>('info');

    if (!isOpen || !business) return null;

    const bizType = business.bizType || business.type || 'hotel';

    // Calculate total revenue from completed/confirmed bookings
    const bookings: Booking[] = business.booking || [];
    const completedBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'completed' || b.status === 'checked_in');
    const totalRevenue = completedBookings.reduce((sum, b) => sum + b.totalAmount, 0);

    const reviews: Review[] = business.review || [];
    const averageRating = reviews.length > 0 
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : business.rating || 'N/A';

    const getTabIcon = () => {
        switch (bizType) {
            case 'hotel': return <Building2 className="w-6 h-6 text-indigo-600" />;
            case 'tour': return <Compass className="w-6 h-6 text-indigo-600" />;
            case 'attraction': return <Landmark className="w-6 h-6 text-indigo-600" />;
            case 'utility': return <FileText className="w-6 h-6 text-indigo-600" />;
            case 'transport': return <Truck className="w-6 h-6 text-indigo-600" />;
            default: return <Building2 className="w-6 h-6 text-indigo-600" />;
        }
    };

    const getDisplayName = () => {
        if (bizType === 'utility') return business.fileName || 'Kommunal Yükləmə Paketi';
        if (bizType === 'transport') return `${business.brand} ${business.model}` || 'Nəqliyyat Vasitəsi';
        return business.name || 'Biznes Obyekti';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                            {getTabIcon()}
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">{getDisplayName()}</h2>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
                                Biznes növü: <span className="text-indigo-600 font-bold">{bizType}</span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Sub Navigation Tabs */}
                <div className="flex border-b border-slate-100 px-8 bg-slate-50/50">
                    <button
                        onClick={() => setActiveSection('info')}
                        className={`py-4 px-6 font-bold text-sm border-b-2 transition-all ${
                            activeSection === 'info' 
                                ? 'border-indigo-600 text-indigo-600' 
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        Əsas Məlumatlar
                    </button>
                    {bizType !== 'utility' && (
                        <>
                            <button
                                onClick={() => setActiveSection('bookings')}
                                className={`py-4 px-6 font-bold text-sm border-b-2 transition-all ${
                                    activeSection === 'bookings' 
                                        ? 'border-indigo-600 text-indigo-600' 
                                        : 'border-transparent text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                Rezervasiyalar ({bookings.length})
                            </button>
                            <button
                                onClick={() => setActiveSection('reviews')}
                                className={`py-4 px-6 font-bold text-sm border-b-2 transition-all ${
                                    activeSection === 'reviews' 
                                        ? 'border-indigo-600 text-indigo-600' 
                                        : 'border-transparent text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                Rəylər ({reviews.length})
                            </button>
                        </>
                    )}
                    <button
                        onClick={() => setActiveSection('finance')}
                        className={`py-4 px-6 font-bold text-sm border-b-2 transition-all ${
                            activeSection === 'finance' 
                                ? 'border-indigo-600 text-indigo-600' 
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        Maliyyə & Gəlir
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <>
                            {/* SECTION 1: INFO */}
                            {activeSection === 'info' && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-3xl font-black text-slate-900">{getDisplayName()}</h3>
                                                <Badge 
                                                    variant={
                                                        business.status === 'active' || business.status === 'Active' || business.isRolledBack === false
                                                            ? 'success' 
                                                            : business.status === 'pending' || business.status === 'Pending'
                                                            ? 'warning' 
                                                            : 'error'
                                                    }
                                                >
                                                    {business.status || (business.isRolledBack ? 'Geri Qaytarılıb' : 'Aktiv')}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-4 text-slate-500 font-medium text-sm">
                                                {business.city && (
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="w-4 h-4 text-rose-500" />
                                                        {business.city} {business.address ? `, ${business.address}` : ''}
                                                    </div>
                                                )}
                                                {bizType === 'hotel' && business.starRating && (
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                                        {business.starRating} Ulduzlu
                                                    </div>
                                                )}
                                                {bizType !== 'utility' && (
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                                        {averageRating} ({reviews.length} rəy)
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Owner / Admin Details */}
                                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                                            <h4 className="text-[13px] font-black text-slate-400 uppercase tracking-widest">
                                                {bizType === 'utility' ? 'Yükləyən Admin Məlumatları' : 'Sahibkar Məlumatları'}
                                            </h4>
                                            <div className="grid grid-cols-1 gap-3">
                                                <div className="flex items-center gap-3 text-slate-700">
                                                    <Mail className="w-4 h-4 text-indigo-500" />
                                                    <span className="font-bold text-[14px]">
                                                        {bizType === 'utility' 
                                                            ? business.admin?.email 
                                                            : (business.owner?.email || business.user?.email || 'Məlumat yoxdur')}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 text-slate-700">
                                                    <Phone className="w-4 h-4 text-emerald-500" />
                                                    <span className="font-bold text-[14px]">
                                                        {bizType === 'utility' 
                                                            ? business.admin?.phone 
                                                            : (business.owner?.phone || business.user?.phone || 'Məlumat yoxdur')}
                                                    </span>
                                                </div>
                                                {bizType !== 'utility' && (business.owner?.balance !== undefined || business.user?.balance !== undefined) && (
                                                    <div className="flex items-center gap-3 text-slate-700">
                                                        <DollarSign className="w-4 h-4 text-amber-500" />
                                                        <span className="font-bold text-[14px]">
                                                            Balans: <span className="text-emerald-600 font-extrabold">{business.owner?.balance ?? business.user?.balance} AZN</span>
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Specific features */}
                                        {bizType === 'transport' && (
                                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                                                <h4 className="text-[13px] font-black text-slate-400 uppercase tracking-widest">Nəqliyyat Detalları</h4>
                                                <div className="grid grid-cols-2 gap-4 text-sm font-bold text-slate-700">
                                                    <div>Nömrə: <span className="text-indigo-600">{business.plateNumber}</span></div>
                                                    <div>İl: <span className="text-slate-500">{business.year}</span></div>
                                                    <div>Yer sayı: <span className="text-slate-500">{business.seats} nəfərlik</span></div>
                                                    <div>Rəng: <span className="text-slate-500">{business.color}</span></div>
                                                </div>
                                            </div>
                                        )}

                                        {business.description && (
                                            <div className="space-y-3">
                                                <h4 className="text-[13px] font-black text-slate-400 uppercase tracking-widest">Təsvir</h4>
                                                <p className="text-slate-600 leading-relaxed text-[15px] font-medium font-serif">
                                                    {business.description}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Gallery or Utility Info */}
                                    {bizType === 'utility' ? (
                                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-6">
                                            <h4 className="text-lg font-bold text-slate-800">Excel Paketi Statistikası</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 bg-white rounded-2xl border border-slate-100 text-center">
                                                    <span className="text-xs font-bold text-slate-400 uppercase">Sətir sayı</span>
                                                    <span className="block text-2xl font-black text-indigo-600 mt-1">{business.rowCount}</span>
                                                </div>
                                                <div className="p-4 bg-white rounded-2xl border border-slate-100 text-center">
                                                    <span className="text-xs font-bold text-slate-400 uppercase">Uğurlu</span>
                                                    <span className="block text-2xl font-black text-emerald-600 mt-1">{business.successCount}</span>
                                                </div>
                                            </div>
                                            <div className="p-4 bg-white rounded-2xl border border-slate-100 space-y-3">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-slate-400 font-bold">Batch ID:</span>
                                                    <span className="font-mono text-slate-700 font-bold">{business.batchId}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-slate-400 font-bold">Yüklənmə Tarixi:</span>
                                                    <span className="text-slate-700 font-bold">{new Date(business.createdAt).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <h4 className="text-[13px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <ImageIcon className="w-4 h-4" />
                                                Yüklənən Şəkillər
                                            </h4>
                                            <div className="grid grid-cols-2 gap-3">
                                                {business.images && (business.images as any[]).map((img: any, idx: number) => (
                                                    <div key={idx} className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group relative">
                                                        <img src={img.url || img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                    </div>
                                                ))}
                                                {(!business.images || business.images.length === 0) && (
                                                    <div className="col-span-2 py-10 bg-slate-50 border border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400">
                                                        <ImageIcon className="w-10 h-10 mb-2 text-slate-300" />
                                                        <span>Şəkil tapılmadı</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* SECTION 2: BOOKINGS */}
                            {activeSection === 'bookings' && (
                                <div className="space-y-6">
                                    <h4 className="text-lg font-black text-slate-800 flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-indigo-500" />
                                        Bütün Rezervasiya Tarixçəsi
                                    </h4>
                                    <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                                        <table className="w-full text-left text-sm text-slate-500">
                                            <thead className="text-xs text-slate-400 uppercase bg-slate-50">
                                                <tr>
                                                    <th className="px-6 py-4">Müştəri / E-poçt</th>
                                                    <th className="px-6 py-4">Tarix</th>
                                                    <th className="px-6 py-4">Məbləğ</th>
                                                    <th className="px-6 py-4">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {bookings.map((b) => (
                                                    <tr key={b.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-6 py-4 font-bold text-slate-700">{b.user?.email || 'N/A'}</td>
                                                        <td className="px-6 py-4">{new Date(b.createdAt).toLocaleDateString()}</td>
                                                        <td className="px-6 py-4 text-indigo-600 font-extrabold">{b.totalAmount} AZN</td>
                                                        <td className="px-6 py-4">
                                                            <Badge 
                                                                variant={
                                                                    b.status === 'confirmed' || b.status === 'completed'
                                                                        ? 'success' 
                                                                        : b.status === 'pending' || b.status === 'pending_payment'
                                                                        ? 'warning' 
                                                                        : 'neutral'
                                                                }
                                                            >
                                                                {b.status}
                                                            </Badge>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {bookings.length === 0 && (
                                                    <tr>
                                                        <td colSpan={4} className="px-6 py-10 text-center text-slate-400 font-bold">
                                                            Heç bir rezervasiya mövcud deyil.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* SECTION 3: REVIEWS */}
                            {activeSection === 'reviews' && (
                                <div className="space-y-6">
                                    <h4 className="text-lg font-black text-slate-800 flex items-center gap-2">
                                        <MessageSquare className="w-5 h-5 text-indigo-500" />
                                        Müştəri Rəyləri ({reviews.length})
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {reviews.map((r) => (
                                            <Card key={r.id} className="border-slate-100">
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-bold text-slate-800">
                                                            {r.user?.firstName} {r.user?.lastName}
                                                        </span>
                                                        <div className="flex items-center gap-1 text-amber-500">
                                                            <Star className="w-4 h-4 fill-amber-500" />
                                                            <span className="font-extrabold text-sm">{r.rating}</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-slate-600 text-sm font-medium italic">
                                                        "{r.comment || 'Şərh yazılmayıb.'}"
                                                    </p>
                                                    <div className="text-[11px] text-slate-400 font-bold text-right">
                                                        {new Date(r.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                        {reviews.length === 0 && (
                                            <div className="col-span-2 py-12 text-center text-slate-400 font-bold bg-slate-50 rounded-3xl border border-slate-100">
                                                Hələ rəy yazılmayıb.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* SECTION 4: FINANCE */}
                            {activeSection === 'finance' && (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-100">
                                                <DollarSign className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <span className="text-xs font-bold text-emerald-600/70 uppercase tracking-widest block">Ümumi Qazanc</span>
                                                <span className="text-2xl font-black text-emerald-700 block mt-0.5">
                                                    {bizType === 'utility' ? (business.totalPaid || 0) : totalRevenue} AZN
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-3xl flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-100">
                                                <CreditCard className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <span className="text-xs font-bold text-indigo-600/70 uppercase tracking-widest block">
                                                    {bizType === 'utility' ? 'Toplam Borc' : 'Ödəniş Sayı'}
                                                </span>
                                                <span className="text-2xl font-black text-indigo-700 block mt-0.5">
                                                    {bizType === 'utility' ? `${business.totalAmount || 0} AZN` : `${completedBookings.length} tamamlanmış`}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-400 flex items-center justify-center text-white shrink-0">
                                                <Calendar className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <span className="text-xs font-bold text-slate-500/70 uppercase tracking-widest block">Son Tranzaksiya</span>
                                                <span className="text-sm font-black text-slate-700 block mt-1.5">
                                                    {bookings.length > 0 
                                                        ? new Date(bookings[0].createdAt).toLocaleDateString()
                                                        : 'Tranzaksiya yoxdur'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {bizType === 'utility' && business.bills && (
                                        <div className="space-y-4">
                                            <h4 className="text-lg font-black text-slate-800 flex items-center gap-2">
                                                <FileText className="w-5 h-5 text-indigo-500" />
                                                Yüklənmiş Abonent Borcları
                                            </h4>
                                            <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                                                <table className="w-full text-left text-sm text-slate-500">
                                                    <thead className="text-xs text-slate-400 uppercase bg-slate-50">
                                                        <tr>
                                                            <th className="px-6 py-4">Abonent Kodu</th>
                                                            <th className="px-6 py-4">Sakin</th>
                                                            <th className="px-6 py-4">Ay / Dövriyyə</th>
                                                            <th className="px-6 py-4">Borc</th>
                                                            <th className="px-6 py-4">Ödənilib</th>
                                                            <th className="px-6 py-4">Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {(business.bills as UtilityBill[]).map((bill) => (
                                                            <tr key={bill.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                                                                <td className="px-6 py-4 font-mono font-bold text-slate-700">{bill.abonentCode}</td>
                                                                <td className="px-6 py-4 font-bold">{(bill as any).residentName || 'Sakin'}</td>
                                                                <td className="px-6 py-4 text-slate-400">{bill.billingMonth}</td>
                                                                <td className="px-6 py-4 text-slate-700 font-extrabold">{bill.amount} AZN</td>
                                                                <td className="px-6 py-4 text-emerald-600 font-extrabold">{bill.paidAmount} AZN</td>
                                                                <td className="px-6 py-4">
                                                                    <Badge variant={bill.status === 'paid' ? 'success' : bill.status === 'unpaid' ? 'error' : 'warning'}>
                                                                        {bill.status}
                                                                    </Badge>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="px-8 py-6 border-t border-gray-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4 text-amber-500" />
                        Təsdiqləmə və ya ləğvetmə birbaşa platformadakı müvafiq biznes statusunu dəyişəcəkdir.
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Button
                            variant="outline"
                            className="flex-1 sm:flex-none"
                            onClick={onClose}
                            disabled={isApproving || isRejecting}
                        >
                            Bağla
                        </Button>
                        
                        {bizType === 'utility' && !business.isRolledBack && (
                            <Button
                                className="flex-1 sm:flex-none bg-rose-600 hover:bg-rose-700 shadow-rose-100 gap-2 shrink-0 h-12 px-6 border-0"
                                onClick={() => onReject(bizType, business.id)}
                                isLoading={isRejecting}
                                disabled={isApproving || isRejecting}
                            >
                                Geri Qaytar (Rollback)
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessDetailsModal;
