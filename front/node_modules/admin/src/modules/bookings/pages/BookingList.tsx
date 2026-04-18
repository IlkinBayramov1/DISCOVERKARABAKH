import React from 'react';
import { Layers, Calendar } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

const BookingList: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Rezervasiyalar</h1>
                    <p className="text-slate-500 font-medium mt-1">Platformadakı bütün sifarişləri və rezervasiya statuslarını izləyin.</p>
                </div>
                <Button variant="outline" className="gap-2">
                    <Calendar className="w-4 h-4" />
                    Təqvim Görünüşü
                </Button>
            </div>

            <Card className="min-h-[400px] flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                    <Layers className="text-slate-300 w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Məlumat Tapılmadı</h3>
                <p className="text-slate-400 font-medium max-w-xs mt-1">Sifarişləri görmək üçün filtrləri dəyişə və ya bazanın qoşulmasını gözləyə bilərsiniz.</p>
                <Button className="mt-6" variant="secondary">Filtrləri Sıfırla</Button>
            </Card>
        </div>
    );
};

export default BookingList;
