import React from 'react';
import {
    Users, Briefcase, TrendingUp,
    ArrowUpRight, Clock, ShieldAlert, Award,
    Landmark, RefreshCw, Car, Mail,
    AlertTriangle, Percent, Ban
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useDashboardAnalytics } from './hooks/useAnalytics';

const Overview: React.FC = () => {
    const { data: analyticsRes, isLoading, isError, error, triggerRefresh, isRefetching } = useDashboardAnalytics();

    const data = analyticsRes?.data;

    // Helper for rendering unavailable metrics
    const renderMetric = (value: number | string | null | undefined, suffix: string = '') => {
        if (value === null || value === undefined) {
            return (
                <span className="text-[11px] font-bold text-amber-500 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-lg inline-flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Yüklənmədi
                </span>
            );
        }
        return `${value.toLocaleString('az-AZ')}${suffix}`;
    };

    if (isError) {
        return (
            <Card className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 border-rose-100 bg-rose-50/20">
                <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mb-4 border border-rose-100">
                    <ShieldAlert className="text-rose-500 w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Analitika Məlumatları Yüklənmədi</h3>
                <p className="text-slate-500 font-medium max-w-sm mt-1 mb-6">
                    Məlumatlar bazasından statistikaları çəkərkən xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.
                </p>
                <div className="text-xs text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-xl font-mono mb-6 max-w-md break-all">
                    {(error as any)?.message || 'Bilinməyən verilənlər bazası xətası.'}
                </div>
                <Button onClick={() => triggerRefresh()} className="gap-2">
                    <RefreshCw className="w-4 h-4" /> Yenidən Yoxla
                </Button>
            </Card>
        );
    }

    if (isLoading || !data) {
        return (
            <div className="space-y-8 animate-pulse">
                {/* Header Skeleton */}
                <div className="flex justify-between items-center">
                    <div className="space-y-2">
                        <div className="h-7 bg-slate-200 rounded w-60"></div>
                        <div className="h-4 bg-slate-100 rounded w-96"></div>
                    </div>
                    <div className="w-24 h-10 bg-slate-200 rounded-xl"></div>
                </div>

                {/* Grid Skeletons */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <Card key={i} className="p-5">
                            <div className="flex justify-between items-center">
                                <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
                                <div className="w-12 h-6 bg-slate-200 rounded-lg"></div>
                            </div>
                            <div className="mt-5 space-y-2">
                                <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                                <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                            </div>
                        </Card>
                    ))}
                </div>
                {/* Middle Grid Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="lg:col-span-2 min-h-[400px]">
                        <div className="h-full bg-slate-50/50 rounded-xl" />
                    </Card>
                    <Card className="min-h-[400px]">
                        <div className="h-full bg-slate-50/50 rounded-xl" />
                    </Card>
                </div>
            </div>
        );
    }

    // SVG Line Chart Scaling Math
    const trends = data.trends || [];
    const width = 500;
    const height = 180;
    const paddingLeft = 45;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 30;

    const amounts = trends.map(t => t.amount);
    const maxAmount = Math.max(...amounts, 100); // Prevent division by zero

    const points = trends.map((t, idx) => {
        const x = paddingLeft + (idx / (trends.length - 1 || 1)) * (width - paddingLeft - paddingRight);
        const y = height - paddingBottom - (t.amount / maxAmount) * (height - paddingTop - paddingBottom);
        return { x, y, ...t };
    });

    const linePath = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = points.length > 0
        ? `${linePath} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`
        : '';

    // Booking counts by type formatting
    const hotelBookings = data.bookings.byType.find(b => b.bookingType === 'hotel')?._count?.id || 0;
    const tourBookings = data.bookings.byType.find(b => b.bookingType === 'tour')?._count?.id || 0;

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Xoş gəlmisiniz, Super Admin! 👋</h1>
                    <p className="text-slate-500 font-medium mt-1">Platformanın cari analitika və modullar üzrə göstəriciləri.</p>
                </div>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => triggerRefresh()}
                    disabled={isRefetching}
                    className="gap-2 shrink-0 border border-slate-200"
                >
                    <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
                    Məlumatları Yenilə
                </Button>
            </div>

            {/* Core Stats Grid (Top 4 Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* 1. Users Card */}
                <Card className="hover:translate-y-[-2px] transition-transform">
                    <div className="flex items-start justify-between">
                        <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                            <Users className="w-6 h-6" />
                        </div>
                        <Badge variant="info">Qonaq & Sahibkar</Badge>
                    </div>
                    <div className="mt-5">
                        <p className="text-[12px] font-black text-slate-400 uppercase tracking-wider">Ümumi İstifadəçilər</p>
                        <h3 className="text-2xl font-black text-slate-800 mt-1">
                            {renderMetric(data.users.total)}
                        </h3>
                    </div>
                    <div className="mt-4 flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                        <Ban className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>Bloklanan istifadəçi: <strong>{data.users.banned ?? 0}</strong></span>
                    </div>
                </Card>

                {/* 2. Bookings Card */}
                <Card className="hover:translate-y-[-2px] transition-transform">
                    <div className="flex items-start justify-between">
                        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <Badge variant="success">Sifariş Həcmi</Badge>
                    </div>
                    <div className="mt-5">
                        <p className="text-[12px] font-black text-slate-400 uppercase tracking-wider">Platforma Sifarişləri</p>
                        <h3 className="text-2xl font-black text-slate-800 mt-1">
                            {renderMetric(data.bookings.total)}
                        </h3>
                    </div>
                    <div className="mt-4 flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                        <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>Otellər: <strong>{hotelBookings}</strong>, Turlar: <strong>{tourBookings}</strong></span>
                    </div>
                </Card>

                {/* 3. Pending Approvals Card */}
                <Card className="hover:translate-y-[-2px] transition-transform">
                    <div className="flex items-start justify-between">
                        <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <Badge variant="warning">Təsdiq Gözləyən</Badge>
                    </div>
                    <div className="mt-5">
                        <p className="text-[12px] font-black text-slate-400 uppercase tracking-wider">Təsdiq Gözləyən Bizneslər</p>
                        <h3 className="text-2xl font-black text-slate-800 mt-1">
                            {renderMetric(data.businesses.pendingCount)}
                        </h3>
                    </div>
                    <div className="mt-4 flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>Yeni obyektlər yoxlanılmalıdır</span>
                    </div>
                </Card>

                {/* 4. Total Turnover Card */}
                <Card className="hover:translate-y-[-2px] transition-transform">
                    <div className="flex items-start justify-between">
                        <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
                            <Landmark className="w-6 h-6" />
                        </div>
                        <Badge variant="info">Maliyyə</Badge>
                    </div>
                    <div className="mt-5">
                        <p className="text-[12px] font-black text-slate-400 uppercase tracking-wider">Ümumi Gəlir Həcmi</p>
                        <h3 className="text-2xl font-black text-slate-800 mt-1">
                            {renderMetric(data.bookings.totalRevenue, ' ₼')}
                        </h3>
                    </div>
                    <div className="mt-4 flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                        <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>Tranzaksiya sayı: <strong>{data.payments.totalTransactions ?? 0}</strong></span>
                    </div>
                </Card>
            </div>

            {/* Analytics Graph & Module Overview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* SVG Revenue Chart */}
                <Card title="Son 7 Günlük Gəlir Trendi" className="lg:col-span-2 flex flex-col justify-between">
                    <div className="flex-1 w-full mt-4">
                        {trends.length === 0 ? (
                            <div className="h-44 flex items-center justify-center text-slate-400 text-sm">
                                Qrafik üçün data mövcud deyil.
                            </div>
                        ) : (
                            <div className="relative w-full overflow-x-auto">
                                <svg
                                    viewBox={`0 0 ${width} ${height}`}
                                    className="w-full h-auto min-w-[400px]"
                                    aria-label="Platform revenue chart"
                                >
                                    <defs>
                                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.18" />
                                            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                                        </linearGradient>
                                    </defs>

                                    {/* Grid Lines */}
                                    <line x1={paddingLeft} y1={paddingTop} x2={width - paddingRight} y2={paddingTop} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                                    <line x1={paddingLeft} y1={(height - paddingBottom - paddingTop) / 2 + paddingTop} x2={width - paddingRight} y2={(height - paddingBottom - paddingTop) / 2 + paddingTop} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                                    <line x1={paddingLeft} y1={height - paddingBottom} x2={width - paddingRight} y2={height - paddingBottom} stroke="#e2e8f0" strokeWidth="1" />

                                    {/* Grid Labels (Y Axis) */}
                                    <text x={paddingLeft - 8} y={paddingTop + 4} fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="end">{Math.round(maxAmount).toLocaleString('az-AZ')} ₼</text>
                                    <text x={paddingLeft - 8} y={(height - paddingBottom - paddingTop) / 2 + paddingTop + 4} fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="end">{Math.round(maxAmount / 2).toLocaleString('az-AZ')} ₼</text>
                                    <text x={paddingLeft - 8} y={height - paddingBottom + 4} fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="end">0 ₼</text>

                                    {/* Gradient Area Fill */}
                                    {areaPath && <path d={areaPath} fill="url(#chartGradient)" />}

                                    {/* SVG Line */}
                                    {linePath && <path d={linePath} fill="none" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}

                                    {/* Dot nodes & Labels (X Axis) */}
                                    {points.map((p, idx) => (
                                        <g key={idx}>
                                            <circle cx={p.x} cy={p.y} r="4" fill="#ffffff" stroke="#4f46e5" strokeWidth="2.5" />
                                            {/* Tooltip labels for points */}
                                            <text x={p.x} y={p.y - 8} fill="#334155" fontSize="9" fontWeight="bold" textAnchor="middle">{p.amount > 0 ? `${Math.round(p.amount)}₼` : ''}</text>
                                            {/* Date labels */}
                                            <text x={p.x} y={height - paddingBottom + 16} fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">{p.date}</text>
                                        </g>
                                    ))}
                                </svg>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Platforms Modules Status List */}
                <Card title="Modullar üzrə Vəziyyət" className="flex flex-col">
                    <div className="space-y-4 flex-1">
                        {/* 1. Nəqliyyat Modulu */}
                        <div className="flex items-center justify-between p-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-2xl transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
                                    <Car className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-slate-800">Nəqliyyat</h4>
                                    <p className="text-[10px] font-semibold text-slate-400">Sürücülər və yük maşınları</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-black text-slate-800">
                                    {data.transport.totalDrivers ?? 0} Sür. / {data.transport.totalVehicles ?? 0} Maş.
                                </p>
                            </div>
                        </div>

                        {/* 2. Promosiyalar */}
                        <div className="flex items-center justify-between p-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-2xl transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                                    <Percent className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-slate-800">Promosiyalar</h4>
                                    <p className="text-[10px] font-semibold text-slate-400">Kuponlar və kampaniyalar</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-black text-slate-800">
                                    {data.promotions.totalPromocodes ?? 0} Kup. / {data.promotions.totalPromotions ?? 0} Kamp.
                                </p>
                            </div>
                        </div>

                        {/* 3. Təhlükəsizlik və Risk */}
                        <div className="flex items-center justify-between p-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-2xl transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                                    <ShieldAlert className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-slate-800">Təhlükəsizlik (Fraud)</h4>
                                    <p className="text-[10px] font-semibold text-slate-400">Qara siyahı və risk loqları</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-black text-rose-600">
                                    {data.fraud.blacklistCount ?? 0} Qara s. / {data.fraud.highRiskLogsCount ?? 0} Risk
                                </p>
                            </div>
                        </div>

                        {/* 4. Rəy və Şikayətlər */}
                        <div className="flex items-center justify-between p-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-2xl transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-slate-800">Rəylər və Şikayətlər</h4>
                                    <p className="text-[10px] font-semibold text-slate-400">Moderasiya gözləyən şikayətlər</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-black text-slate-800">
                                    {data.interactions.totalReviews ?? 0} Rəy / <span className="text-amber-600">{data.interactions.pendingReports ?? 0} Şik.</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Bottom Section: Recent Activity / Pending Approvals */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Bookings Feed */}
                <Card title="Son Platforma Sifarişləri" className="lg:col-span-2">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="py-3 text-[11px] font-black text-slate-400 uppercase tracking-wider">Rezervasiya PNR</th>
                                    <th className="py-3 text-[11px] font-black text-slate-400 uppercase tracking-wider">İstifadəçi</th>
                                    <th className="py-3 text-[11px] font-black text-slate-400 uppercase tracking-wider">Tip</th>
                                    <th className="py-3 text-[11px] font-black text-slate-400 uppercase tracking-wider">Məbləğ</th>
                                    <th className="py-3 text-[11px] font-black text-slate-400 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.bookings.recent.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-slate-400 text-sm">
                                            Hələlik heç bir sifariş mövcud deyil.
                                        </td>
                                    </tr>
                                ) : (
                                    data.bookings.recent.map((b) => (
                                        <tr key={b.id} className="border-b border-slate-50/50 hover:bg-slate-50/20 transition-colors">
                                            <td className="py-3.5 text-sm font-bold text-slate-800">{b.bookingNumber}</td>
                                            <td className="py-3.5">
                                                <div className="text-xs font-bold text-slate-800">{b.user.firstName} {b.user.lastName}</div>
                                                <div className="text-[10px] text-slate-400 font-semibold">{b.user.email}</div>
                                            </td>
                                            <td className="py-3.5">
                                                <Badge variant={b.bookingType === 'hotel' ? 'success' : 'info'}>
                                                    {b.bookingType === 'hotel' ? 'Hotel' : 'Tur'}
                                                </Badge>
                                            </td>
                                            <td className="py-3.5 text-sm font-extrabold text-slate-800">
                                                {b.totalPrice.toLocaleString('az-AZ')} AZN
                                            </td>
                                            <td className="py-3.5">
                                                <Badge variant={b.status === 'confirmed' ? 'success' : b.status === 'cancelled' ? 'error' : 'warning'}>
                                                    {b.status === 'confirmed' ? 'Təsdiqlənib' : b.status === 'cancelled' ? 'Ləğv edilib' : 'Gözləyir'}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Pending approvals quick actions */}
                <Card
                    title="Son Təsdiq İstəkləri"
                    extra={
                        <Badge variant="warning" dot>
                            {data.businesses.pendingCount ?? 0} gözləyir
                        </Badge>
                    }
                    className="flex flex-col"
                >
                    <div className="space-y-5 flex-grow">
                        {data.businesses.pendingList.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-12">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-2">
                                    <Award className="text-slate-300 w-6 h-6" />
                                </div>
                                <p className="text-xs font-semibold text-slate-400">Təsdiq gözləyən yeni biznes mülkü yoxdur.</p>
                            </div>
                        ) : (
                            data.businesses.pendingList.map((item) => (
                                <div key={item.id} className="flex items-center gap-3.5 p-1">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                                        <Clock className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-[13px] font-black text-slate-800 truncate">{item.name}</h4>
                                        <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                                            {item.type} • {new Date(item.createdAt).toLocaleDateString('az-AZ')}
                                        </p>
                                    </div>
                                    <Badge variant="warning">Gözləyir</Badge>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Overview;
