import React, { useState } from 'react';
import {
    Hotel as HotelIcon, Compass, Landmark, FileText, Truck, X,
    MapPin, Star, User, Building, Loader2, Search, RotateCcw
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useBusinesses, useApproveBusiness, useRejectBusiness } from './hooks/useBusinessManagement';
import BusinessDetailsModal from './components/BusinessDetailsModal';
import type { BusinessType, AdminBusiness } from './types';

const BusinessApprovals: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'all' | BusinessType>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBusiness, setSelectedBusiness] = useState<{ id: string; type: BusinessType } | null>(null);

    // Data fetching
    const { data: businesses, isLoading, isError, refetch } = useBusinesses();
    const { mutate: approveBusiness, isPending: isApproving } = useApproveBusiness();
    const { mutate: rejectBusiness, isPending: isRejecting } = useRejectBusiness();

    const tabs: { id: 'all' | BusinessType; label: string; icon: any }[] = [
        { id: 'all', label: 'Hamısı', icon: Building },
        { id: 'hotel', label: 'Hotellər', icon: HotelIcon },
        { id: 'tour', label: 'Turlar', icon: Compass },
        { id: 'attraction', label: 'Görməli Yerlər', icon: Landmark },
        { id: 'utility', label: 'Kommunal', icon: FileText },
        { id: 'transport', label: 'Nəqliyyat', icon: Truck },
    ];

    // Merge and filter businesses from the payload
    const getFilteredBusinesses = () => {
        if (!businesses || !businesses.data) {
            return { list: [], counts: { all: 0, hotel: 0, tour: 0, attraction: 0, utility: 0, transport: 0 } };
        }

        const hotels = (businesses.data.hotels || []).map((h: any) => ({ ...h, bizType: 'hotel' as const }));
        const tours = (businesses.data.tours || []).map((t: any) => ({ ...t, bizType: 'tour' as const }));
        const attractions = (businesses.data.attractions || []).map((a: any) => ({ ...a, bizType: 'attraction' as const }));
        const utility = (businesses.data.utility || []).map((u: any) => ({ ...u, bizType: 'utility' as const }));
        const transport = (businesses.data.transport || []).map((tr: any) => ({ ...tr, bizType: 'transport' as const }));

        const all: AdminBusiness[] = [...hotels, ...tours, ...attractions, ...utility, ...transport];

        // Apply Tab Filter
        let filtered = activeTab === 'all' 
            ? all 
            : all.filter(b => b.bizType === activeTab);

        // Apply Search Filter
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(b => {
                const name = b.name?.toLowerCase() || '';
                const fileName = b.fileName?.toLowerCase() || '';
                const brand = b.brand?.toLowerCase() || '';
                const model = b.model?.toLowerCase() || '';
                const city = b.city?.toLowerCase() || '';
                const email = b.owner?.email?.toLowerCase() || b.user?.email?.toLowerCase() || b.admin?.email?.toLowerCase() || '';
                
                return name.includes(query) || 
                       fileName.includes(query) || 
                       brand.includes(query) || 
                       model.includes(query) || 
                       city.includes(query) || 
                       email.includes(query);
            });
        }

        return {
            list: filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
            counts: {
                all: all.length,
                hotel: hotels.length,
                tour: tours.length,
                attraction: attractions.length,
                utility: utility.length,
                transport: transport.length
            }
        };
    };

    const { list, counts } = getFilteredBusinesses();

    // Selected business object from the list to pass directly to details modal
    const selectedBusinessData = list.find(b => b.id === selectedBusiness?.id) || null;

    const getIcon = (type: BusinessType) => {
        switch (type) {
            case 'hotel': return <HotelIcon className="w-6 h-6" />;
            case 'tour': return <Compass className="w-6 h-6" />;
            case 'attraction': return <Landmark className="w-6 h-6" />;
            case 'utility': return <FileText className="w-6 h-6" />;
            case 'transport': return <Truck className="w-6 h-6" />;
            default: return <Building className="w-6 h-6" />;
        }
    };

    const getBusinessTitle = (biz: AdminBusiness) => {
        if (biz.bizType === 'utility') return biz.fileName || 'Kommunal Borc Paketi';
        if (biz.bizType === 'transport') return `${biz.brand} ${biz.model}` || 'Nəqliyyat';
        return biz.name || 'Biznes Obyekti';
    };

    const getBusinessSubtitle = (biz: AdminBusiness) => {
        if (biz.bizType === 'utility') return `Sətir: ${biz.rowCount} | Uğurlu: ${biz.successCount}`;
        if (biz.bizType === 'transport') return `Nömrə: ${biz.plateNumber} | Yer: ${biz.seats}`;
        if (biz.bizType === 'attraction') return `Giriş: ${biz.entryType} | Qiymət: ${biz.price ? `${biz.price} AZN` : 'Pulsuz'}`;
        return biz.address || 'Ünvan yoxdur';
    };

    const getOwnerEmail = (biz: AdminBusiness) => {
        if (biz.bizType === 'utility') return biz.admin?.email || 'Naməlum Admin';
        return biz.owner?.email || biz.user?.email || 'Məlumat yoxdur';
    };

    const handleApprove = (type: string, id: string) => {
        approveBusiness({ type: type as BusinessType, id }, {
            onSuccess: () => {
                setSelectedBusiness(null);
                refetch();
            }
        });
    };

    const handleReject = (type: string, id: string) => {
        if (window.confirm(type === 'utility' ? 'Bu Excel yükləməsini geri qaytarmaq (Rollback) istədiyinizdən əminsiniz?' : 'Bu biznesi rədd etmək istəyirsiniz?')) {
            rejectBusiness({ type: type as BusinessType, id }, {
                onSuccess: () => {
                    setSelectedBusiness(null);
                    refetch();
                }
            });
        }
    };

    if (isError) return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                <X className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Xəta Baş Verdi</h3>
            <p className="text-slate-500 max-w-xs mt-2">Məlumatları yükləyərkən problem yarandı. Zəhmət olmasa yenidən cəhd edin.</p>
            <Button className="mt-6" onClick={() => refetch()}>Yenidən Yüklə</Button>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header with Search and Stats */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Biznes İdarəetməsi & Təsdiqi</h1>
                    <p className="text-slate-500 font-medium mt-1">Platformadakı hotellər, turlar, görməli yerlər, kommunal yükləmələr və nəqliyyatı idarə edin.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* Search bar */}
                    <div className="relative flex-1 sm:w-80">
                        <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Axtar (ad, şəhər, email, brend...)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-2xl text-sm font-semibold transition-all outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Premium Tabs Menu */}
            <div className="overflow-x-auto pb-2 scrollbar-thin">
                <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/50 min-w-max">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-[13px] font-bold transition-all duration-300 ${activeTab === tab.id
                                    ? 'bg-white text-indigo-600 shadow-md'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                                }`}
                        >
                            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-indigo-500' : 'text-slate-400'}`} />
                            {tab.label}
                            <span className={`ml-1 text-[11px] px-1.5 py-0.5 rounded-md ${activeTab === tab.id ? 'bg-indigo-50 text-indigo-500 font-black' : 'bg-slate-200/60 text-slate-400'
                                }`}>
                                {counts[tab.id as keyof typeof counts] ?? counts.all}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content List */}
            {isLoading ? (
                <div className="grid grid-cols-1 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-32 w-full bg-slate-50 border border-slate-100 rounded-3xl animate-pulse"></div>
                    ))}
                </div>
            ) : list.length === 0 ? (
                <Card className="flex flex-col items-center justify-center py-20 text-center opacity-85">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                        <Loader2 className="w-10 h-10 text-slate-300 animate-spin" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Müraciət və ya Məlumat Tapılmadı</h3>
                    <p className="text-slate-400 font-medium mt-2 max-w-sm">
                        Seçilmiş kateqoriyada {searchQuery ? 'axtarışa uyğun' : 'heç bir'} aktiv və ya təsdiq gözləyən müraciət mövcud deyil.
                    </p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {list.map((biz) => (
                        <Card key={biz.id} noPadding className="group hover:border-indigo-100 transition-all duration-500 border border-slate-100 shadow-sm hover:shadow-md">
                            <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                <div className="flex items-start gap-5 flex-1">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-slate-400 transition-all group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 duration-500">
                                        {getIcon(biz.bizType!)}
                                    </div>
                                    <div className="space-y-1.5 flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h3 className="text-[17px] font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors truncate">
                                                {getBusinessTitle(biz)}
                                            </h3>
                                            <Badge variant="neutral" className="bg-slate-100 text-slate-500 capitalize font-extrabold">{biz.bizType}</Badge>
                                            {biz.status === 'Inactive' && (
                                                <Badge variant="error" className="font-extrabold text-[10px]">Deaktiv</Badge>
                                            )}
                                        </div>
                                        <div className="text-[13px] font-medium text-slate-500">
                                            {getBusinessSubtitle(biz)}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-y-1 gap-x-5 text-[12px] font-bold text-slate-400">
                                            {biz.city && (
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                                                    {biz.city}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1.5">
                                                <User className="w-3.5 h-3.5 text-indigo-400" />
                                                {getOwnerEmail(biz)}
                                            </div>
                                            {biz.bizType === 'hotel' && biz.starRating && (
                                                <div className="flex items-center gap-1.5">
                                                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                                    <span className="text-slate-700 font-extrabold">{biz.starRating} Ulduz</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                                    <Button
                                        variant="outline"
                                        className="flex-1 md:flex-none border-slate-200 text-slate-700 font-bold hover:bg-slate-50 rounded-xl"
                                        onClick={() => setSelectedBusiness({ id: biz.id, type: biz.bizType! })}
                                    >
                                        Detallara Bax
                                    </Button>

                                    {biz.bizType === 'utility' && !biz.isRolledBack && (
                                        <Button
                                            className="flex-1 md:flex-none bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-xl font-bold p-3 flex items-center gap-1.5"
                                            onClick={() => handleReject(biz.bizType!, biz.id)}
                                            isLoading={isRejecting && selectedBusiness?.id === biz.id}
                                        >
                                            <RotateCcw className="w-4 h-4" />
                                            Geri Qaytar
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <div className="px-7 py-3 bg-[#FAFBFC] border-t border-slate-100 flex items-center justify-between rounded-b-3xl">
                                <div className="flex items-center gap-5">
                                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                        Tarix: {new Date(biz.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setSelectedBusiness({ id: biz.id, type: biz.bizType! })}
                                        className="text-[11px] font-black text-indigo-600 hover:underline"
                                    >
                                        Ətraflı Analiz Et →
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Details Modal */}
            <BusinessDetailsModal
                isOpen={!!selectedBusiness}
                onClose={() => setSelectedBusiness(null)}
                business={selectedBusinessData}
                isLoading={isLoading}
                onApprove={handleApprove}
                isApproving={isApproving}
                onReject={handleReject}
                isRejecting={isRejecting}
            />
        </div>
    );
};

export default BusinessApprovals;