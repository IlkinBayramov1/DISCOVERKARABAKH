import { useState, useEffect } from 'react';
import { transportVendorApi } from '../api/transport.api';
import type { IRide, IShipment } from '../types';
import { Package, Users, CheckCircle, XCircle, Car, Truck, Inbox } from 'lucide-react';
import './VendorTransportOrdersPage.css';

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
            alert('Failed to update order status.');
        }
    };

    const handleShipmentStatus = async (id: string, status: string) => {
        try {
            await transportVendorApi.updateShipmentStatus(id, status);
            loadOrders();
        } catch (error) {
            console.error('Failed to update shipment status', error);
            alert('Failed to update order status.');
        }
    };

    const isListEmpty = activeTab === 'rides' ? rides.length === 0 : shipments.length === 0;

    return (
        <div className="dk-vendor-page">

            {/* PAGE HEADER */}
            <div className="dk-page-header">
                <div className="header-text">
                    <h1>Order Monitoring</h1>
                    <p>Track and manage your incoming passenger transfers and cargo shipments.</p>
                </div>
            </div>

            {/* SEGMENTED TABS */}
            <div className="dk-tabs-wrapper">
                <div className="dk-segmented-control">
                    <button
                        className={`segment-btn ${activeTab === 'rides' ? 'active' : ''}`}
                        onClick={() => setActiveTab('rides')}
                    >
                        <Users size={18} /> Passenger Transfers
                    </button>
                    <button
                        className={`segment-btn ${activeTab === 'shipments' ? 'active' : ''}`}
                        onClick={() => setActiveTab('shipments')}
                    >
                        <Package size={18} /> Cargo Shipments
                    </button>
                </div>
            </div>

            {/* CONTENT AREA */}
            {loading ? (
                <div className="dk-loading-state">
                    <div className="spinner"></div>
                    <p>Loading active orders...</p>
                </div>
            ) : isListEmpty ? (
                <div className="dk-empty-state">
                    <div className="empty-icon-wrapper">
                        <Inbox size={48} />
                    </div>
                    <h2>No Active Orders</h2>
                    <p>You currently have no {activeTab === 'rides' ? 'passenger transfers' : 'cargo shipments'} in your queue. New orders will appear here automatically.</p>
                </div>
            ) : (
                <div className="dk-orders-grid">
                    {activeTab === 'rides' ? (
                        rides.map(r => (
                            <div key={r.id} className="dk-order-card box-shadow">
                                <div className="order-header">
                                    <div className="order-id-box">
                                        <div className="order-icon passenger"><Car size={16} /></div>
                                        <span className="order-id">#{r.id.substring(0, 8).toUpperCase()}</span>
                                    </div>
                                    <span className={`status-badge ${(r.status || 'pending').toLowerCase()}`}>
                                        {r.status || 'Pending'}
                                    </span>
                                </div>

                                <div className="order-route-timeline">
                                    <div className="route-point">
                                        <div className="point-dot origin"></div>
                                        <div className="point-info">
                                            <span className="point-label">Pickup Location</span>
                                            <span className="point-address">{r.pickupLocation?.address || 'Unknown Location'}</span>
                                        </div>
                                    </div>
                                    <div className="route-line"></div>
                                    <div className="route-point">
                                        <div className="point-dot destination"></div>
                                        <div className="point-info">
                                            <span className="point-label">Drop-off Destination</span>
                                            <span className="point-address">{r.dropoffLocation?.address || 'Unknown Location'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="order-footer">
                                    <div className="order-price-box">
                                        <span className="price-label">Estimated Payout</span>
                                        <div className="price-value">
                                            <span className="currency">₼</span>
                                            <span className="amount">{r.price || '0.00'}</span>
                                        </div>
                                    </div>

                                    {(r.status !== 'Completed' && r.status !== 'Cancelled') && (
                                        <div className="order-actions">
                                            <button
                                                className="dk-btn-success-small"
                                                onClick={() => handleRideStatus(r.id, 'Completed')}
                                                title="Mark as Completed"
                                            >
                                                <CheckCircle size={16} /> Complete
                                            </button>
                                            <button
                                                className="dk-btn-danger-outline"
                                                onClick={() => handleRideStatus(r.id, 'Cancelled')}
                                                title="Cancel Order"
                                            >
                                                <XCircle size={16} /> Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        shipments.map(s => (
                            <div key={s.id} className="dk-order-card box-shadow">
                                <div className="order-header">
                                    <div className="order-id-box">
                                        <div className="order-icon cargo"><Truck size={16} /></div>
                                        <span className="order-id">#{s.id.substring(0, 8).toUpperCase()}</span>
                                    </div>
                                    <span className={`status-badge ${(s.status || 'pending').toLowerCase()}`}>
                                        {s.status || 'Pending'}
                                    </span>
                                </div>

                                <div className="cargo-meta-bar">
                                    <div className="cargo-meta-item">
                                        <Package size={14} />
                                        <span>Weight: <strong>{s.weightKg || 0} kg</strong></span>
                                    </div>
                                </div>

                                <div className="order-route-timeline">
                                    <div className="route-point">
                                        <div className="point-dot origin"></div>
                                        <div className="point-info">
                                            <span className="point-label">Origin (Pickup)</span>
                                            <span className="point-address">{s.pickupLocation?.address || 'Unknown Location'}</span>
                                        </div>
                                    </div>
                                    <div className="route-line"></div>
                                    <div className="route-point">
                                        <div className="point-dot destination"></div>
                                        <div className="point-info">
                                            <span className="point-label">Destination (Drop-off)</span>
                                            <span className="point-address">{s.dropoffLocation?.address || 'Unknown Location'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="order-footer">
                                    <div className="order-price-box">
                                        <span className="price-label">Cargo Payout</span>
                                        <div className="price-value">
                                            <span className="currency">₼</span>
                                            <span className="amount">{s.price || '0.00'}</span>
                                        </div>
                                    </div>

                                    {(s.status !== 'Completed' && s.status !== 'Cancelled') && (
                                        <div className="order-actions">
                                            <button
                                                className="dk-btn-success-small"
                                                onClick={() => handleShipmentStatus(s.id, 'Completed')}
                                                title="Mark as Delivered"
                                            >
                                                <CheckCircle size={16} /> Delivered
                                            </button>
                                            <button
                                                className="dk-btn-danger-outline"
                                                onClick={() => handleShipmentStatus(s.id, 'Cancelled')}
                                                title="Cancel Shipment"
                                            >
                                                <XCircle size={16} /> Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}