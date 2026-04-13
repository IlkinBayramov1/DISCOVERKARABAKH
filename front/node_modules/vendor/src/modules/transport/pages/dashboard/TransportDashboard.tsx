import { useState, useEffect } from 'react';
import {
    Car,
    Users,
    TrendingUp,
    MapPin,
    Package,
    Clock,
    ChevronRight,
    Search
} from 'lucide-react';
import { transportVendorApi } from '../../api/transport.api';
import type { IRide, IShipment } from '../../types';
import './TransportDashboard.css';

export default function TransportDashboard() {
    const [stats, setStats] = useState({
        totalRides: 0,
        activeVehicles: 0,
        driversOnline: 0,
        revenue: 0,
        totalShipments: 0
    });
    const [recentOrders, setRecentOrders] = useState<(IRide | IShipment)[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const [ridesRes, shipmentsRes, vehiclesRes, driversRes] = await Promise.all([
                    transportVendorApi.getRides(),
                    transportVendorApi.getShipments(),
                    transportVendorApi.getVehicles(),
                    transportVendorApi.getDrivers()
                ]) as any[];

                const rides = ridesRes.success ? ridesRes.data : [];
                const shipments = shipmentsRes.success ? shipmentsRes.data : [];
                const vehicles = vehiclesRes.success ? vehiclesRes.data : [];
                const drivers = driversRes.success ? driversRes.data : [];

                setStats({
                    totalRides: rides.length,
                    totalShipments: shipments.length,
                    activeVehicles: vehicles.filter((v: any) => v.status === 'Active').length,
                    driversOnline: drivers.filter((d: any) => d.status === 'Available' || d.status === 'OnTrip').length,
                    revenue: rides.reduce((acc: number, r: any) => acc + (r.price || 0), 0) +
                        shipments.reduce((acc: number, s: any) => acc + (s.price || 0), 0)
                });

                const combined = [...rides, ...shipments]
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 5);

                setRecentOrders(combined);
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return <div className="loading-container">Yüklənir...</div>;
    }

    return (
        <div className="transport-dashboard">
            <div className="dash-header">
                <div>
                    <h1>Nəqliyyat Paneli</h1>
                    <p>Donanma və daşımalarınızın ümumi vəziyyəti</p>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card glassmorphism">
                    <div className="stat-icon rides"><Car size={24} /></div>
                    <div className="stat-info">
                        <span className="label">Ümumi Sifarişlər</span>
                        <div className="value-row">
                            <span className="value">{stats.totalRides + stats.totalShipments}</span>
                        </div>
                    </div>
                </div>

                <div className="stat-card glassmorphism">
                    <div className="stat-icon revenue"><TrendingUp size={24} /></div>
                    <div className="stat-info">
                        <span className="label">Ümumi Gəlir</span>
                        <div className="value-row">
                            <span className="value">{stats.revenue} ₼</span>
                        </div>
                    </div>
                </div>

                <div className="stat-card glassmorphism">
                    <div className="stat-icon fleet"><Car size={24} /></div>
                    <div className="stat-info">
                        <span className="label">Aktiv Vasitələr</span>
                        <div className="value-row">
                            <span className="value">{stats.activeVehicles}</span>
                        </div>
                    </div>
                </div>

                <div className="stat-card glassmorphism">
                    <div className="stat-icon drivers"><Users size={24} /></div>
                    <div className="stat-info">
                        <span className="label">Onlayn Sürücülər</span>
                        <div className="value-row">
                            <span className="value">{stats.driversOnline}</span>
                            <span className="status-dot online"></span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-main-content">
                <div className="recent-orders-section glassmorphism">
                    <div className="section-header">
                        <h2>Son Sifarişlər</h2>
                    </div>
                    <div className="orders-list">
                        {recentOrders.length > 0 ? (
                            recentOrders.map((order: any) => (
                                <div key={order.id} className="order-item">
                                    <div className={`order-type-icon ${order.weightKg ? 'cargo' : 'passenger'}`}>
                                        {order.weightKg ? <Package size={18} /> : <Users size={18} />}
                                    </div>
                                    <div className="order-details">
                                        <div className="order-main">
                                            <strong>{order.weightKg ? 'Karqo Daşıma' : 'Sərnişin Transfer'}</strong>
                                            <span className="order-id">#{order.id.slice(0, 8)}</span>
                                        </div>
                                        <div className="order-locations">
                                            <MapPin size={12} /> {order.pickupLocation?.address}
                                            <ChevronRight size={12} />
                                            {order.dropoffLocation?.address}
                                        </div>
                                    </div>
                                    <div className="order-meta">
                                        <span className={`status-pill ${order.status.toLowerCase()}`}>
                                            {order.status}
                                        </span>
                                        <span className="order-time">
                                            <Clock size={12} /> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-data">Hələlik sifariş yoxdur.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
