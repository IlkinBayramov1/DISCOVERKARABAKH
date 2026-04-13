import { useState, useEffect } from 'react';
import { transportDriverApi } from '../../transport/api/transport.web.api';
import { Package, Truck, User, MapPin, Calendar, Clock, ChevronRight } from 'lucide-react';

export default function DriverOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [driverType, setDriverType] = useState<'passenger' | 'cargo' | null>(null);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const profile = await transportDriverApi.getProfile();
            const isCargo = !!profile.currentCargoVehicleId;
            setDriverType(isCargo ? 'cargo' : 'passenger');

            if (isCargo) {
                const res = await transportDriverApi.getShipments();
                setOrders(res.data || []);
            } else {
                const res = await transportDriverApi.getRides();
                setOrders(res.data || []);
            }
        } catch (error) {
            console.error('Failed to load orders', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId: string, nextStatus: string) => {
        try {
            if (driverType === 'cargo') {
                await transportDriverApi.updateShipmentStatus(orderId, nextStatus);
            } else {
                await transportDriverApi.updateRideStatus(orderId, nextStatus);
            }
            // Refresh list
            fetchInitialData();
        } catch (error) {
            console.error('Status update failed', error);
            alert('Status yenilənməsi zamanı xəta baş verdi');
        }
    };

    if (loading) return <div className="p-8">Yüklənir...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Mənim Sifarişlərim</h1>
                <div className="badge bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {driverType === 'cargo' ? 'Yük Daşıma' : 'Sərnişin Daşıma'}
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="bg-white p-12 rounded-lg shadow-sm text-center border-2 border-dashed border-gray-200">
                    <Package className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-lg font-medium text-gray-900">Hələ ki, sifariş yoxdur</h3>
                    <p className="text-gray-500">Yeni sifarişlər gəldikdə burada görünəcək.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:border-primary/30 transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-50 rounded-lg">
                                        {driverType === 'cargo' ? <Truck size={24} className="text-primary" /> : <User size={24} className="text-primary" />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">
                                            {driverType === 'cargo' ? `Yük: ${order.cargoDescription || 'Məlumat yoxdur'}` : `Müştəri: ${order.passenger?.firstName || 'Adsız'} ${order.passenger?.lastName || ''}`}
                                        </h3>
                                        <div className="flex gap-4 text-sm text-gray-500 mt-1">
                                            <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(order.createdAt).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-1"><Clock size={14} /> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                    ['Completed', 'Delivered'].includes(order.status) ? 'bg-green-100 text-green-700' : 
                                    ['Cancelled', 'Failed'].includes(order.status) ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                    {order.status}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 py-4 border-y border-gray-50 my-2">
                                <div className="space-y-3">
                                    <div className="flex items-start gap-2">
                                        <MapPin size={18} className="text-green-500 mt-1 shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-bold">Götürmə nöqtəsi</p>
                                            <p className="text-sm">{order.pickupLocation?.address || 'Qeyd olunmayıb'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <MapPin size={18} className="text-red-500 mt-1 shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-bold">Təhvil nöqtəsi</p>
                                            <p className="text-sm">{order.dropoffLocation?.address || 'Qeyd olunmayıb'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg flex flex-col justify-center">
                                    <div className="flex justify-between items-center text-sm mb-2">
                                        <span className="text-gray-500">Məsafə:</span>
                                        <span className="font-bold">{order.distanceKm ? `${order.distanceKm} km` : '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-lg">
                                        <span className="text-gray-500 font-medium">Qiymət:</span>
                                        <span className="font-black text-primary">{order.price || order.pricing?.totalPrice || 0} AZN</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {order.status === 'DriverAssigned' && (
                                    <button 
                                        onClick={() => handleStatusUpdate(order.id, driverType === 'cargo' ? 'VehicleArrived' : 'DRIVER_ACCEPTED')}
                                        className="btn-primary flex-1 py-2 rounded-lg font-bold"
                                    >
                                        Qəbul Et / Çatdım
                                    </button>
                                )}
                                {['VehicleArrived', 'DRIVER_ACCEPTED'].includes(order.status) && (
                                    <button 
                                        onClick={() => handleStatusUpdate(order.id, driverType === 'cargo' ? 'PickedUp' : 'STARTED')}
                                        className="btn-primary flex-1 py-2 rounded-lg font-bold"
                                    >
                                        {driverType === 'cargo' ? 'Yükü Götürdüm' : 'Yola Düşdük'}
                                    </button>
                                )}
                                {['PickedUp', 'InTransit', 'STARTED'].includes(order.status) && (
                                    <button 
                                        onClick={() => handleStatusUpdate(order.id, driverType === 'cargo' ? 'AtDropoff' : 'COMPLETED')}
                                        className="btn-primary flex-1 py-2 rounded-lg font-bold"
                                    >
                                        {driverType === 'cargo' ? 'Təhvil nöqtəsinə çatdım' : 'Tamamla'}
                                    </button>
                                )}
                                {order.status === 'AtDropoff' && (
                                    <button 
                                        onClick={() => handleStatusUpdate(order.id, 'Delivered')}
                                        className="btn-primary flex-1 py-2 rounded-lg font-bold"
                                    >
                                        Təhvil Verdim
                                    </button>
                                )}
                                
                                <button className="btn-secondary px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">
                                    Detallar <ChevronRight size={16} className="inline ml-1" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
