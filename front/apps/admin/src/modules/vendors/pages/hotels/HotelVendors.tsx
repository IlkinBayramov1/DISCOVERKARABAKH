import React from 'react';
import { Hotel, Search, Filter, MapPin, Star } from 'lucide-react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';

const HotelVendors: React.FC = () => {
    const hotels = [
        { id: '1', name: 'Qarabağ Palace', owner: 'Ramil Əliyev', location: 'Şuşa', rooms: 45, status: 'Aktiv', rating: '5.0' },
        { id: '2', name: 'Zəfər Boutique', owner: 'Günel Vəliyeva', location: 'Ağdam', rooms: 12, status: 'Aktiv', rating: '4.8' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Hotel Satıcıları</h1>
                    <p className="text-slate-500 font-medium mt-1">Platformadakı konaklama obyektlərini və mülk sahiblərini idarə edin.</p>
                </div>
            </div>

            <Card noPadding>
                <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Hotel adı ilə axtar..." 
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-10 pr-4 text-[13px] outline-none focus:border-indigo-200 focus:bg-white transition-all font-medium"
                        />
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Filter className="w-3.5 h-3.5" />
                        Filtr
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mülk Adı</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sahibkar</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Yerləşmə</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Otaq sayı</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Reytinq</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {hotels.map((hotel) => (
                                <tr key={hotel.id} className="hover:bg-slate-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                                                <Hotel className="w-5 h-5" />
                                            </div>
                                            <span className="text-[13.5px] font-bold text-slate-800">{hotel.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-[13px] font-medium text-slate-600">{hotel.owner}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-[13px] text-slate-500 font-medium">
                                            <MapPin className="w-3.5 h-3.5 text-rose-400" />
                                            {hotel.location}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center text-[13px] font-bold text-slate-700">{hotel.rooms}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1 text-[13px] font-bold text-slate-800">
                                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                            {hotel.rating}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default HotelVendors;
