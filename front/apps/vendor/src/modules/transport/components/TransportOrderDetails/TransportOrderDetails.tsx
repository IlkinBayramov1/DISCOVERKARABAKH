import { useEffect } from 'react';
import { 
    X, User, Phone, Mail, Calendar, CreditCard, 
    Clock, FileText, CheckCircle, Users, Car, Truck, Navigation, Package
} from 'lucide-react';
import './TransportOrderDetails.css'; 

interface Props {
    order: any;
    activeTab: 'rides' | 'shipments';
    onClose: () => void;
    onStatusUpdate: (id: string, status: string) => void;
}

export default function TransportOrderDetails({ order, activeTab, onClose, onStatusUpdate }: Props) {
    const isRide = activeTab === 'rides';
    const user = isRide ? order.passenger : order.sender;
    const email = user?.email || 'N/A';
    const bNo = order.bookingNumber || `#${order.id.substring(0, 8).toUpperCase()}`;
    const date = order.scheduledAt ? new Date(order.scheduledAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'ASAP';
    const time = order.scheduledAt ? new Date(order.scheduledAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '';
    
    const vehicleInfo = isRide 
        ? `${order.vehicle?.brand || 'Standard'} ${order.vehicle?.model || 'Taxi'}`
        : `${order.weightKg} KG Cargo`;
    

    // Scroll Lock
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);

    const getStatusText = (status: string) => {
        const s = (status || 'pending').toLowerCase();
        if (s === 'completed' || s === 'delivered') return 'Successfully Fulfilled';
        if (s === 'cancelled' || s === 'failed') return 'Service Voided';
        return 'Active Log - Action May Be Required';
    };

    return (
        <div className="dk-transport-modal-overlay" onClick={onClose}>
            <div className="dk-transport-modal-container" onClick={e => e.stopPropagation()}>
                
                <div className="dk-transport-modal-header">
                    <div className="dk-transport-modal-title-group">
                        <div className="dk-transport-modal-icon-badge">
                            {isRide ? <Car size={20} /> : <Truck size={20} />}
                        </div>
                        <div>
                            <h2>Logistics Intelligence</h2>
                            <p>Protocol ID: <strong className="text-slate-700">{bNo}</strong></p>
                            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                                Created: {order.createdAt ? new Date(order.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                            </p>
                        </div>
                    </div>
                    <button className="dk-transport-modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className={`dk-transport-status-banner ${order.status?.toLowerCase()}`}>
                    <div className="status-icon-wrap">
                        {(order.status === 'Completed' || order.status === 'Delivered') ? <CheckCircle size={20} /> : 
                         order.status === 'Cancelled' ? <X size={20} /> : <Clock size={20} />}
                    </div>
                    <div className="status-text-wrap">
                        <span className="status-title">Protocol Status: {order.status?.toUpperCase()}</span>
                        <span className="status-subtitle">{getStatusText(order.status)}</span>
                    </div>
                </div>

                <div className="dk-transport-modal-body">
                    
                    <div className="dk-transport-modal-card">
                        <h4 className="dk-transport-card-heading"><User size={16} /> Client Profile</h4>
                        <div className="dk-client-profile-box">
                            <div className="client-avatar-large">
                                {email[0]?.toUpperCase()}
                            </div>
                            <div className="client-primary-info">
                                <h3>{user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Verified Client'}</h3>
                                <span>{isRide ? 'Passenger Protocol' : 'Sender Protocol'}</span>
                            </div>
                        </div>
                        <div className="dk-client-contact-grid">
                            <div className="contact-item">
                                <div className="contact-icon"><Mail size={14} /></div>
                                <div className="contact-data">
                                    <label>Email Protocol</label>
                                    <span>{email}</span>
                                </div>
                            </div>
                            <div className="contact-item">
                                <div className="contact-icon"><Phone size={14} /></div>
                                <div className="contact-data">
                                    <label>Verified Phone</label>
                                    <span>{user?.phone || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="dk-transport-modal-card">
                        <h4 className="dk-transport-card-heading"><Navigation size={16} /> Logistics Pathway</h4>
                        
                        <div className="dk-route-timeline">
                            <div className="route-point">
                                <div className="point-dot origin"></div>
                                <div className="point-content">
                                    <label>Origin (Pickup)</label>
                                    <span>{order.pickupLocation?.address || 'Unknown Point'}</span>
                                </div>
                            </div>
                            <div className="route-connector"></div>
                            <div className="route-point">
                                <div className="point-dot destination"></div>
                                <div className="point-content">
                                    <label>Destination (Drop-off)</label>
                                    <span>{order.dropoffLocation?.address || 'Unknown Point'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="dk-transport-meta-grid mt-6">
                            <div className="meta-box">
                                <Calendar size={16} className="meta-icon" />
                                <div className="meta-data">
                                    <label>Scheduled Execution</label>
                                    <span>{date} {time && <span className="time-highlight">{time}</span>}</span>
                                </div>
                            </div>
                            <div className="meta-box">
                                {isRide ? <Car size={16} className="meta-icon" /> : <Truck size={16} className="meta-icon" />}
                                <div className="meta-data">
                                    <label>{isRide ? 'Vehicle Protocol' : 'Freight Class'}</label>
                                    <span>{vehicleInfo}</span>
                                </div>
                            </div>
                        </div>

                        <div className="dk-transport-meta-grid mt-4">
                            <div className="meta-box" style={{ gridColumn: 'span 2' }}>
                                {isRide ? <Users size={16} className="meta-icon" /> : <Package size={16} className="meta-icon" />}
                                <div className="meta-data">
                                    <label>{isRide ? 'Total Passenger Capacity' : 'Registered Payload Weight'}</label>
                                    <span>{isRide ? `${order.paxCount || 1} Explorers` : `${order.weightKg} KG Cargo`}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="dk-transport-modal-card">
                        <h4 className="dk-transport-card-heading"><CreditCard size={16} /> Financial Yield</h4>
                        <div className="dk-financial-row">
                            <div className="yield-item">
                                <label>Gross Protocol Value</label>
                                <span className="yield-value">{Number(order.price || 0).toLocaleString()} ₼</span>
                            </div>
                        </div>
                        <div className="dk-payment-badge success mt-4">
                            <CheckCircle size={14} />
                            Payment Vector: CONFIRMED
                        </div>
                    </div>

                    {order.cargoDescription && (
                        <div className="dk-transport-modal-card mb-0 bg-blue-50/50 border-blue-100">
                            <h4 className="dk-transport-card-heading text-blue-700"><FileText size={16} /> Shipment Manifest</h4>
                            <p className="dk-manifest-text">"{order.cargoDescription}"</p>
                        </div>
                    )}
                </div>

                {(order.status !== 'Completed' && order.status !== 'Delivered' && order.status !== 'Cancelled') && (
                    <div className="dk-transport-modal-footer">
                        <button className="dk-btn-abort" onClick={() => onStatusUpdate(order.id, 'Cancelled')}>
                            Abort Protocol
                        </button>
                        <button className="dk-btn-fulfill" onClick={() => onStatusUpdate(order.id, 'Completed')}>
                            Confirm Fulfillment
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
