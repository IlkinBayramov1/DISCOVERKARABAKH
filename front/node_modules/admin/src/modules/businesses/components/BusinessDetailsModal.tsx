import React from 'react';
import { X, Check, MapPin, Star, Building2, Phone, Mail, Image as ImageIcon, Ruler, Users } from 'lucide-react';
import type { Hotel } from '../types';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Card from '../../../components/ui/Card';

interface BusinessDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    hotel: Hotel | null;
    isLoading: boolean;
    onApprove: (id: string) => void;
    isApproving: boolean;
}

const BusinessDetailsModal: React.FC<BusinessDetailsModalProps> = ({
    isOpen,
    onClose,
    hotel,
    isLoading,
    onApprove,
    isApproving
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">Biznes Detalları</h2>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-0.5">Təsdiq öncəsi son yoxlanış</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                        </div>
                    ) : hotel ? (
                        <>
                            {/* Hero Section: Info & Images */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-3xl font-black text-slate-900">{hotel.name}</h3>
                                            <Badge variant="warning">Təsdiq Gözləyir</Badge>
                                        </div>
                                        <div className="flex items-center gap-4 text-slate-500 font-medium text-sm">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4 text-rose-500" />
                                                {hotel.city}, {hotel.address}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                                {hotel.starRating} Ulduzlu
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                                        <h4 className="text-[13px] font-black text-slate-400 uppercase tracking-widest">Sahibkar Məlumatları</h4>
                                        <div className="grid grid-cols-1 gap-3">
                                            <div className="flex items-center gap-3 text-slate-700">
                                                <Mail className="w-4 h-4 text-indigo-500" />
                                                <span className="font-bold text-[14px]">{hotel.owner?.email || 'Məlumat yoxdur'}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-slate-700">
                                                <Phone className="w-4 h-4 text-emerald-500" />
                                                <span className="font-bold text-[14px]">{hotel.owner?.phone || 'Məlumat yoxdur'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="text-[13px] font-black text-slate-400 uppercase tracking-widest">Təsvir</h4>
                                        <p className="text-slate-600 leading-relaxed text-[15px] font-medium font-serif">
                                            {hotel.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Images Gallery */}
                                <div className="space-y-4">
                                    <h4 className="text-[13px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <ImageIcon className="w-4 h-4" />
                                        Yüklənən Şəkillər ({hotel.images.length})
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        {hotel.images.map((img, idx) => (
                                            <div key={idx} className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group relative">
                                                <img src={img.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-all"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-slate-100 w-full"></div>

                            {/* Room Types */}
                            <div className="space-y-6">
                                <h4 className="text-[13px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    Otaq Tipləri və Qiymətlər
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {hotel.roomTypes.map((room) => (
                                        <Card key={room.id} className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <h5 className="font-black text-slate-800 text-lg">{room.name}</h5>
                                                    <Badge variant="info">{room.totalInventory} Ədəd</Badge>
                                                </div>
                                                <p className="text-slate-500 text-[13px] font-medium line-clamp-2">{room.description}</p>
                                                <div className="flex items-center gap-4 text-slate-400 font-bold text-xs pt-2">
                                                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {room.maxAdults} Böyük</span>
                                                    <span className="flex items-center gap-1"><Ruler className="w-3.5 h-3.5" /> 32 m²</span>
                                                </div>
                                                <div className="pt-2 flex items-center justify-between border-t border-slate-50 mt-4">
                                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Başlanğıc:</span>
                                                    <span className="text-xl font-black text-indigo-600">{room.basePrice} ₼</span>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="py-20 text-center text-slate-400 font-bold">Məlumat tapılmadı.</div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="px-8 py-6 border-t border-gray-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-slate-400 font-medium">
                        Qeyd: Təsdiqlə düyməsinə basdıqdan sonra bu mülk saytda aktiv olacaq.
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Button
                            variant="outline"
                            className="flex-1 sm:flex-none"
                            onClick={onClose}
                            disabled={isApproving}
                        >
                            Bağla
                        </Button>
                        <Button
                            className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100 gap-2 shrink-0 h-12 px-8"
                            onClick={() => hotel && onApprove(hotel.id)}
                            isLoading={isApproving}
                            disabled={!hotel}
                        >
                            {!isApproving && <Check className="w-5 h-5" />}
                            Hə, Təsdiqlə!
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessDetailsModal;
