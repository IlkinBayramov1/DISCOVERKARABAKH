import React from 'react';
import { Search, Plus, Filter, MoreHorizontal, Mail, Shield } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const UserList: React.FC = () => {
    const users = [
        { id: '1', name: 'İlkin Bayramov', email: 'ilkin@example.com', role: 'Super Admin', status: 'Aktiv', date: '12 Apr, 2026' },
        { id: '2', name: 'Aysel Məmmədova', email: 'aysel@example.com', role: 'Moderator', status: 'Aktiv', date: '14 Apr, 2026' },
        { id: '3', name: 'Orxan Əliyev', email: 'orxan@example.com', role: 'Admin', status: 'Deaktiv', date: '10 Apr, 2026' },
        { id: '4', name: 'Leyla Həsənova', email: 'leyla@example.com', role: 'Moderator', status: 'Aktiv', date: '08 Apr, 2026' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">İstifadəçi İdarəetməsi</h1>
                    <p className="text-slate-500 font-medium mt-1">Sistem adminlərini və moderatorları buradan idarə edin.</p>
                </div>
                <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Yeni İstifadəçi
                </Button>
            </div>

            {/* Filters & Table */}
            <Card noPadding>
                {/* Search & Filter Bar */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Ad və ya e-poçt ilə axtar..." 
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-10 pr-4 text-[13px] outline-none focus:border-indigo-200 focus:bg-white transition-all font-medium"
                        />
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Filter className="w-3.5 h-3.5" />
                        Filtr
                    </Button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">İstifadəçi</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Rol</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tarix</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Əməliyyat</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[13.5px] font-bold text-slate-800">{user.name}</span>
                                                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                                                    <Mail className="w-3 h-3" />
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-[13px] font-bold text-slate-600">
                                            <Shield className="w-3.5 h-3.5 text-indigo-400" />
                                            {user.role}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={user.status === 'Aktiv' ? 'success' : 'neutral'} dot>
                                            {user.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-[13px] font-medium text-slate-500">
                                        {user.date}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-100">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Placeholder */}
                <div className="p-4 border-t border-slate-50 flex items-center justify-between text-[12px] text-slate-400 font-medium">
                    <span>Cəmi 4 istifadəçi</span>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" disabled>Əvvəlki</Button>
                        <Button variant="outline" size="sm" disabled>Növbəti</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default UserList;
