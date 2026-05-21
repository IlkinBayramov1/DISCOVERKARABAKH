import React from 'react';
import { 
    Users, UserCheck, Briefcase, TrendingUp, 
    ArrowUpRight, ArrowDownRight, Clock 
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const Overview: React.FC = () => {
    const stats = [
        { label: 'Ümumi İstifadəçilər', value: '1,284', grow: '+12%', isUp: true, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Aktiv Satıcılar', value: '156', grow: '+5%', isUp: true, icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Gözləyən Bizneslər', value: '12', grow: '-2%', isUp: false, icon: Briefcase, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Aylıq Dövriyyə', value: '₼ 42,450', grow: '+18%', isUp: true, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">Xoş gəlmisiniz, Super Admin! 👋</h1>
                <p className="text-slate-500 font-medium mt-1">Bu gün platformada nələr baş verir, hamısı buradadır.</p>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <Card key={idx} className="hover:translate-y-[-4px]">
                        <div className="flex items-start justify-between">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <Badge variant={stat.isUp ? 'success' : 'error'} dot>
                                {stat.grow}
                            </Badge>
                        </div>
                        <div className="mt-5">
                            <p className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                            <h3 className="text-2xl font-black text-slate-800 mt-1">{stat.value}</h3>
                        </div>
                        <div className="mt-4 flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                            {stat.isUp ? <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" /> : <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" />}
                            <span>Keçən aydan bəri</span>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Bottom Section: Recent Activity / Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card title="Aktivlik Qrafiki" className="lg:col-span-2 min-h-[400px] flex flex-col">
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                             <TrendingUp className="text-slate-300 w-8 h-8" />
                        </div>
                        <p className="text-slate-400 font-medium max-w-[280px]">Qrafik datası yüklənir və ya hələlik aktiv bir məlumat yoxdur.</p>
                    </div>
                </Card>

                <Card 
                    title="Son Təsdiqlər" 
                    extra={<button className="text-[12px] font-bold text-indigo-600 hover:text-indigo-700">Hamısını gör</button>}
                    className="flex flex-col"
                >
                    <div className="space-y-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                                    <Clock className="w-5 h-5 text-slate-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-[13.5px] font-bold text-slate-800 truncate">Qarabağ Hoteli</h4>
                                    <p className="text-[11px] font-medium text-slate-400">Yeni mülk təsdiq gözləyir</p>
                                </div>
                                <Badge variant="warning">Gözləyir</Badge>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Overview;
