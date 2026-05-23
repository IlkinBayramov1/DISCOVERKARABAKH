import { useState, useEffect, useMemo } from 'react';
import { transportVendorApi } from '../../api/transport.api';
import type { IRide, IShipment } from '../../types';
import {
    Package,
    Users,
    CheckCircle,
    XCircle,
    Car,
    Truck,
    Inbox,
    MapPin,
    Calendar,
    CreditCard,
    Search,
    RefreshCw,
    SearchX,
    Mail
} from 'lucide-react';
import TransportOrderDetails from '../../components/TransportOrderDetails/TransportOrderDetails';
import './VendorTransportOrdersPage.css';

export default function VendorTransportOrdersPage() {
    const [rides, setRides] = useState<IRide[]>([]);
    const [shipments, setShipments] = useState<IShipment[]>([]);
    const [activeTab, setActiveTab] = useState<'rides' | 'shipments'>('rides');
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

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

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            if (activeTab === 'rides') {
                await transportVendorApi.updateRideStatus(id, status);
            } else {
                await transportVendorApi.updateShipmentStatus(id, status);
            }
            setSelectedOrder(null);
            loadOrders();
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    const filteredOrders = useMemo(() => {
        const list = activeTab === 'rides' ? rides : (shipments as any[]);
        return list.filter(order => {
            const idMatch = (order.bookingNumber || order.id).toLowerCase().includes(searchTerm.toLowerCase());
            const emailMatch = (order.passenger?.email || order.sender?.email || '').toLowerCase().includes(searchTerm.toLowerCase());
            return idMatch || emailMatch;
        });
    }, [rides, shipments, activeTab, searchTerm]);

    const getStatusBadge = (status: string) => {
        const s = (status || 'pending').toLowerCase();
        switch (s) {
            case 'completed':
            case 'delivered':
                return <span className="dk-order-badge success"><CheckCircle size={14} /> {status}</span>;
            case 'cancelled':
            case 'failed':
                return <span className="dk-order-badge danger"><XCircle size={14} /> {status}</span>;
            case 'pending':
            case 'requested':
                return <span className="dk-order-badge warning">Pending</span>;
            default:
                return <span className="dk-order-badge info">{status}</span>;
        }
    };

    return (
        <div className="dk-transport-bookings-layout">
            <header className="dk-transport-bookings-header">
                <div>
                    <h1 className="dk-transport-bookings-title">Transport Protocols</h1>
                    <p className="dk-transport-bookings-subtitle">Track passenger transfers and cargo shipments across the fleet.</p>
                </div>
            </header>

            {/* SEGMENTED TABS */}
            <div className="dk-transport-bookings-toolbar">
                <div className="dk-transport-segmented-control">
                    <button
                        className={`segment-btn ${activeTab === 'rides' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('rides'); setSearchTerm(''); }}
                    >
                        <Users size={18} /> Passenger
                    </button>
                    <button
                        className={`segment-btn ${activeTab === 'shipments' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('shipments'); setSearchTerm(''); }}
                    >
                        <Package size={18} /> Cargo
                    </button>
                </div>

                <div className="dk-transport-search">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder={`Search ${activeTab === 'rides' ? 'Ride ID or Email' : 'Shipment ID or Email'}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <button className="dk-btn-refresh-transport" onClick={loadOrders} disabled={loading}>
                    <RefreshCw size={18} className={loading ? 'spin-icon' : ''} />
                </button>
            </div>

            <div className="dk-transport-content-card">
                {loading && filteredOrders.length === 0 ? (
                    <div className="dk-transport-loading">
                        <RefreshCw size={40} className="spin-icon" />
                        <p>Syncing Logistic Streams...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="dk-transport-empty">
                        <div className="empty-icon-circle">
                            {searchTerm ? <SearchX size={40} /> : <Inbox size={40} />}
                        </div>
                        <h3>{searchTerm ? 'No Protocols Found' : 'No Active Logs'}</h3>
                        <p>{searchTerm ? "Adjust your filter criteria." : `New ${activeTab} protocols will appear here.`}</p>
                    </div>
                ) : (
                    <div className="dk-transport-table-wrapper">
                        <table className="dk-transport-table">
                            <thead>
                                <tr>
                                    <th>Guest & Identification</th>
                                    <th>Service / Vehicle</th>
                                    <th>Schedule & Capacity</th>
                                    <th>Total Yield</th>
                                    <th>Status</th>
                                    <th className="text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order) => {
                                    const isRide = activeTab === 'rides';
                                    const user = isRide ? (order as IRide).passenger : (order as IShipment).sender;
                                    const email = user?.email || 'N/A';
                                    const bNo = order.bookingNumber || `#${order.id.substring(0, 8).toUpperCase()}`;
                                    const date = order.scheduledAt ? new Date(order.scheduledAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'ASAP';
                                    const time = order.scheduledAt ? new Date(order.scheduledAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '';

                                    const vehicleInfo = isRide
                                        ? `${(order as IRide).vehicle?.brand || 'Standard'} ${(order as IRide).vehicle?.model || 'Taxi'}`
                                        : `${(order as IShipment).weightKg} KG Cargo`;

                                    const route = `${order.pickupLocation?.address || 'Start'} → ${order.dropoffLocation?.address || 'End'}`;

                                    return (
                                        <tr key={order.id} onClick={() => setSelectedOrder(order)} className="clickable-row">
                                            <td>
                                                <div className="td-user-info">
                                                    <div className="user-avatar-small">{email[0]?.toUpperCase()}</div>
                                                    <div className="user-details-box">
                                                        <span className="protocol-id">{bNo}</span>
                                                        <span className="user-email">
                                                            <Mail size={12} /> {email}
                                                        </span>
                                                        <span className="guest-date" style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                                                            {order.createdAt ? new Date(order.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="td-transport-info">
                                                    <div className="vehicle-name">
                                                        {isRide ? <Car size={14} className="text-blue-500" /> : <Truck size={14} className="text-orange-500" />}
                                                        <span>{vehicleInfo}</span>
                                                    </div>
                                                    <div className="route-preview" title={route}>
                                                        <MapPin size={12} />
                                                        <span>{route}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="td-schedule-info">
                                                    <div className="date-box">
                                                        <Calendar size={14} />
                                                        <span>{date} {time && <span className="time-tag">{time}</span>}</span>
                                                    </div>
                                                    <div className="capacity-badge">
                                                        {isRide ? <Users size={12} /> : <Package size={12} />}
                                                        <span>{isRide ? `${(order as IRide).paxCount || 1} PAX` : `${(order as IShipment).weightKg} KG`}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="td-price-yield">
                                                    <CreditCard size={14} className="text-emerald-500" />
                                                    <span className="yield-amount">
                                                        {Number(order.price || 0).toLocaleString()} ₼
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                {getStatusBadge(order.status)}
                                            </td>
                                            <td className="text-right">
                                                <div className="td-actions">
                                                    <button
                                                        className="dk-btn-view"
                                                        onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                                                        title="Review Details"
                                                    >
                                                        Review
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {selectedOrder && (
                <TransportOrderDetails
                    order={selectedOrder}
                    activeTab={activeTab}
                    onClose={() => setSelectedOrder(null)}
                    onStatusUpdate={handleStatusUpdate}
                />
            )}
        </div>
    );
}