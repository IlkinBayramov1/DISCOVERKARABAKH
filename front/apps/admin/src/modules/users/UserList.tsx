import React, { useState } from 'react';
import { 
    Search, Filter, Mail, Shield, UserX, UserCheck, 
    Trash2, Eye, X, Check, RefreshCw, ChevronDown, User, MapPin, 
    CreditCard, Calendar, Phone, FileText, AlertCircle 
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useUsers, useUserDetails, useUserActions } from './hooks/useUserManagement';
import type { AdminUserRole, UserProfile } from './types';

const UserList: React.FC = () => {
    // States
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRoles, setSelectedRoles] = useState<AdminUserRole[]>([]);
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'banned' | 'pending_approval'>('all');
    const [roleFilterOpen, setRoleFilterOpen] = useState(false);
    
    // Details panel state
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);

    // Queries
    const { data: usersRes, isLoading: isListLoading, refetch } = useUsers();
    const { data: detailRes, isLoading: isDetailLoading } = useUserDetails(selectedUserId || '');
    const { banUser, unbanUser, approveUser, rejectUser, deleteUser } = useUserActions();

    const users = usersRes?.data || [];
    const allRoles: AdminUserRole[] = ['admin', 'vendor', 'user', 'tourist', 'resident', 'investor', 'driver'];

    // Actions handler
    const handleBanToggle = async (userId: string, isCurrentlyBanned: boolean) => {
        try {
            if (isCurrentlyBanned) {
                await unbanUser(userId);
            } else {
                await banUser(userId);
            }
        } catch (error) {
            console.error('Ban toggle failed:', error);
        }
    };

    const handleApprovalToggle = async (userId: string, isCurrentlyApproved: boolean) => {
        try {
            if (isCurrentlyApproved) {
                await rejectUser(userId);
            } else {
                await approveUser(userId);
            }
        } catch (error) {
            console.error('Approval toggle failed:', error);
        }
    };

    const handleDelete = async (userId: string) => {
        if (window.confirm('Bu istifadəçini silmək istədiyinizdən əminsiniz? Bu əməliyyat geri qaytarıla bilməz!')) {
            try {
                await deleteUser(userId);
                if (selectedUserId === userId) {
                    setIsSlideOverOpen(false);
                    setSelectedUserId(null);
                }
            } catch (error) {
                console.error('Deletion failed:', error);
            }
        }
    };

    const handleRoleCheckboxChange = (role: AdminUserRole) => {
        if (selectedRoles.includes(role)) {
            setSelectedRoles(selectedRoles.filter(r => r !== role));
        } else {
            setSelectedRoles([...selectedRoles, role]);
        }
    };

    // Filter Logic
    const filteredUsers = users.filter(user => {
        // Search filter (name, surname, email)
        const namePart = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
        const emailPart = (user.email || '').toLowerCase();
        const query = searchQuery.toLowerCase();
        const matchesSearch = namePart.includes(query) || emailPart.includes(query);

        // Role filter (multi-select)
        const matchesRole = selectedRoles.length === 0 || selectedRoles.includes(user.role);

        // Status filter
        let matchesStatus = true;
        if (statusFilter === 'banned') {
            matchesStatus = user.isBanned;
        } else if (statusFilter === 'active') {
            matchesStatus = !user.isBanned && (user.role !== 'vendor' || user.isApproved);
        } else if (statusFilter === 'pending_approval') {
            matchesStatus = user.role === 'vendor' && !user.isApproved;
        }

        return matchesSearch && matchesRole && matchesStatus;
    });

    const getRoleBadgeVariant = (role: AdminUserRole) => {
        switch (role) {
            case 'admin': return 'error';
            case 'vendor': return 'success';
            case 'driver': return 'warning';
            case 'resident': return 'neutral';
            default: return 'info';
        }
    };

    const renderProfileDetails = (role: AdminUserRole, profile: UserProfile | null | undefined) => {
        if (!profile) {
            return (
                <div className="text-slate-400 font-medium text-xs py-4 text-center">
                    Bu istifadəçiyə aid əlavə profil məlumatı tapılmadı.
                </div>
            );
        }

        switch (role) {
            case 'tourist':
            case 'user': {
                const p = profile as any;
                return (
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            Turist / Qonaq Profili
                        </h4>
                        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                            <div className="space-y-0.5">
                                <span className="text-slate-400 font-semibold">Milliyyət</span>
                                <p className="font-bold text-slate-700">{p.nationality || 'Təyin edilməyib'}</p>
                            </div>
                            <div className="space-y-0.5">
                                <span className="text-slate-400 font-semibold">Pasport №</span>
                                <p className="font-bold text-slate-700 font-mono">{p.passportNumber || 'Təyin edilməyib'}</p>
                            </div>
                            <div className="space-y-0.5 col-span-2">
                                <span className="text-slate-400 font-semibold">Maraq Dairəsi</span>
                                <p className="font-bold text-slate-700">{p.interests || 'Qeyd edilməyib'}</p>
                            </div>
                            <div className="space-y-0.5 col-span-2">
                                <span className="text-slate-400 font-semibold">Təcili Əlaqə</span>
                                <p className="font-bold text-slate-700">{p.emergencyContact || 'Qeyd edilməyib'}</p>
                            </div>
                        </div>
                    </div>
                );
            }
            case 'resident': {
                const p = profile as any;
                return (
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            Sakin Profili
                        </h4>
                        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                            <div className="space-y-0.5">
                                <span className="text-slate-400 font-semibold">İcazə (Permit) №</span>
                                <p className="font-bold text-slate-700 font-mono">{p.permitNumber || 'N/A'}</p>
                            </div>
                            <div className="space-y-0.5">
                                <span className="text-slate-400 font-semibold">Ailə Tərkibi (Sayı)</span>
                                <p className="font-bold text-slate-700">{p.familyMembers || '1'}</p>
                            </div>
                            <div className="space-y-0.5 col-span-2">
                                <span className="text-slate-400 font-semibold">Yerli Ünvan</span>
                                <p className="font-bold text-slate-700">{p.localAddress || 'Təyin edilməyib'}</p>
                            </div>
                        </div>
                    </div>
                );
            }
            case 'investor': {
                const p = profile as any;
                return (
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5" />
                            İnvestor Profili
                        </h4>
                        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                            <div className="space-y-0.5">
                                <span className="text-slate-400 font-semibold">Şirkət Adı</span>
                                <p className="font-bold text-slate-700">{p.companyName || 'Şəxsi İnvestor'}</p>
                            </div>
                            <div className="space-y-0.5">
                                <span className="text-slate-400 font-semibold">Büdcə Aralığı</span>
                                <p className="font-bold text-indigo-600 font-mono">{p.budgetRange || 'Müəyyən edilməyib'}</p>
                            </div>
                            <div className="space-y-0.5 col-span-2">
                                <span className="text-slate-400 font-semibold">İnvestisiya Sahəsi</span>
                                <p className="font-bold text-slate-700">{p.investmentFocus || 'Qeyd edilməyib'}</p>
                            </div>
                        </div>
                    </div>
                );
            }
            case 'driver': {
                const p = profile as any;
                return (
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Shield className="w-3.5 h-3.5" />
                            Sürücü Profili
                        </h4>
                        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                            <div className="space-y-0.5">
                                <span className="text-slate-400 font-semibold">Lisenziya №</span>
                                <p className="font-bold text-slate-700 font-mono">{p.licenseNumber || 'N/A'}</p>
                            </div>
                            <div className="space-y-0.5">
                                <span className="text-slate-400 font-semibold">Reytinq / Səfərlər</span>
                                <p className="font-bold text-slate-700">★ {p.rating || '0'} ({p.totalRides || 0} gediş)</p>
                            </div>
                        </div>

                        {p.vehicle && (
                            <div className="space-y-2 mt-2">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Avtomobil Məlumatları</span>
                                <div className="grid grid-cols-2 gap-4 bg-indigo-50/20 p-4 rounded-xl border border-indigo-100/30 text-xs">
                                    <div className="space-y-0.5">
                                        <span className="text-slate-400 font-semibold">Marka / Model</span>
                                        <p className="font-bold text-slate-700">{p.vehicle.brand} {p.vehicle.model}</p>
                                    </div>
                                    <div className="space-y-0.5">
                                        <span className="text-slate-400 font-semibold">Dövlət Nömrəsi</span>
                                        <p className="font-bold text-slate-700 font-mono">{p.vehicle.plateNumber}</p>
                                    </div>
                                    <div className="space-y-0.5">
                                        <span className="text-slate-400 font-semibold">Kateqoriya / Yer</span>
                                        <p className="font-bold text-slate-700">{p.vehicle.category} ({p.vehicle.seats || 4} yerlik)</p>
                                    </div>
                                    <div className="space-y-0.5">
                                        <span className="text-slate-400 font-semibold">Rəng</span>
                                        <p className="font-bold text-slate-700 capitalize">{p.vehicle.color || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            }
            case 'vendor': {
                const p = profile as any;
                return (
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5" />
                            Satıcı (Vendor) Profili
                        </h4>
                        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                            <div className="space-y-0.5">
                                <span className="text-slate-400 font-semibold">Şirkət Adı</span>
                                <p className="font-bold text-slate-700">{p.companyName || 'Şəxsi Vendor'}</p>
                            </div>
                            <div className="space-y-0.5">
                                <span className="text-slate-400 font-semibold">Fəaliyyət Sahəsi</span>
                                <p className="font-bold text-slate-700">{p.category || 'Təyin edilməyib'}</p>
                            </div>
                        </div>
                    </div>
                );
            }
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">İstifadəçi İdarəetməsi</h1>
                    <p className="text-slate-500 font-medium mt-1">Platformadakı istifadəçiləri, rolları və profilləri buradan nəzarətdə saxlayın.</p>
                </div>
                <Button onClick={() => refetch()} variant="outline" className="p-2.5">
                    <RefreshCw className="w-4 h-4 text-slate-500" />
                </Button>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm relative">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Ad, soyad və ya email ilə axtar..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700 placeholder-slate-400 text-sm"
                    />
                </div>

                <div className="flex items-center gap-3">
                    {/* Multi-select Role Filter */}
                    <div className="relative">
                        <button
                            onClick={() => setRoleFilterOpen(!roleFilterOpen)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-sm font-bold text-slate-600 bg-white"
                        >
                            <Filter className="w-4 h-4 text-slate-400" />
                            Rollar: {selectedRoles.length === 0 ? 'Hamısı' : `${selectedRoles.length} rol`}
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                        </button>

                        {roleFilterOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setRoleFilterOpen(false)} />
                                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-100 bg-white shadow-xl p-3 space-y-2.5 z-20 animate-in fade-in duration-100">
                                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-50">
                                        İstifadəçi Rolları
                                    </div>
                                    <div className="space-y-2">
                                        {allRoles.map(role => (
                                            <label key={role} className="flex items-center gap-2.5 cursor-pointer group text-xs font-semibold text-slate-600 hover:text-slate-800">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRoles.includes(role)}
                                                    onChange={() => handleRoleCheckboxChange(role)}
                                                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20 cursor-pointer"
                                                />
                                                <span className="capitalize">{role}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <div className="pt-2 border-t border-slate-50 flex justify-between">
                                        <button 
                                            onClick={() => setSelectedRoles([])}
                                            className="text-[10px] font-bold text-rose-500 hover:underline"
                                        >
                                            Təmizlə
                                        </button>
                                        <button 
                                            onClick={() => setRoleFilterOpen(false)}
                                            className="text-[10px] font-bold text-indigo-600 hover:underline"
                                        >
                                            Tətbiq Et
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Status filter */}
                    <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-1">
                        {(['all', 'active', 'banned', 'pending_approval'] as const).map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    statusFilter === status
                                    ? 'bg-white text-slate-800 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                {status === 'all' && 'Hamısı'}
                                {status === 'active' && 'Aktiv'}
                                {status === 'banned' && 'Ban Edilmişlər'}
                                {status === 'pending_approval' && 'Təsdiq Gözləyənlər'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <Card noPadding>
                {isListLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center text-slate-400 font-medium gap-3">
                        <RefreshCw className="animate-spin h-5 w-5 text-indigo-500" />
                        İstifadəçilər yüklənir...
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="py-20 text-center text-slate-400 font-medium">İstifadəçi tapılmadı.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                    <th className="px-6 py-4">İstifadəçi</th>
                                    <th className="px-6 py-4">Rol</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Qeydiyyat Tarixi</th>
                                    <th className="px-6 py-4 text-right">Əməliyyatlar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {filteredUsers.map(u => {
                                    const hasName = u.firstName || u.lastName;
                                    const fullName = hasName ? `${u.firstName || ''} ${u.lastName || ''}` : 'Ad Daxil Edilməyib';
                                    
                                    // Status Badge logic
                                    let statusText = 'Aktiv';
                                    let statusVariant: 'success' | 'warning' | 'error' | 'neutral' = 'success';
                                    if (u.isBanned) {
                                        statusText = 'Ban Edilib';
                                        statusVariant = 'error';
                                    } else if (u.role === 'vendor' && !u.isApproved) {
                                        statusText = 'Təsdiq Gözləyir';
                                        statusVariant = 'warning';
                                    }

                                    return (
                                        <tr key={u.id} className="hover:bg-slate-50/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div 
                                                    className="flex items-center gap-3 cursor-pointer group"
                                                    onClick={() => { setSelectedUserId(u.id); setIsSlideOverOpen(true); }}
                                                >
                                                    <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100/50 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase shadow-sm">
                                                        {fullName.charAt(0)}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors text-sm">
                                                            {fullName}
                                                        </span>
                                                        <span className="text-xs text-slate-400 font-medium font-mono flex items-center gap-1 mt-0.5">
                                                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                                                            {u.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant={getRoleBadgeVariant(u.role)}>
                                                    {u.role}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant={statusVariant} dot>
                                                    {statusText}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-semibold text-slate-400">
                                                {new Date(u.createdAt).toLocaleDateString('az-AZ')}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        onClick={() => { setSelectedUserId(u.id); setIsSlideOverOpen(true); }}
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className={u.isBanned ? 'text-emerald-600 hover:bg-emerald-50' : 'text-amber-600 hover:bg-amber-50'}
                                                        onClick={() => handleBanToggle(u.id, u.isBanned)}
                                                    >
                                                        {u.isBanned ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-rose-600 hover:bg-rose-50"
                                                        onClick={() => handleDelete(u.id)}
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

            {/* Slide-over Detail Panel */}
            {isSlideOverOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => { setIsSlideOverOpen(false); setSelectedUserId(null); }} />

                    <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                        <div className="pointer-events-auto w-screen max-w-md transform bg-white shadow-2xl border-l border-slate-100 flex flex-col h-full animate-in slide-in-from-right duration-350">
                            {/* Slide-over Header */}
                            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-800">İstifadəçi Təfərrüatları</h3>
                                    <p className="text-[11px] text-slate-400 mt-0.5 font-mono">ID: {selectedUserId}</p>
                                </div>
                                <button 
                                    onClick={() => { setIsSlideOverOpen(false); setSelectedUserId(null); }}
                                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Slide-over Body */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {isDetailLoading ? (
                                    <div className="py-20 flex flex-col items-center justify-center text-slate-400 font-medium gap-3">
                                        <RefreshCw className="animate-spin h-5 w-5 text-indigo-500" />
                                        İstifadəçi məlumatları çəkilir...
                                    </div>
                                ) : !detailRes?.data ? (
                                    <div className="py-20 text-center text-slate-400 font-medium">Məlumat tapılmadı.</div>
                                ) : (
                                    (() => {
                                        const d = detailRes.data;
                                        const fullName = `${d.firstName || ''} ${d.lastName || ''}`.trim() || 'Ad qeyd edilmeyib';
                                        
                                        return (
                                            <>
                                                {/* Profile Avatar Card */}
                                                <div className="flex flex-col items-center text-center p-5 bg-gradient-to-b from-indigo-50/50 to-white rounded-2xl border border-indigo-100/30">
                                                    <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white font-black text-2xl flex items-center justify-center uppercase shadow-md shadow-indigo-100 mb-3">
                                                        {fullName.charAt(0)}
                                                    </div>
                                                    <h4 className="font-black text-slate-800 text-base">{fullName}</h4>
                                                    <span className="text-xs text-slate-400 font-semibold font-mono mt-0.5">{d.email}</span>
                                                    
                                                    <div className="flex items-center gap-2 mt-4">
                                                        <Badge variant={getRoleBadgeVariant(d.role)}>{d.role}</Badge>
                                                        {d.isBanned ? (
                                                            <Badge variant="error">Ban Edilib</Badge>
                                                        ) : (
                                                            <Badge variant="success">Aktiv</Badge>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Key metrics / General info */}
                                                <div className="space-y-4">
                                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                                        <User className="w-3.5 h-3.5" />
                                                        Ümumi Məlumatlar
                                                    </h4>
                                                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                                                        <div className="space-y-0.5">
                                                            <span className="text-slate-400 font-semibold flex items-center gap-1">
                                                                <Phone className="w-3 h-3 text-slate-400" />
                                                                Telefon
                                                            </span>
                                                            <p className="font-bold text-slate-700">{d.phone || 'Daxil edilməyib'}</p>
                                                        </div>
                                                        <div className="space-y-0.5">
                                                            <span className="text-slate-400 font-semibold flex items-center gap-1">
                                                                <CreditCard className="w-3 h-3 text-slate-400" />
                                                                Balans (Wallet)
                                                            </span>
                                                            <p className="font-bold text-indigo-600 font-mono">₼ {(d.balance || 0).toFixed(2)}</p>
                                                        </div>
                                                        <div className="space-y-0.5 col-span-2">
                                                            <span className="text-slate-400 font-semibold flex items-center gap-1">
                                                                <Calendar className="w-3 h-3 text-slate-400" />
                                                                Qeydiyyat Tarixi
                                                            </span>
                                                            <p className="font-bold text-slate-700">
                                                                {new Date(d.createdAt).toLocaleString('az-AZ')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Dynamic Role Profile */}
                                                {renderProfileDetails(d.role, d.profile)}

                                                {/* Vendor Specific Registration Controls */}
                                                {d.role === 'vendor' && !d.isApproved && (
                                                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl space-y-3">
                                                        <div className="flex gap-2">
                                                            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                                                            <div>
                                                                <h5 className="text-xs font-bold text-amber-800">Qeydiyyat Təsdiqi Gözlənilir</h5>
                                                                <p className="text-[11px] text-amber-600 font-medium mt-0.5">Bu satıcı hələ sistemdə təsdiqlənməyib.</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button 
                                                                size="sm" 
                                                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white border-0 gap-1.5"
                                                                onClick={() => handleApprovalToggle(d.id, d.isApproved)}
                                                            >
                                                                <Check className="w-3.5 h-3.5" />
                                                                Təsdiqlə
                                                            </Button>
                                                            <Button 
                                                                size="sm" 
                                                                variant="outline" 
                                                                className="flex-1 text-rose-600 hover:bg-rose-50"
                                                                onClick={() => handleDelete(d.id)}
                                                            >
                                                                Rədd Et
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        );
                                    })()
                                )}
                            </div>

                            {/* Slide-over Footer Actions */}
                            {!isDetailLoading && detailRes?.data && (
                                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                                    <Button
                                        variant="outline"
                                        className={detailRes.data.isBanned ? 'flex-1 text-emerald-600 hover:bg-emerald-50 border-emerald-100' : 'flex-1 text-amber-600 hover:bg-amber-50 border-amber-100'}
                                        onClick={() => handleBanToggle(detailRes.data.id, detailRes.data.isBanned)}
                                    >
                                        {detailRes.data.isBanned ? (
                                            <span className="flex items-center justify-center gap-1.5"><UserCheck className="w-4 h-4" /> Banı Aç</span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-1.5"><UserX className="w-4 h-4" /> Ban Et</span>
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex-1 text-rose-600 hover:bg-rose-50 border-rose-100 flex items-center justify-center gap-1.5"
                                        onClick={() => handleDelete(detailRes.data.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        İstifadəçini Sil
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserList;
