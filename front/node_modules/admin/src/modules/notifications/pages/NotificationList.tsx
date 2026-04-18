import React from 'react';
import { Send, BellOff } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

const NotificationList: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Bildirişlər</h1>
                    <p className="text-slate-500 font-medium mt-1">Sistem tərəfindən göndərilən bildirişləri və admin elanlarını buradan idarə edin.</p>
                </div>
                <Button className="gap-2">
                    <Send className="w-4 h-4" />
                    Yeni Elan Göndər
                </Button>
            </div>

            <Card className="min-h-[400px] flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                    <BellOff className="text-slate-300 w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Bildiriş Yoxdur</h3>
                <p className="text-slate-400 font-medium max-w-xs mt-1">Sistemdə hələlik hər hansı bir aktiv bildiriş və ya elan mövcud deyil.</p>
            </Card>
        </div>
    );
};

export default NotificationList;
