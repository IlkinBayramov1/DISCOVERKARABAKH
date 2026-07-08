import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { 
    Download, Search, CreditCard, Wallet, Eye, X, RefreshCw, 
    ChevronLeft, ChevronRight, Building2, Users2, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { 
    useTransactions, 
    useTransactionDetails,
    useCompanyFinanceStats,
    useUserFinanceStats,
    useUserFinancialDetails
} from '../hooks/useFinanceControl';
import { financeAdminApi } from '../api/finance.admin.api';
import type { TransactionStatus } from '../types';

const PaymentList: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'transactions' | 'companies' | 'users'>('transactions');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | TransactionStatus>('all');
    const [providerFilter, setProviderFilter] = useState<'all' | 'wallet' | 'card'>('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    // Pagination state for Transactions
    const [page, setPage] = useState(1);

    // Details Modal State
    const [selectedTransId, setSelectedTransId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // User Financial Details Modal State
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [userModalTab, setUserModalTab] = useState<'wallet' | 'bookings'>('wallet');

    // Params for React Query
    const transactionParams = {
        page,
        limit: 10,
        status: statusFilter === 'all' ? undefined : statusFilter,
        provider: providerFilter === 'all' ? undefined : providerFilter,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        search: activeTab === 'transactions' ? searchQuery : undefined
    };

    const companyParams = {
        startDate: startDate || undefined,
        endDate: endDate || undefined
    };

    const userParams = {
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        search: activeTab === 'users' ? searchQuery : undefined
    };

    // Queries
    const { data: transRes, isLoading: isTransLoading, refetch: refetchTransactions } = useTransactions(transactionParams);
    const { data: detailRes, isLoading: isDetailLoading } = useTransactionDetails(selectedTransId || '');
    const { data: companyRes, isLoading: isCompanyLoading, refetch: refetchCompanies } = useCompanyFinanceStats(companyParams);
    const { data: userRes, isLoading: isUserLoading, refetch: refetchUsers } = useUserFinanceStats(userParams);
    const { data: userDetailRes, isLoading: isUserDetailLoading } = useUserFinancialDetails(selectedUserId || '');

    const transactions = transRes?.data || [];
    const companies = companyRes?.data || [];
    const users = userRes?.data || [];
    const userDetail = userDetailRes?.data;
    const pagination = transRes?.pagination;

    // Filter company lists on frontend if search matches
    const filteredCompanies = companies.filter(c => {
        if (activeTab !== 'companies' || !searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            c.name.toLowerCase().includes(q) ||
            c.type.toLowerCase().includes(q) ||
            (c.city && c.city.toLowerCase().includes(q)) ||
            (c.vendorEmail && c.vendorEmail.toLowerCase().includes(q))
        );
    });

    // Compute dynamic dashboard stats from Company Stats (non-paginated, represents entire range)
    const totalEarnings = companies.reduce((sum, c) => sum + c.grossTurnover, 0);
    const totalRefunds = companies.reduce((sum, c) => sum + c.totalRefunds, 0);
    const totalNetEarnings = companies.reduce((sum, c) => sum + c.netTurnover, 0);

    const getStatusBadgeVariant = (status: TransactionStatus) => {
        switch (status) {
            case 'completed': return 'success';
            case 'pending': return 'warning';
            case 'failed': return 'error';
            case 'refunded': return 'neutral';
        }
    };

    const getProviderIcon = (provider: string) => {
        if (provider.toLowerCase() === 'wallet') {
            return <Wallet className="w-4 h-4 text-indigo-500" />;
        }
        return <CreditCard className="w-4 h-4 text-amber-500" />;
    };

    const handleOpenDetails = (id: string) => {
        setSelectedTransId(id);
        setIsModalOpen(true);
    };

    const handleRefresh = () => {
        if (activeTab === 'transactions') refetchTransactions();
        if (activeTab === 'companies') refetchCompanies();
        if (activeTab === 'users') refetchUsers();
    };

    const handleExportExcel = async () => {
        try {
            if (activeTab === 'transactions') {
                // Fetch ALL matching transactions (pagination bypassed)
                const fullRes = await financeAdminApi.getTransactions({
                    ...transactionParams,
                    limit: 'all'
                });
                const allTrans = fullRes?.data || [];
                if (allTrans.length === 0) return;

                const headers = ['Transaction ID', 'Date', 'Booking Number', 'Amount', 'Provider', 'Provider ID', 'Status', 'Customer'];
                const rows = allTrans.map(t => [
                    t.id,
                    new Date(t.createdAt).toISOString().replace('T', ' ').substring(0, 19),
                    t.booking?.bookingNumber || 'N/A',
                    `${t.amount} ${t.currency}`,
                    t.provider,
                    t.providerTransId || 'N/A',
                    t.status,
                    t.booking?.user?.email || 'N/A'
                ]);

                downloadExcel(headers, rows, 'all_transactions');
            } else if (activeTab === 'companies') {
                if (filteredCompanies.length === 0) return;
                const headers = ['Company Name', 'Category', 'City', 'Vendor Email', 'Booking Count', 'Gross Turnover (AZN)', 'Refunds (AZN)', 'Net Income (AZN)'];
                const rows = filteredCompanies.map(c => [
                    c.name,
                    c.type.toUpperCase(),
                    c.city || 'N/A',
                    c.vendorEmail || 'N/A',
                    c.bookingsCount,
                    c.grossTurnover,
                    c.totalRefunds,
                    c.netTurnover
                ]);

                downloadExcel(headers, rows, 'company_turnover_report');
            } else if (activeTab === 'users') {
                if (users.length === 0) return;
                const headers = ['Full Name', 'Email', 'Role', 'Balance (AZN)', 'Card Spend (AZN)', 'Wallet Spend (AZN)', 'Total Spent (AZN)', 'Total Deposits (AZN)', 'Total Withdrawals (AZN)'];
                const rows = users.map(u => [
                    `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'N/A',
                    u.email,
                    u.role,
                    u.balance,
                    u.cardSpend,
                    u.walletSpend,
                    u.totalSpent,
                    u.totalDeposits,
                    u.totalWithdrawals
                ]);

                downloadExcel(headers, rows, 'user_financial_report');
            }
        } catch (error) {
            console.error('Error exporting Excel:', error);
        }
    };

    const downloadExcel = (headers: string[], rows: any[][], fileNamePrefix: string) => {
        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        
        // Auto-fit column widths dynamically based on longest text
        const colWidths = headers.map((header, colIndex) => {
            let maxLen = header.length;
            rows.forEach(row => {
                const val = String(row[colIndex] || '');
                if (val.length > maxLen) {
                    maxLen = val.length;
                }
            });
            // Add padding to ensure text fits comfortably (minimum 18 characters wide)
            return { wch: Math.max(maxLen + 4, 18) };
        });
        worksheet['!cols'] = colWidths;

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Financial Report');
        XLSX.writeFile(workbook, `${fileNamePrefix}_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2.5">
                        <CreditCard className="w-7 h-7 text-indigo-600" />
                        Maliyyə və Ödəniş Portalı
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Platformadakı tranzaksiyaları, şirkət dövriyyələrini və istifadəçi xərclərini analiz edin.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleRefresh} className="p-2.5">
                        <RefreshCw className="w-4 h-4 text-slate-500" />
                    </Button>
                    <Button onClick={handleExportExcel} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                        <Download className="w-4 h-4" />
                        Excel İxrac et
                 </Button>
                </div>
            </div>

            {/* Platform Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <Card className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white border-0 shadow-lg shadow-indigo-100/40 relative overflow-hidden">
                    <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10">
                        <ArrowUpRight className="w-40 h-40" />
                    </div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-200">Ümumi Dövriyyə (Gross)</h4>
                    <h3 className="text-3xl font-black mt-2">₼ {totalEarnings.toLocaleString('az-AZ', { minimumFractionDigits: 2 })}</h3>
                    <p className="text-indigo-200 text-xs mt-3 font-semibold">Seçilmiş dövrdəki bütün ödənişlərin cəmi</p>
                </Card>
                <Card className="bg-white border border-slate-200/60 shadow-sm relative overflow-hidden">
                    <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5 text-rose-600">
                        <ArrowDownRight className="w-40 h-40" />
                    </div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Cəmi Geri Qaytarılan (Refunds)</h4>
                    <h3 className="text-3xl font-black mt-2 text-rose-600">₼ {totalRefunds.toLocaleString('az-AZ', { minimumFractionDigits: 2 })}</h3>
                    <p className="text-rose-600 text-xs mt-3 font-semibold flex items-center gap-1">
                        Ləğv edilmiş və ödənişi qaytarılmış bronlar
                    </p>
                </Card>
                <Card className="bg-white border border-slate-200/60 shadow-sm relative overflow-hidden">
                    <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5 text-emerald-600">
                        <ArrowUpRight className="w-40 h-40" />
                    </div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Xalis Gəlir (Net Earnings)</h4>
                    <h3 className="text-3xl font-black mt-2 text-emerald-600">₼ {totalNetEarnings.toLocaleString('az-AZ', { minimumFractionDigits: 2 })}</h3>
                    <p className="text-slate-400 text-xs mt-3 font-semibold">Qazanılan xalis platforma və vendor gəliri</p>
                </Card>
            </div>

            {/* Custom Premium Tabs */}
            <div className="flex border-b border-slate-200 gap-1.5 p-1 bg-slate-100/80 rounded-xl w-fit">
                <button
                    onClick={() => { setActiveTab('transactions'); setSearchQuery(''); }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                        activeTab === 'transactions'
                            ? 'bg-white text-indigo-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-800'
                    }`}
                >
                    <CreditCard className="w-4 h-4" />
                    Tranzaksiya Girişləri
                </button>
                <button
                    onClick={() => { setActiveTab('companies'); setSearchQuery(''); }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                        activeTab === 'companies'
                            ? 'bg-white text-indigo-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-800'
                    }`}
                >
                    <Building2 className="w-4 h-4" />
                    Şirkət Dövriyyəsi
                </button>
                <button
                    onClick={() => { setActiveTab('users'); setSearchQuery(''); }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                        activeTab === 'users'
                            ? 'bg-white text-indigo-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-800'
                    }`}
                >
                    <Users2 className="w-4 h-4" />
                    İstifadəçi Balans və Xərcləri
                </button>
            </div>

            {/* Unified Search and Date Filters */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
                {/* Search */}
                <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder={
                            activeTab === 'transactions' 
                                ? "Bron №, email və ya tranzaksiya ID ilə axtar..." 
                                : activeTab === 'companies'
                                ? "Şirkət adı, kateqoriya, şəhər üzrə axtar..."
                                : "İstifadəçi adı, email üzrə axtar..."
                        }
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            if (activeTab === 'transactions') setPage(1);
                        }}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700 placeholder-slate-400 text-sm"
                    />
                </div>

                {/* Date range filters */}
                <div className="lg:col-span-2 flex flex-col sm:flex-row gap-3 items-center">
                    <div className="flex items-center gap-2 w-full">
                        <span className="text-xs font-bold text-slate-400 uppercase whitespace-nowrap">Başlanğıc:</span>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => {
                                setStartDate(e.target.value);
                                setPage(1);
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-semibold text-slate-700"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full">
                        <span className="text-xs font-bold text-slate-400 uppercase whitespace-nowrap">Yekun:</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => {
                                setEndDate(e.target.value);
                                setPage(1);
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-semibold text-slate-700"
                        />
                    </div>
                    {(startDate || endDate) && (
                        <button
                            onClick={() => { setStartDate(''); setEndDate(''); setPage(1); }}
                            className="text-xs font-bold text-rose-500 hover:text-rose-700 whitespace-nowrap"
                        >
                            Təmizlə
                        </button>
                    )}
                </div>
            </div>

            {/* Conditional Sub-Filters for Transactions Tab */}
            {activeTab === 'transactions' && (
                <div className="flex flex-wrap gap-4 items-center bg-slate-50 p-3.5 rounded-xl border border-slate-200/50">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase">Ödəniş Statusu:</span>
                        <div className="flex rounded-lg border border-slate-200 overflow-hidden bg-white p-0.5">
                            {(['all', 'completed', 'pending', 'failed', 'refunded'] as const).map(status => (
                                <button
                                    key={status}
                                    onClick={() => { setStatusFilter(status); setPage(1); }}
                                    className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all capitalize ${
                                        statusFilter === status
                                        ? 'bg-indigo-600 text-white shadow-sm'
                                        : 'text-slate-500 hover:text-slate-800'
                                    }`}
                                >
                                    {status === 'all' ? 'Hamısı' : status}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase">Provayder:</span>
                        <div className="flex rounded-lg border border-slate-200 overflow-hidden bg-white p-0.5">
                            {(['all', 'wallet', 'card'] as const).map(provider => (
                                <button
                                    key={provider}
                                    onClick={() => { setProviderFilter(provider); setPage(1); }}
                                    className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all capitalize ${
                                        providerFilter === provider
                                        ? 'bg-indigo-600 text-white shadow-sm'
                                        : 'text-slate-500 hover:text-slate-800'
                                    }`}
                                >
                                    {provider === 'all' ? 'Hər İki' : provider === 'wallet' ? 'Cüzdan' : 'Kart'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <Card noPadding>
                {/* 1. Transactions Tab */}
                {activeTab === 'transactions' && (
                    <>
                        {isTransLoading ? (
                            <div className="py-20 flex flex-col items-center justify-center text-slate-400 font-medium gap-3">
                                <RefreshCw className="animate-spin h-5 w-5 text-indigo-500" />
                                Tranzaksiyalar yüklənir...
                            </div>
                        ) : transactions.length === 0 ? (
                            <div className="py-20 text-center text-slate-400 font-medium">Tranzaksiya tapılmadı.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                            <th className="px-6 py-4">Tarix</th>
                                            <th className="px-6 py-4">İstifadəçi</th>
                                            <th className="px-6 py-4">Bron №</th>
                                            <th className="px-6 py-4">Provayder</th>
                                            <th className="px-6 py-4">Məbləğ</th>
                                            <th className="px-6 py-4">Provayder ID</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Detallar</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-sm">
                                        {transactions.map((t) => (
                                            <tr key={t.id} className="hover:bg-slate-50/30 transition-colors">
                                                <td className="px-6 py-4 text-slate-400 font-semibold">
                                                    {new Date(t.createdAt).toLocaleString('az-AZ')}
                                                </td>
                                                <td className="px-6 py-4 font-bold text-slate-700">
                                                    {t.booking?.user?.email || 'Naməlum Qonaq'}
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-indigo-600">
                                                    {t.booking?.bookingNumber || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-50 border border-slate-100 capitalize text-xs font-bold">
                                                        {getProviderIcon(t.provider)}
                                                        {t.provider}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-black text-slate-800">
                                                    ₼ {t.amount.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 font-mono text-slate-500 font-medium max-w-[120px] truncate" title={t.providerTransId}>
                                                    {t.providerTransId || '-'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant={getStatusBadgeVariant(t.status)} dot>
                                                        {t.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleOpenDetails(t.id)}
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Pagination Controls */}
                                {pagination && pagination.totalPages > 1 && (
                                    <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 border-t border-slate-100">
                                        <div className="text-xs text-slate-500 font-semibold">
                                            Toplam {pagination.total} tranzaksiyadan {Math.min((page - 1) * 10 + 1, pagination.total)}-{Math.min(page * 10, pagination.total)} aralığı göstərilir
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={page === 1}
                                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                                Geri
                                            </Button>
                                            <div className="flex items-center px-3 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg">
                                                Səhifə {page} / {pagination.totalPages}
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={page === pagination.totalPages}
                                                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                            >
                                                Növbəti
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}

                {/* 2. Companies Turnover Tab */}
                {activeTab === 'companies' && (
                    <>
                        {isCompanyLoading ? (
                            <div className="py-20 flex flex-col items-center justify-center text-slate-400 font-medium gap-3">
                                <RefreshCw className="animate-spin h-5 w-5 text-indigo-500" />
                                Dövriyyə hesabatları hazırlanır...
                            </div>
                        ) : filteredCompanies.length === 0 ? (
                            <div className="py-20 text-center text-slate-400 font-medium">Biznes tapılmadı.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                            <th className="px-6 py-4">Şirkət Adı</th>
                                            <th className="px-6 py-4">Kateqoriya</th>
                                            <th className="px-6 py-4">Şəhər</th>
                                            <th className="px-6 py-4">Sahibkar (Vendor)</th>
                                            <th className="px-6 py-4">Bron Sayı</th>
                                            <th className="px-6 py-4">Ümumi Dövriyyə</th>
                                            <th className="px-6 py-4">Geri Ödəniş (Refunds)</th>
                                            <th className="px-6 py-4">Xalis Gəlir</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-sm">
                                        {filteredCompanies.map((c) => (
                                            <tr key={`${c.type}_${c.entityId}`} className="hover:bg-slate-50/30 transition-colors">
                                                <td className="px-6 py-4 font-bold text-slate-800">
                                                    {c.name}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-600 border border-slate-200">
                                                        {c.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-500 font-medium">
                                                    {c.city || 'Qarabağ'}
                                                </td>
                                                <td className="px-6 py-4 text-slate-500 font-semibold">
                                                    {c.vendorEmail || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 font-bold text-slate-700">
                                                    {c.bookingsCount} bron
                                                </td>
                                                <td className="px-6 py-4 font-bold text-slate-800">
                                                    ₼ {c.grossTurnover.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-rose-500">
                                                    ₼ {c.totalRefunds.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 font-black text-emerald-600 bg-emerald-50/10">
                                                    ₼ {c.netTurnover.toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}

                {/* 3. Users Wallet & Spend Tab */}
                {activeTab === 'users' && (
                    <>
                        {isUserLoading ? (
                            <div className="py-20 flex flex-col items-center justify-center text-slate-400 font-medium gap-3">
                                <RefreshCw className="animate-spin h-5 w-5 text-indigo-500" />
                                İstifadəçi cüzdanları və hesabatları gətirilir...
                            </div>
                        ) : users.length === 0 ? (
                            <div className="py-20 text-center text-slate-400 font-medium">İstifadəçi tapılmadı.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                            <th className="px-6 py-4">İstifadəçi</th>
                                            <th className="px-6 py-4">Rol</th>
                                            <th className="px-6 py-4">Cüzdan Balansı</th>
                                            <th className="px-6 py-4">Kartla Xərc</th>
                                            <th className="px-6 py-4">Cüzdanla Xərc</th>
                                            <th className="px-6 py-4">Cəmi Xərc</th>
                                            <th className="px-6 py-4 text-emerald-600">Depozitlər</th>
                                            <th className="px-6 py-4 text-rose-600">Çıxarışlar</th>
                                            <th className="px-6 py-4">Əməliyyat</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-sm">
                                        {users.map((u) => (
                                            <tr key={u.id} className="hover:bg-slate-50/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-slate-800">
                                                        {u.firstName || u.lastName ? `${u.firstName || ''} ${u.lastName || ''}`.trim() : 'Naməlum Müştəri'}
                                                    </div>
                                                    <div className="text-xs text-slate-400 font-mono mt-0.5">{u.email}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                        u.role === 'admin' 
                                                            ? 'bg-rose-100 text-rose-700 border border-rose-200'
                                                            : u.role === 'vendor'
                                                            ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                                                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                                                    }`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-black text-indigo-600 bg-indigo-50/5">
                                                    ₼ {u.balance.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-slate-600">
                                                    ₼ {u.cardSpend.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-slate-600">
                                                    ₼ {u.walletSpend.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 font-black text-slate-800">
                                                    ₼ {u.totalSpent.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 font-bold text-emerald-600">
                                                    ₼ {u.totalDeposits.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 font-bold text-rose-500">
                                                    ₼ {u.totalWithdrawals.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        onClick={() => {
                                                            setSelectedUserId(u.id);
                                                            setIsUserModalOpen(true);
                                                        }}
                                                        className="gap-1.5 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border-indigo-100"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                        Details
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </Card>

            {/* Detail modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-250">
                    <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden animate-in scale-in duration-300">
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-bold text-slate-800">Tranzaksiya Detalları</h3>
                                <p className="text-xs text-slate-400 mt-0.5 font-semibold font-mono">ID: {selectedTransId}</p>
                            </div>
                            <button 
                                onClick={() => { setIsModalOpen(false); setSelectedTransId(null); }}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                            {isDetailLoading ? (
                                <div className="py-20 flex flex-col items-center justify-center text-slate-400 font-medium gap-3">
                                    <RefreshCw className="animate-spin h-5 w-5 text-indigo-500" />
                                    Məlumatlar yüklənir...
                                </div>
                            ) : !detailRes?.data ? (
                                <div className="py-20 text-center text-slate-400 font-medium">Tranzaksiya tapılmadı.</div>
                            ) : (
                                <>
                                    {/* Key Details Grid */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <div className="space-y-1">
                                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Məbləğ</span>
                                            <p className="text-lg font-black text-slate-800">₼ {detailRes.data.amount.toFixed(2)}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Metod / Provayder</span>
                                            <p className="text-sm font-bold text-slate-700 capitalize flex items-center gap-1.5 mt-1">
                                                {getProviderIcon(detailRes.data.provider)}
                                                {detailRes.data.provider}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</span>
                                            <div className="mt-0.5">
                                                <Badge variant={getStatusBadgeVariant(detailRes.data.status)} dot>
                                                    {detailRes.data.status}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="space-y-1 col-span-2">
                                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">İstifadəçi Email</span>
                                            <p className="text-sm font-bold text-slate-700">{detailRes.data.booking?.user?.email || 'N/A'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Bron №</span>
                                            <p className="text-sm font-bold text-indigo-600">{detailRes.data.booking?.bookingNumber || 'N/A'}</p>
                                        </div>
                                    </div>

                                    {/* Provider transaction details */}
                                    {detailRes.data.providerTransId && (
                                        <div className="space-y-1.5 p-4 bg-indigo-50/20 border border-indigo-100/50 rounded-xl">
                                            <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Provayder Tranzaksiya ID</span>
                                            <p className="text-sm font-bold font-mono text-indigo-700">{detailRes.data.providerTransId}</p>
                                        </div>
                                    )}

                                    {/* Raw JSON Context Metadata */}
                                    <div className="space-y-2">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ödəniş Gateway Texniki Metadata (Raw payload)</h4>
                                        <pre className="text-[11px] font-mono bg-slate-900 text-slate-200 p-4 rounded-xl max-h-60 overflow-y-auto leading-relaxed shadow-inner">
                                            {JSON.stringify(detailRes.data.meta || {}, null, 2)}
                                        </pre>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                            <Button onClick={() => { setIsModalOpen(false); setSelectedTransId(null); }} className="bg-slate-800 hover:bg-slate-900 text-white">
                                Bağla
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* User Financial Details Modal */}
            {isUserModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-250">
                    <div className="w-full max-w-4xl bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden animate-in scale-in duration-300 flex flex-col max-h-[85vh]">
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                                    <Wallet className="w-5 h-5 text-indigo-600" />
                                    İstifadəçi Maliyyə Detalları
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5 font-semibold">İstifadəçinin bütün cüzdan hərəkətləri və platforma xərcləri</p>
                            </div>
                            <button 
                                onClick={() => { setIsUserModalOpen(false); setSelectedUserId(null); }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-650 hover:bg-slate-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {isUserDetailLoading ? (
                                <div className="py-24 flex flex-col items-center justify-center text-slate-400 font-medium gap-3">
                                    <RefreshCw className="animate-spin h-6 w-6 text-indigo-500" />
                                    İstifadəçi tarixçəsi hazırlanır...
                                </div>
                            ) : !userDetail ? (
                                <div className="py-24 text-center text-slate-400 font-medium">Məlumat tapılmadı.</div>
                            ) : (
                                <>
                                    {/* Profile Summary Card */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-gradient-to-r from-slate-50 to-slate-100/50 border border-slate-150 p-5 rounded-2xl">
                                        <div className="md:col-span-2 flex items-start gap-4">
                                            <div className="w-14 h-14 rounded-full bg-indigo-550 text-white flex items-center justify-center font-black text-xl shrink-0">
                                                {userDetail.user.firstName?.[0] || userDetail.user.email?.[0]?.toUpperCase()}
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="text-base font-bold text-slate-800">
                                                    {userDetail.user.firstName || userDetail.user.lastName 
                                                        ? `${userDetail.user.firstName || ''} ${userDetail.user.lastName || ''}`.trim() 
                                                        : 'Naməlum Müştəri'}
                                                </h4>
                                                <p className="text-xs text-slate-500 font-medium font-mono">{userDetail.user.email}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                        userDetail.user.role === 'admin' 
                                                            ? 'bg-rose-100 text-rose-700'
                                                            : userDetail.user.role === 'vendor'
                                                            ? 'bg-amber-100 text-amber-700'
                                                            : 'bg-slate-100 text-slate-650'
                                                    }`}>
                                                        {userDetail.user.role}
                                                    </span>
                                                    <span className="text-[11px] text-slate-400 font-medium">
                                                        Qeydiyyat: {new Date(userDetail.user.createdAt).toLocaleDateString('en-US')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white p-4 rounded-xl shadow-md flex flex-col justify-between">
                                            <span className="text-[10px] font-bold text-indigo-100 uppercase tracking-wider">Cari Cüzdan Balansı</span>
                                            <div className="text-2xl font-black mt-1">₼ {userDetail.user.balance.toFixed(2)}</div>
                                        </div>
                                    </div>

                                    {/* Modal Tabs */}
                                    <div className="flex border-b border-slate-100">
                                        <button
                                            onClick={() => setUserModalTab('wallet')}
                                            className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
                                                userModalTab === 'wallet'
                                                    ? 'border-indigo-600 text-indigo-600'
                                                    : 'border-transparent text-slate-400 hover:text-slate-600'
                                            }`}
                                        >
                                            <Wallet className="w-4 h-4" />
                                            Cüzdan Əməliyyatları ({userDetail.walletTransactions?.length || 0})
                                        </button>
                                        <button
                                            onClick={() => setUserModalTab('bookings')}
                                            className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
                                                userModalTab === 'bookings'
                                                    ? 'border-indigo-600 text-indigo-600'
                                                    : 'border-transparent text-slate-400 hover:text-slate-600'
                                            }`}
                                        >
                                            <CreditCard className="w-4 h-4" />
                                            Rezervasiya və Xərclər ({userDetail.bookings?.length || 0})
                                        </button>
                                    </div>

                                    {/* Tab Contents */}
                                    <div className="min-h-[250px]">
                                        {userModalTab === 'wallet' ? (
                                            userDetail.walletTransactions?.length === 0 ? (
                                                <div className="py-12 text-center text-slate-400 font-semibold">Cüzdan əməliyyatı yoxdur.</div>
                                            ) : (
                                                <div className="overflow-x-auto border border-slate-100 rounded-xl">
                                                    <table className="w-full text-left border-collapse">
                                                        <thead>
                                                            <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                                <th className="px-5 py-3.5">Tarix</th>
                                                                <th className="px-5 py-3.5">Növ</th>
                                                                <th className="px-5 py-3.5">Məbləğ</th>
                                                                <th className="px-5 py-3.5">Təsvir</th>
                                                                <th className="px-5 py-3.5">Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-100 text-xs">
                                                            {userDetail.walletTransactions.map((tx) => (
                                                                <tr key={tx.id} className="hover:bg-slate-50/20 transition-colors">
                                                                    <td className="px-5 py-3.5 text-slate-500 font-semibold">
                                                                        {new Date(tx.createdAt).toLocaleString('en-US')}
                                                                    </td>
                                                                    <td className="px-5 py-3.5">
                                                                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                                                            tx.type === 'deposit' 
                                                                                ? 'bg-emerald-100 text-emerald-700'
                                                                                : tx.type === 'withdrawal'
                                                                                ? 'bg-rose-100 text-rose-700'
                                                                                : 'bg-indigo-100 text-indigo-700'
                                                                        }`}>
                                                                            {tx.type}
                                                                        </span>
                                                                    </td>
                                                                    <td className={`px-5 py-3.5 font-bold ${
                                                                        tx.type === 'deposit' ? 'text-emerald-600' : 'text-rose-500'
                                                                    }`}>
                                                                        {tx.type === 'deposit' ? '+' : '-'} ₼ {tx.amount.toFixed(2)}
                                                                    </td>
                                                                    <td className="px-5 py-3.5 text-slate-600 font-medium">
                                                                        {tx.description || 'Platform transaction'}
                                                                    </td>
                                                                    <td className="px-5 py-3.5">
                                                                        <span className="px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 bg-emerald-50 rounded">
                                                                            {tx.status}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )
                                        ) : (
                                            userDetail.bookings?.length === 0 ? (
                                                <div className="py-12 text-center text-slate-400 font-semibold">Rezervasiya tarixçəsi yoxdur.</div>
                                            ) : (
                                                <div className="overflow-x-auto border border-slate-100 rounded-xl">
                                                    <table className="w-full text-left border-collapse">
                                                        <thead>
                                                            <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                                <th className="px-5 py-3.5">Tarix</th>
                                                                <th className="px-5 py-3.5">Rezervasiya №</th>
                                                                <th className="px-5 py-3.5">Xidmət / Şirkət</th>
                                                                <th className="px-5 py-3.5">Kateqoriya</th>
                                                                <th className="px-5 py-3.5">Tarixlər</th>
                                                                <th className="px-5 py-3.5">Qiymət</th>
                                                                <th className="px-5 py-3.5">Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-100 text-xs">
                                                            {userDetail.bookings.map((b) => (
                                                                <tr key={b.id} className="hover:bg-slate-50/20 transition-colors">
                                                                    <td className="px-5 py-3.5 text-slate-500 font-semibold">
                                                                        {new Date(b.createdAt).toLocaleDateString('en-US')}
                                                                    </td>
                                                                    <td className="px-5 py-3.5 font-bold text-slate-800">
                                                                        {b.bookingNumber}
                                                                    </td>
                                                                    <td className="px-5 py-3.5 font-bold text-indigo-600">
                                                                        {b.businessName}
                                                                    </td>
                                                                    <td className="px-5 py-3.5">
                                                                        <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-100 text-slate-650">
                                                                            {b.bookingType}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-5 py-3.5 text-slate-500 font-semibold">
                                                                        {b.startDate 
                                                                            ? `${new Date(b.startDate).toLocaleDateString('en-US')} ${b.endDate ? '- ' + new Date(b.endDate).toLocaleDateString('en-US') : ''}` 
                                                                            : 'N/A'}
                                                                    </td>
                                                                    <td className="px-5 py-3.5 font-black text-slate-800">
                                                                        ₼ {b.totalPrice.toFixed(2)}
                                                                    </td>
                                                                    <td className="px-5 py-3.5">
                                                                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                                                            ['confirmed', 'checked_in', 'checked_out'].includes(b.status)
                                                                                ? 'bg-emerald-100 text-emerald-700'
                                                                                : b.status === 'cancelled'
                                                                                ? 'bg-rose-100 text-rose-700'
                                                                                : 'bg-slate-100 text-slate-600'
                                                                        }`}>
                                                                            {b.status}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                            <Button onClick={() => { setIsUserModalOpen(false); setSelectedUserId(null); }} className="bg-slate-800 hover:bg-slate-900 text-white font-bold">
                                Bağla
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentList;
