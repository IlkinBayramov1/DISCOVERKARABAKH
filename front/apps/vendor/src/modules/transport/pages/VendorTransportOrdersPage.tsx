import { useState, useEffect } from 'react';
import { transportVendorApi } from '../api/transport.api';
import type { IRide, IShipment } from '../types';
import { Map, Package, Users, CheckCircle, XCircle } from 'lucide-react';
import './VendorTransport.css';

export default function VendorTransportOrdersPage() {
    const [rides, setRides] = useState<IRide[]>([]);
    const [shipments, setShipments] = useState<IShipment[]>([]);
    const [activeTab, setActiveTab] = useState<'rides' | 'shipments'>('rides');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadOrders();
    }, [activeTab]);

    const loadOrders = async () => {
        setLoading(true);
        try {
            if (activeTab === 'rides') {
                const res = await transportVendorApi.getRides() as any;
                if (res.success) setRides(res.data);
                else if (Array.isArray(res)) setRides(res);
            } else {
                const res = await transportVendorApi.getShipments() as any;
                if (res.success) setShipments(res.data);
                else if (Array.isArray(res)) setShipments(res);
            }
        } catch (error) {
            console.error('Failed to load orders', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRideStatus = async (id: string, status: string) => {
        try {
            await transportVendorApi.updateRideStatus(id, status);
            loadOrders();
        } catch (error) {
            console.error('Failed to update ride status', error);
            alert('Status yenilənməsi alınmadı.');
        }
    };

    const handleShipmentStatus = async (id: string, status: string) => {
        try {
            await transportVendorApi.updateShipmentStatus(id, status);
            loadOrders();
        } catch (error) {
            console.error('Failed to update shipment status', error);
            alert('Status yenilənməsi alınmadı.');
        }
    };

    return (
        <div className="vendor-page-container">
            <div className="page-header mb-6">
                <h1>Sifarişlərin İzlənməsi (Orders)</h1>
                <p className="text-muted">Gələn Sərnişin və Yük (Cargo) sifarişlərinin monitorinqi.</p>
            </div>

            <div className="tabs-container my-4">
                <button
                    className={`tab-button ${activeTab === 'rides' ? 'active' : ''}`}
                    onClick={() => setActiveTab('rides')}
                >
                    <Users size={16} /> Sərnişin Transferləri
                </button>
                <button
                    className={`tab-button ${activeTab === 'shipments' ? 'active' : ''}`}
                    onClick={() => setActiveTab('shipments')}
                >
                    <Package size={16} /> Karqo Daşımaları
                </button>
            </div>

            {loading ? (
                <div className="flex-align-center gap-2"><span className="spinner"></span> Yüklənir...</div>
            ) : (
                <div className="grid-cards">
                    {activeTab === 'rides' ? (
                        rides.map(r => (
                            <div key={r.id} className="pricing-card glassmorphism">
                                <div className="flex-between mb-3 border-b border-gray-100 pb-2">
                                    <span className="font-bold">Ride #{r.id.substring(0, 6)}</span>
                                    <span className={`status-badge ${r.status ? r.status.toLowerCase() : 'pending'}`}>{r.status || 'Pending'}</span>
                                </div>
                                <div className="price-details text-sm">
                                    <div className="flex gap-2 text-muted mb-2">
                                        <Map size={14} className="mt-1" />
                                        <span>Başlanğıc: {r.pickupLocation?.address || 'Bilinmir'}</span>
                                    </div>
                                    <div className="flex gap-2 text-muted mb-2">
                                        <Map size={14} className="mt-1 text-primary" />
                                        <span>Son Təyinat: {r.dropoffLocation?.address || 'Bilinmir'}</span>
                                    </div>
                                    <div className="price-row mt-4 pt-3 border-t border-gray-100 mb-4">
                                        <span>Məbləğ:</span> <strong className="text-primary">{r.price || 0} AZN</strong>
                                    </div>

                                    {(r.status !== 'Completed' && r.status !== 'Cancelled') && (
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                className="btn-primary w-full flex-align-center justify-center gap-1 py-1"
                                                onClick={() => handleRideStatus(r.id, 'Completed')}
                                            >
                                                <CheckCircle size={14} /> Tamamlandı
                                            </button>
                                            <button
                                                className="btn-secondary w-full flex-align-center justify-center gap-1 py-1"
                                                style={{ color: '#ef4444', borderColor: '#ef4444' }}
                                                onClick={() => handleRideStatus(r.id, 'Cancelled')}
                                            >
                                                <XCircle size={14} /> Ləğv Et
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        shipments.map(s => (
                            <div key={s.id} className="pricing-card glassmorphism">
                                <div className="flex-between mb-3 border-b border-gray-100 pb-2">
                                    <span className="font-bold">Karqo #{s.id.substring(0, 6)}</span>
                                    <span className={`status-badge ${s.status ? s.status.toLowerCase() : 'pending'}`}>{s.status || 'Pending'}</span>
                                </div>
                                <div className="price-details text-sm">
                                    <div className="flex gap-2 text-muted mb-2">
                                        <Package size={14} className="mt-1" />
                                        <span>Yük Çəkisi: {s.weightKg || 0} Kq</span>
                                    </div>
                                    <div className="flex gap-2 text-muted mb-2">
                                        <Map size={14} className="mt-1 text-primary" />
                                        <span>Təhvil Alma: {s.pickupLocation?.address || 'Bilinmir'}</span>
                                    </div>
                                    <div className="flex gap-2 text-muted mb-2">
                                        <Map size={14} className="mt-1 text-primary" />
                                        <span>Təhvil Vermə: {s.dropoffLocation?.address || 'Bilinmir'}</span>
                                    </div>
                                    <div className="price-row mt-4 pt-3 border-t border-gray-100 mb-4">
                                        <span>Məbləğ:</span> <strong className="text-primary">{s.price || 0} AZN</strong>
                                    </div>

                                    {(s.status !== 'Completed' && s.status !== 'Cancelled') && (
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                className="btn-primary w-full flex-align-center justify-center gap-1 py-1"
                                                onClick={() => handleShipmentStatus(s.id, 'Completed')}
                                            >
                                                <CheckCircle size={14} /> Tamamlandı
                                            </button>
                                            <button
                                                className="btn-secondary w-full flex-align-center justify-center gap-1 py-1"
                                                style={{ color: '#ef4444', borderColor: '#ef4444' }}
                                                onClick={() => handleShipmentStatus(s.id, 'Cancelled')}
                                            >
                                                <XCircle size={14} /> Ləğv Et
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}

                    {(activeTab === 'rides' ? rides : shipments).length === 0 && (
                        <div className="empty-state p-6 text-center text-muted" style={{ gridColumn: '1 / -1' }}>
                            Hələlik heç bir sifariş yoxdur.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
