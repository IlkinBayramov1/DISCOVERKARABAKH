import React from 'react';
import { Download } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

const PaymentList: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Ödənişlər</h1>
                    <p className="text-slate-500 font-medium mt-1">Platformadakı maliyyə tranzaksiyalarını və ödəniş tarixçəsini idarə edin.</p>
                </div>
                <Button variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Hesabatı Yüklə
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card title="Ümumi Qazanc" className="bg-indigo-600 text-white">
                    <h3 className="text-3xl font-black">₼ 0.00</h3>
                    <p className="text-indigo-200 text-xs mt-2 font-medium">Bu ay üçün ümumi gəlir</p>
                </Card>
                <Card title="Gözləyən Ödənişlər">
                    <h3 className="text-3xl font-black text-slate-800">0</h3>
                    <p className="text-slate-400 text-xs mt-2 font-medium">Satıcılara köçürülməli olan məbləğ</p>
                </Card>
                <Card title="Ləğv Edilmişlər">
                    <h3 className="text-3xl font-black text-slate-800">0</h3>
                    <p className="text-slate-400 text-xs mt-2 font-medium">Geri qaytarılan vəsaitlər</p>
                </Card>
            </div>

            <Card className="min-h-[300px] flex items-center justify-center border-dashed border-2">
                <p className="text-slate-400 font-medium">Tranzaksiya siyahısı hələlik boşdur.</p>
            </Card>
        </div>
    );
};

export default PaymentList;
