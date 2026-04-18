import React, { useState } from 'react';
import {
    Hotel as HotelIcon, Utensils, Compass, Check, X,
    MapPin, Star, User, Building, Loader2
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { usePendingBusinesses, useApproveBusiness, useHotelDetails } from './hooks/useBusinessManagement';
import BusinessDetailsModal from './components/BusinessDetailsModal';

type BusinessType = 'all' | 'hotel' | 'restaurant' | 'tour';

const BusinessApprovals: React.FC = () => {
    const [activeTab, setActiveTab] = useState<BusinessType>('all');
    const [selectedBusiness, setSelectedBusiness] = useState<{ id: string; type: 'hotel' | 'restaurant' | 'tour' } | null>(null);

    // Data fetching
    const { data: pending, isLoading, isError } = usePendingBusinesses();
    const { mutate: approveBusiness, isPending: isApproving } = useApproveBusiness();

    // Details fetching for modal
    const { data: hotelDetails, isLoading: isLoadingDetails } = useHotelDetails(
        selectedBusiness?.type === 'hotel' ? selectedBusiness.id : null
    );

    const tabs: { id: BusinessType; label: string; icon: any }[] = [
        { id: 'all', label: 'Hamısı', icon: Building },
        { id: 'hotel', label: 'Hotellər', icon: HotelIcon },
        { id: 'restaurant', label: 'Restoranlar', icon: Utensils },
        { id: 'tour', label: 'Turlar', icon: Compass },
    ];

    // Məlumatları birləşdiririk və filtrasiya edirik
    const getFilteredBusinesses = () => {
        if (!pending) return { list: [], counts: { all: 0, hotel: 0, restaurant: 0, tour: 0 } };

        const hotels = (pending.hotels || []).map(h => ({ ...h, bizType: 'hotel' as const }));
        const restaurants = (pending.restaurants || []).map(r => ({ ...r, bizType: 'restaurant' as const }));
        const tours = (pending.tours || []).map(t => ({ ...t, bizType: 'tour' as const }));

        const all = [...hotels, ...restaurants, ...tours];

        const filtered = activeTab === 'all'
            ? all
            : all.filter(b => b.bizType === activeTab);

        return {
            list: filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
            counts: {
                all: all.length,
                hotel: hotels.length,
                restaurant: restaurants.length,
                tour: tours.length
            }
        };
    };

    const { list, counts } = getFilteredBusinesses();

    const getIcon = (type: string) => {
        switch (type) {
            case 'hotel': return <HotelIcon className="w-6 h-6" />;
            case 'restaurant': return <Utensils className="w-6 h-6" />;
            case 'tour': return <Compass className="w-6 h-6" />;
            default: return <Building className="w-6 h-6" />;
        }
    };

    const handleApprove = (type: 'hotel' | 'restaurant' | 'tour', id: string) => {
        approveBusiness({ type, id }, {
            onSuccess: () => {
                setSelectedBusiness(null);
            }
        });
    };

    if (isError) return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                <X className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Xəta Baş Verdi</h3>
            <p className="text-slate-500 max-w-xs mt-2">Məlumatları yükləyərkən problem yarandı. Zəhmət olmasa internet bağlantınızı yoxlayın.</p>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header with Hero stats style */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Biznes Təsdiqi</h1>
                    <p className="text-slate-500 font-medium mt-1">Platformaya qoşulmaq gözləyən mülk və xidmətləri idarə edin.</p>
                </div>

                {/* Minimalist Tabs */}
                <div className="flex items-center gap-1 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/50">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-300 ${activeTab === tab.id
                                    ? 'bg-white text-indigo-600 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                                }`}
                        >
                            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-indigo-500' : 'text-slate-400'}`} />
                            {tab.label}
                            <span className={`ml-1 text-[11px] px-1.5 py-0.5 rounded-md ${activeTab === tab.id ? 'bg-indigo-50 text-indigo-400' : 'bg-slate-200 text-slate-400'
                                }`}>
                                {counts[tab.id]}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            {isLoading ? (
                <div className="grid grid-cols-1 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-32 w-full bg-slate-50 rounded-3xl animate-pulse"></div>
                    ))}
                </div>
            ) : list.length === 0 ? (
                <Card className="flex flex-col items-center justify-center py-20 text-center opacity-80">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                        <Loader2 className="w-10 h-10 text-slate-200" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Təsdiq Gözləyən Müraciət Yoxdur</h3>
                    <p className="text-slate-400 font-medium mt-2 max-w-sm">
                        Hal-hazırda {activeTab === 'all' ? 'heç bir' : activeTab === 'hotel' ? 'hotel' : activeTab === 'restaurant' ? 'restoran' : 'tur'} müraciəti mövcud deyil.
                    </p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {list.map((biz) => (
                        <Card key={biz.id} noPadding className="group hover:border-indigo-100 transition-all duration-500">
                            <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                <div className="flex items-start gap-5 flex-1">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-slate-400 transition-all group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 duration-500">
                                        {getIcon(biz.bizType)}
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-[17px] font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">{biz.name}</h3>
                                            <Badge variant="neutral" className="bg-slate-50 text-slate-500 capitalize">{biz.bizType}</Badge>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-y-1 gap-x-5 text-[13px] font-medium text-slate-400">
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="w-4 h-4 text-rose-400" />
                                                {(biz as any).city || 'Qarabağ'}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <User className="w-4 h-4 text-indigo-400" />
                                                {biz.owner?.email || 'Sahibkar'}
                                            </div>
                                            {biz.bizType === 'hotel' && (
                                                <div className="flex items-center gap-1.5 border-l border-slate-200 pl-5">
                                                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                                    <span className="text-slate-700 font-bold">{(biz as any).starRating}*</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    <Button
                                        variant="outline"
                                        className="flex-1 md:flex-none"
                                        onClick={() => setSelectedBusiness({ id: biz.id, type: biz.bizType })}
                                    >
                                        Detallara Bax
                                    </Button>
                                    <Button
                                        className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100 gap-2 border-0"
                                        onClick={() => handleApprove(biz.bizType, biz.id)}
                                        isLoading={isApproving && selectedBusiness?.id === biz.id}
                                    >
                                        <Check className="w-4 h-4" />
                                        Təsdiqlə
                                    </Button>
                                </div>
                            </div>
                            <div className="px-7 py-3.5 bg-[#FAFBFC]/50 border-t border-slate-100/60 flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></div>
                                        Yaranma Tarixi: {new Date(biz.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setSelectedBusiness({ id: biz.id, type: biz.bizType })}
                                        className="text-[11px] font-bold text-indigo-500 hover:underline"
                                    >
                                        Sənədləri yoxla →
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Detail Modal */}
            <BusinessDetailsModal
                isOpen={!!selectedBusiness}
                onClose={() => setSelectedBusiness(null)}
                hotel={hotelDetails || null}
                isLoading={isLoadingDetails}
                onApprove={(id) => handleApprove(selectedBusiness?.type || 'hotel', id)}
                isApproving={isApproving}
            />
        </div>
    );
};

export default BusinessApprovals;