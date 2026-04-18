import React from 'react';
import { Star, ShieldAlert } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

const ModerationList: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Moderasiya</h1>
                    <p className="text-slate-500 font-medium mt-1">İstifadəçi rəyləri, şikayətlər və məzmun keyfiyyətini buradan yoxlayın.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card title="Son Rəylər" extra={<Badge variant="info">5 Yeni</Badge>}>
                    <div className="flex flex-col items-center justify-center py-12 text-slate-300">
                        <Star className="w-12 h-12 opacity-20 mb-3" />
                        <p className="text-slate-400 font-medium">Yeni rəy yoxdur.</p>
                    </div>
                </Card>
                <Card title="Şikayətlər" extra={<Badge variant="error" dot>0 Aktiv</Badge>}>
                    <div className="flex flex-col items-center justify-center py-12 text-slate-300">
                        <ShieldAlert className="w-12 h-12 opacity-20 mb-3" />
                        <p className="text-slate-400 font-medium">Aktiv şikayət yoxdur.</p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ModerationList;
