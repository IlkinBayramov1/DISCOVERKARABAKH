import React from 'react';
import { UserCheck, Check, X, ExternalLink, MapPin, Building2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useUsers, useUserActions } from '../users/hooks/useUserManagement';

const VendorApprovals: React.FC = () => {
    // Data fetching
    const { data: response, isLoading, isError } = useUsers();
    const { approveUser, isApproving, rejectUser, isRejecting } = useUserActions();

    // Filtirləmə: Yalnız təsdiq gözləyən satıcılar
    const pendingVendors = (response?.data || []).filter(u => 
        u.role === 'vendor' && u.isApproved === false
    );

    const handleApprove = async (id: string) => {
        if (!id) return;
        if (window.confirm('Bu satıcını təsdiqləmək istədiyinizə əminsiniz?')) {
            try {
                await approveUser(id);
            } catch (err) {
                console.error('Approve error:', err);
            }
        }
    };

    const handleReject = async (id: string) => {
        if (!id) return;
        if (window.confirm('Bu satıcı müraciətini rədd etmək istədiyinizə əminsiniz?')) {
            try {
                await rejectUser(id);
            } catch (err) {
                console.error('Reject error:', err);
            }
        }
    };

    if (isError) {
        return (
            <Card className="flex flex-col items-center justify-center py-20 text-center border-rose-50 bg-rose-50/10">
                <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6">
                    <X className="w-10 h-10 text-rose-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 tracking-tight">Bağlantı Xətası</h3>
                <p className="text-slate-500 mt-2 font-medium max-w-sm">Məlumatları yükləyərkən problem yarandı. Serverin işlək olduğundan əmin olun.</p>
                <Button variant="outline" onClick={() => window.location.reload()} className="mt-6">Yenidən yoxla</Button>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Satıcı Təsdiqi</h1>
                    <p className="text-slate-500 font-medium mt-1">Platformaya qoşulmaq istəyən yeni satıcıların müraciətlərini dəyərləndirin.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="warning" dot className="px-4 py-2 text-sm uppercase">
                        {isLoading ? '...' : pendingVendors.length} Yeni Müraciət
                    </Badge>
                </div>
            </div>

            {/* Application List */}
            {isLoading ? (
                <div className="grid grid-cols-1 gap-6">
                    {[1, 2].map(i => (
                        <div key={i} className="h-32 bg-slate-50 rounded-3xl animate-pulse"></div>
                    ))}
                </div>
            ) : pendingVendors.length === 0 ? (
                <Card className="flex flex-col items-center justify-center py-24 text-center border-dashed border-slate-200">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                        <UserCheck className="w-10 h-10 text-slate-200" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Yeni müraciət yoxdur</h3>
                    <p className="text-slate-400 font-medium mt-2">Hazırda təsdiq gözləyən satıcı müraciəti tapılmadı.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {pendingVendors.map((vendor) => (
                        <Card key={vendor.id} noPadding className="group">
                            <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                                        <Building2 className="w-7 h-7 text-slate-400 group-hover:text-indigo-500" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-[16px] font-bold text-slate-800">
                                                {vendor.vendorprofile?.companyName || vendor.email}
                                            </h3>
                                            <Badge variant="info">
                                                {vendor.vendorprofile?.category || 'Satıcı'}
                                            </Badge>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-sm font-medium text-slate-400">
                                            <div className="flex items-center gap-1.5">
                                                <UserCheck className="w-4 h-4" />
                                                {vendor.email}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="w-4 h-4" />
                                                Qarabağ Regional Ofisi
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <ExternalLink className="w-4 h-4" />
                                                Sənədlərə bax
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    <Button 
                                        variant="outline" 
                                        className="flex-1 md:flex-none border-rose-100 text-rose-600 hover:bg-rose-50 hover:border-rose-200 gap-2"
                                        onClick={() => handleReject(vendor.id)}
                                        isLoading={isRejecting}
                                        disabled={isApproving}
                                    >
                                        {!isRejecting && <X className="w-4 h-4" />}
                                        İmtina et
                                    </Button>
                                    <Button 
                                        className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100 gap-2"
                                        onClick={() => handleApprove(vendor.id)}
                                        isLoading={isApproving}
                                        disabled={isRejecting}
                                    >
                                        {!isApproving && <Check className="w-4 h-4" />}
                                        Təsdiqlə
                                    </Button>
                                </div>
                            </div>
                            <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                    Müraciət tarixi: {new Date(vendor.createdAt).toLocaleDateString()}
                                </span>
                                <button className="text-[11px] font-bold text-indigo-600 hover:underline">Detallara bax →</button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VendorApprovals;
