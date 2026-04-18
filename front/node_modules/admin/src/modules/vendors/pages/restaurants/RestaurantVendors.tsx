import React from 'react';
import { Utensils, Search, MapPin, Star } from 'lucide-react';
import Card from '../../../../components/ui/Card';
import Badge from '../../../../components/ui/Badge';

const RestaurantVendors: React.FC = () => {
    const restaurants = [
        { id: '1', name: 'Xarıbülbül Restoranı', owner: 'Vüsal Həsənov', location: 'Şuşa', type: 'Milli Mətbəx', status: 'Aktiv', rating: '4.9' },
        { id: '2', name: 'Zəfər Süfrəsi', owner: 'Leyla Məmmədova', location: 'Ağdam', type: 'Fast Food', status: 'Aktiv', rating: '4.5' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Restoran Satıcıları</h1>
                    <p className="text-slate-500 font-medium mt-1">Platformadakı iaşə obyektlərini və restoran sahiblərini idarə edin.</p>
                </div>
            </div>

            <Card noPadding>
                <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Restoran adı ilə axtar..." 
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-10 pr-4 text-[13px] outline-none focus:border-indigo-200 focus:bg-white transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Restoran</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sahibkar</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mətbəx Türü</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Yerləşmə</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Reytinq</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {restaurants.map((res) => (
                                <tr key={res.id} className="hover:bg-slate-50/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                                                <Utensils className="w-5 h-5" />
                                            </div>
                                            <span className="text-[13.5px] font-bold text-slate-800">{res.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-[13px] font-medium text-slate-600">{res.owner}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant="info">{res.type}</Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-[13px] text-slate-500 font-medium">
                                            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                                            {res.location}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-slate-800 text-[13.5px]">
                                        <div className="flex items-center justify-end gap-1">
                                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                            {res.rating}
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

export default RestaurantVendors;
