import React from 'react';
import { Truck, MapPin, Plus, List } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

const TransportManagement: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Nəqliyyat İdarəetməsi</h1>
                    <p className="text-slate-500 font-medium mt-1">Nəqliyyat vasitələri, marşrutlar və daşıyıcıları buradan idarə edin.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2">
                        <MapPin className="w-4 h-4" />
                        Xəritə
                    </Button>
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Yeni Vasitə
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Yük Daşıma" description="Aktiv yük daşıma sorğuları">
                    <div className="h-40 flex items-center justify-center text-slate-300">
                        <Truck className="w-12 h-12 opacity-20" />
                    </div>
                </Card>
                <Card title="Sərnişin Daşıma" description="Aktiv sərnişin marşrutları">
                    <div className="h-40 flex items-center justify-center text-slate-300">
                        <List className="w-12 h-12 opacity-20" />
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default TransportManagement;
