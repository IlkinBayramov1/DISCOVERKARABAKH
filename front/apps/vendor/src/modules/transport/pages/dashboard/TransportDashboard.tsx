import { useState, useEffect } from 'react';
import {
    Car,
    Users,
    TrendingUp,
    Package,
    Clock,
    ChevronRight,
    Search,
    Activity
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
                    driversOnline: drivers.filter((d: any) => d.status === 'Available' || d.status === 'OnTrip' || d.status === 'Approved').length,
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
        return (
            <div className="dk-vendor-page">
                <div className="dk-loading-state">
                    <div className="spinner"></div>
                    <p>Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dk-vendor-page">

            {/* PAGE HEADER */}
            <div className="dk-page-header">
                <div className="header-text">
                    <h1>Transport Dashboard</h1>
                    <p>Real-time overview of your fleet, drivers, and financial performance.</p>
                </div>
            </div>

            {/* STATS GRID */}
            <div className="dk-stats-grid">

                {/* Stat Card 1 */}
                <div className="dk-stat-card box-shadow">
                    <div className="stat-icon-wrapper primary">
                        <Package size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Total Orders</span>
                        <div className="stat-value-row">
                            <span className="stat-value">{stats.totalRides + stats.totalShipments}</span>
                        </div>
                    </div>
                </div>

                {/* Stat Card 2 */}
                <div className="dk-stat-card box-shadow">
                    <div className="stat-icon-wrapper success">
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Total Revenue</span>
                        <div className="stat-value-row">
                            <span className="currency">₼</span>
                            <span className="stat-value">{stats.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                    </div>
                </div>

                {/* Stat Card 3 */}
                <div className="dk-stat-card box-shadow">
                    <div className="stat-icon-wrapper info">
                        <Car size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Active Fleet</span>
                        <div className="stat-value-row">
                            <span className="stat-value">{stats.activeVehicles}</span>
                            <span className="stat-suffix">vehicles</span>
                        </div>
                    </div>
                </div>

                {/* Stat Card 4 */}
                <div className="dk-stat-card box-shadow">
                    <div className="stat-icon-wrapper warning">
                        <Users size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Drivers Ready</span>
                        <div className="stat-value-row">
                            <span className="stat-value">{stats.driversOnline}</span>
                            <div className="live-indicator">
                                <span className="pulse-dot"></span> Live
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="dashboard-main-grid">
                <div className="dk-dashboard-panel box-shadow">
                    <div className="panel-header">
                        <h2><Activity size={20} className="header-icon" /> Recent Operations</h2>
                        <button className="text-action-btn">View All</button>
                    </div>

                    <div className="recent-orders-list">
                        {recentOrders.length > 0 ? (
                            recentOrders.map((order: any) => {
                                const isCargo = !!order.weightKg;
                                return (
                                    <div key={order.id} className="recent-order-item">
                                        <div className={`order-type-indicator ${isCargo ? 'cargo' : 'passenger'}`}>
                                            {isCargo ? <Package size={18} /> : <Users size={18} />}
                                        </div>

                                        <div className="order-main-info">
                                            <div className="order-meta-top">
                                                <strong>{isCargo ? 'Cargo Shipment' : 'Passenger Transfer'}</strong>
                                                <span className="order-id-hash">#{order.id.slice(0, 8).toUpperCase()}</span>
                                            </div>
                                            <div className="order-route-mini">
                                                <span className="route-text truncate">{order.pickupLocation?.address || 'Origin'}</span>
                                                <ChevronRight size={14} className="route-arrow" />
                                                <span className="route-text truncate">{order.dropoffLocation?.address || 'Destination'}</span>
                                            </div>
                                        </div>

                                        <div className="order-status-col">
                                            <span className={`status-badge ${(order.status || 'pending').toLowerCase()}`}>
                                                {order.status || 'Pending'}
                                            </span>
                                            <span className="order-time-stamp">
                                                <Clock size={12} />
                                                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>

                                        <div className="order-price-col">
                                            <span className="currency">₼</span>
                                            <span className="amount">{order.price || '0.00'}</span>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="dk-empty-state mini">
                                <div className="empty-icon-wrapper small">
                                    <Search size={24} />
                                </div>
                                <h3>No Recent Activity</h3>
                                <p>There are no active orders in your system yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}