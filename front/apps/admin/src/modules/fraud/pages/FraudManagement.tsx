import React, { useState } from 'react';
import { 
    ShieldAlert, Search, Plus, Trash2, Mail, Phone, Globe, 
    X, ShieldCheck, AlertTriangle, ChevronDown, ChevronUp, Clock 
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { useBlacklist, useBlacklistActions, useRiskLogs } from '../hooks/useFraudModeration';
import type { BlacklistType } from '../types';

const FraudManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'blacklist' | 'logs'>('blacklist');
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState<'all' | BlacklistType>('all');
    
    // Add entry state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newType, setNewType] = useState<BlacklistType>('email');
    const [newValue, setNewValue] = useState('');
    const [newReason, setNewReason] = useState('');
    const [formError, setFormError] = useState('');

    // Risk logs expand state
    const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

    // Queries & Mutations
    const { data: blacklistRes, isLoading: isBlacklistLoading } = useBlacklist();
    const { data: riskLogsRes, isLoading: isLogsLoading } = useRiskLogs();
    const { addToBlacklist, isAdding, removeFromBlacklist } = useBlacklistActions();

    const handleAddEntry = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');

        if (!newValue.trim()) {
            setFormError('Lütfən dəyəri daxil edin.');
            return;
        }

        if (!newReason.trim()) {
            setFormError('Lütfən bloklanma səbəbini daxil edin.');
            return;
        }

        try {
            await addToBlacklist({
                type: newType,
                value: newValue.trim(),
                reason: newReason.trim()
            });
            setIsAddModalOpen(false);
            setNewValue('');
            setNewReason('');
        } catch (err: any) {
            setFormError(err.response?.data?.message || 'Əlavə edilən zaman xəta baş verdi.');
        }
    };

    const handleDeleteEntry = async (id: string) => {
        if (window.confirm('Bu elementi qara siyahıdan çıxarmaq istədiyinizdən əminsiniz?')) {
            try {
                await removeFromBlacklist(id);
            } catch (err) {
                alert('Silinən zaman xəta baş verdi.');
            }
        }
    };

    // Filter and search blacklist
    const blacklistData = blacklistRes?.data || [];
    const filteredBlacklist = blacklistData.filter(item => {
        const matchesSearch = item.value.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              (item.reason && item.reason.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesType = typeFilter === 'all' || item.type === typeFilter;
        return matchesSearch && matchesType;
    });

    const riskLogsData = riskLogsRes?.data || [];

    const getScoreBadgeVariant = (score: number) => {
        if (score >= 75) return 'error';
        if (score >= 40) return 'warning';
        return 'success';
    };

    const getTypeIcon = (type: BlacklistType) => {
        switch (type) {
            case 'email': return <Mail className="w-4 h-4 text-indigo-500" />;
            case 'phone': return <Phone className="w-4 h-4 text-emerald-500" />;
            case 'ip': return <Globe className="w-4 h-4 text-amber-500" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2.5">
                        <ShieldAlert className="w-7 h-7 text-rose-500" />
                        Təhlükəsizlik və Risk İdarəetməsi
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Platformanın təhlükəsizliyini qorumaq üçün qara siyahını və sistem risk loqlarını buradan idarə edin.</p>
                </div>
                {activeTab === 'blacklist' && (
                    <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Yeni Element Əlavə Et
                    </Button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 gap-6">
                <button
                    onClick={() => setActiveTab('blacklist')}
                    className={`py-3.5 px-1 font-bold text-sm border-b-2 transition-all relative ${
                        activeTab === 'blacklist'
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-slate-400 hover:text-slate-700'
                    }`}
                >
                    Qara Siyahı (Blacklist)
                    {blacklistData.length > 0 && (
                        <span className="ml-2 bg-indigo-50 text-indigo-600 text-xs font-bold px-2 py-0.5 rounded-full">
                            {blacklistData.length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('logs')}
                    className={`py-3.5 px-1 font-bold text-sm border-b-2 transition-all relative ${
                        activeTab === 'logs'
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-slate-400 hover:text-slate-700'
                    }`}
                >
                    Risk Qiymətləndirmə Loqları
                    {riskLogsData.length > 0 && (
                        <span className="ml-2 bg-rose-50 text-rose-600 text-xs font-bold px-2 py-0.5 rounded-full">
                            {riskLogsData.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Blacklist Tab */}
            {activeTab === 'blacklist' && (
                <div className="space-y-6">
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
                        <div className="relative flex-1 max-w-md">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Dəyər və ya səbəb axtar..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700 placeholder-slate-400"
                            />
                        </div>
                        <div className="flex gap-2">
                            {(['all', 'email', 'ip', 'phone'] as const).map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setTypeFilter(filter)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                                        typeFilter === filter
                                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                    }`}
                                >
                                    {filter === 'all' ? 'Hamısı' : filter.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table Card */}
                    <Card noPadding>
                        {isBlacklistLoading ? (
                            <div className="py-20 flex flex-col items-center justify-center text-slate-400 font-medium gap-3">
                                <div className="animate-spin h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full" />
                                Yüklənir...
                            </div>
                        ) : filteredBlacklist.length === 0 ? (
                            <div className="py-20 flex flex-col items-center justify-center text-slate-400 font-medium">
                                <ShieldCheck className="w-12 h-12 text-slate-300 mb-3" />
                                Qara siyahı təmizdir.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                            <th className="px-6 py-4">Tip</th>
                                            <th className="px-6 py-4">Dəyər</th>
                                            <th className="px-6 py-4">Bloklanma Səbəbi</th>
                                            <th className="px-6 py-4">Əlavə Edildi</th>
                                            <th className="px-6 py-4 text-right">Əməliyyat</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredBlacklist.map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                                                <td className="px-6 py-4.5">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-50 border border-slate-100 capitalize">
                                                        {getTypeIcon(item.type)}
                                                        {item.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4.5 text-sm font-bold text-slate-700">
                                                    {item.value}
                                                </td>
                                                <td className="px-6 py-4.5 text-sm text-slate-500 font-medium max-w-xs truncate" title={item.reason}>
                                                    {item.reason || 'Səbəb qeyd edilməyib'}
                                                </td>
                                                <td className="px-6 py-4.5 text-sm text-slate-400 font-medium">
                                                    {new Date(item.createdAt).toLocaleDateString('az-AZ', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4.5 text-right">
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => handleDeleteEntry(item.id)}
                                                        className="hover:scale-100 opacity-80 hover:opacity-100"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>
                </div>
            )}

            {/* Risk Logs Tab */}
            {activeTab === 'logs' && (
                <Card noPadding>
                    {isLogsLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center text-slate-400 font-medium gap-3">
                            <div className="animate-spin h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full" />
                            Yüklənir...
                        </div>
                    ) : riskLogsData.length === 0 ? (
                        <div className="py-20 flex flex-col items-center justify-center text-slate-400 font-medium">
                            <ShieldCheck className="w-12 h-12 text-slate-300 mb-3" />
                            Sistemdə şübhəli loq qeydə alınmayıb.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                        <th className="px-6 py-4 w-10"></th>
                                        <th className="px-6 py-4">Tarix</th>
                                        <th className="px-6 py-4">Əməliyyat</th>
                                        <th className="px-6 py-4">Risk Balı</th>
                                        <th className="px-6 py-4">Qərar</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {riskLogsData.map((log) => {
                                        const isExpanded = expandedLogId === log.id;
                                        return (
                                            <React.Fragment key={log.id}>
                                                <tr 
                                                    onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                                                    className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                                                >
                                                    <td className="px-6 py-4.5">
                                                        {isExpanded ? (
                                                            <ChevronUp className="w-4 h-4 text-slate-400" />
                                                        ) : (
                                                            <ChevronDown className="w-4 h-4 text-slate-400" />
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4.5 text-sm text-slate-400 font-semibold flex items-center gap-1.5">
                                                        <Clock className="w-3.5 h-3.5 text-slate-300" />
                                                        {new Date(log.createdAt).toLocaleString('az-AZ')}
                                                    </td>
                                                    <td className="px-6 py-4.5 text-sm font-bold text-slate-700 capitalize">
                                                        {log.action.replace(/_/g, ' ')}
                                                    </td>
                                                    <td className="px-6 py-4.5">
                                                        <Badge variant={getScoreBadgeVariant(log.details.score)}>
                                                            {log.details.score} / 100
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4.5">
                                                        {log.details.isApproved ? (
                                                            <Badge variant="success" dot>İcazə Verildi</Badge>
                                                        ) : (
                                                            <Badge variant="error" dot>Bloklandı</Badge>
                                                        )}
                                                    </td>
                                                </tr>
                                                {isExpanded && (
                                                    <tr>
                                                        <td colSpan={5} className="px-8 py-5 bg-slate-50/70 border-t border-b border-slate-100">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                {/* Risk reasons */}
                                                                <div>
                                                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                                                                        Təhlükə Analizi
                                                                    </h4>
                                                                    {log.details.reasons.length === 0 ? (
                                                                        <p className="text-sm font-medium text-emerald-600">Tam təhlükəsiz (heç bir risk faktoru aşkarlanmadı)</p>
                                                                    ) : (
                                                                        <ul className="space-y-1.5">
                                                                            {log.details.reasons.map((reason, idx) => (
                                                                                <li key={idx} className="text-sm font-semibold text-rose-600 flex items-start gap-2">
                                                                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                                                                                    {reason}
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    )}
                                                                </div>

                                                                {/* JSON Context */}
                                                                <div>
                                                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Metadata və Kontekst</h4>
                                                                    <pre className="text-[11px] font-mono bg-slate-900 text-slate-200 p-4 rounded-xl max-h-60 overflow-y-auto leading-relaxed shadow-inner">
                                                                        {JSON.stringify(log.context, null, 2)}
                                                                    </pre>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            )}

            {/* Add Blacklist Entry Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-250">
                    <div className="w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden animate-in scale-in duration-300">
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                <ShieldAlert className="w-5 h-5 text-indigo-600" />
                                Qara Siyahıya Əlavə Et
                            </h3>
                            <button 
                                onClick={() => setIsAddModalOpen(false)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleAddEntry} className="p-6 space-y-4">
                            {formError && (
                                <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-xs font-semibold text-rose-600">
                                    {formError}
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tip</label>
                                <select
                                    value={newType}
                                    onChange={(e) => setNewType(e.target.value as BlacklistType)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700 bg-white"
                                >
                                    <option value="email">Email Adresi</option>
                                    <option value="ip">IP Adresi</option>
                                    <option value="phone">Telefon Nömrəsi</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dəyər</label>
                                <input
                                    type="text"
                                    placeholder={newType === 'email' ? 'istifadeci@email.com' : newType === 'ip' ? '192.168.1.1' : '+994XXXXXXXXX'}
                                    value={newValue}
                                    onChange={(e) => setNewValue(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700 placeholder-slate-400"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bloklanma Səbəbi</label>
                                <textarea
                                    rows={3}
                                    placeholder="Niyə bu element qara siyahıya alınır? (məs. şübhəli rezervasiyalar, spamlama və s.)"
                                    value={newReason}
                                    onChange={(e) => setNewReason(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700 placeholder-slate-400 resize-none"
                                />
                            </div>

                            <div className="pt-2 flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1"
                                >
                                    Ləğv Et
                                </Button>
                                <Button
                                    type="submit"
                                    isLoading={isAdding}
                                    className="flex-1"
                                >
                                    Əlavə Et
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FraudManagement;
