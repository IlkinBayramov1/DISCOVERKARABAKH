import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useVehicle } from '../../hooks/useVehicle';
import { useBooking } from '../../../booking/hooks/useBooking';
import { 
    Car, Users, Briefcase, Calendar, 
    MapPin, Navigation, ArrowLeft, ChevronLeft, ChevronRight, 
    X, ShieldCheck, CheckCircle
} from 'lucide-react';
import './TransportDetailsPage.css';

export const TransportDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Retrieve search data passed through state (locations, dates, pax)
    const searchData = location.state || {};
    const { pickupLocation, dropoffLocation, waypoints, paxCount, bookingDate } = searchData;

    const { data: vehicleResponse, isLoading } = useVehicle(id);
    const { submitBooking: createBooking, loading: isBooking } = useBooking();

    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const vehicle = vehicleResponse?.data;

    const handleConfirmBooking = () => {
        if (!vehicle) return;
        
        // Navigate to the checkout page and pass all state
        navigate('/transport-checkout', {
            state: {
                ...searchData,
                vehicleId: vehicle.id,
                vehicleBrand: vehicle.brand,
                vehicleModel: vehicle.model,
                vehicleImage: images[0],
                totalPrice: searchData.totalPrice || vehicle.basePrice,
                distanceKm: searchData.distanceKm || 0
            }
        });
    };

    if (isLoading) {
        return (
            <div className="pt-details-loading">
                <div className="loader"></div>
                <p>Nəqliyyat məlumatları yüklənir...</p>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="pt-details-error">
                <h2>Avtomobil tapılmadı</h2>
                <button onClick={() => navigate(-1)} className="btn-back">Geri Qayıt</button>
            </div>
        );
    }

    const images = vehicle.images && vehicle.images.length > 0 ? vehicle.images : [];

    return (
        <div className="pt-details-container">
            <div className="pt-details-header">
                <button onClick={() => navigate(-1)} className="btn-back-circle">
                    <ArrowLeft size={20} />
                </button>
                <div className="pt-header-content">
                    <h1>{vehicle.brand} {vehicle.model}</h1>
                    <div className="pt-badges">
                        <span className="badge-category">{vehicle.category}</span>
                        <span className="badge-vendor">{vehicleResponse?.owner?.vendorProfile?.companyName || 'Standard Taxi'}</span>
                    </div>
                </div>
            </div>

            <div className="pt-details-grid">
                {/* Sol tərəf - Şəkillər və Detallar */}
                <div className="pt-main-content">
                    {/* Qalereya */}
                    <div className="pt-gallery-layout">
                        {images.length > 0 ? (
                            <div className="pt-gallery-main" onClick={() => setLightboxIndex(0)}>
                                <img src={images[0]} alt="Main" />
                                {images.length > 1 && (
                                    <div className="pt-gallery-more">+{images.length - 1} Şəkil</div>
                                )}
                            </div>
                        ) : (
                            <div className="pt-no-image">
                                <Car size={64} />
                                <span>Şəkil yoxdur</span>
                            </div>
                        )}
                        
                        <div className="pt-gallery-thumbs">
                            {images.slice(1, 4).map((img: string, idx: number) => (
                                <div key={idx} className="thumb-item" onClick={() => setLightboxIndex(idx + 1)}>
                                    <img src={img} alt={`Thumb ${idx}`} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Funksional Detallar */}
                    <div className="pt-features-card glass-panel mt-6">
                        <h3>Nəqliyyat Vasitəsinin Özəllikləri</h3>
                        <div className="features-grid">
                            <div className="feature-item">
                                <Users className="text-indigo-600" />
                                <div>
                                    <span className="label">Oturacaq</span>
                                    <span className="value">{vehicle.seats} yer</span>
                                </div>
                            </div>
                            <div className="feature-item">
                                <Briefcase className="text-indigo-600" />
                                <div>
                                    <span className="label">Baqaj</span>
                                    <span className="value">{vehicle.luggage || 2} çanta</span>
                                </div>
                            </div>
                            <div className="feature-item">
                                <Calendar className="text-indigo-600" />
                                <div>
                                    <span className="label">Buraxılış ili</span>
                                    <span className="value">{vehicle.year || 'N/A'}</span>
                                </div>
                            </div>
                            <div className="feature-item">
                                <ShieldCheck className="text-indigo-600" />
                                <div>
                                    <span className="label">Status</span>
                                    <span className="value text-green-600">Sığortalı</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-description mt-6 glass-panel">
                        <h3>Əlavə Məlumat</h3>
                        <p>{vehicle.description || 'Bu nəqliyyat vasitəsi üçün əlavə məlumat qeyd edilməyib.'}</p>
                        
                        <ul className="pt-perks">
                            <li><CheckCircle size={16} className="text-green-500" /> Professional sürücü</li>
                            <li><CheckCircle size={16} className="text-green-500" /> Təmiz və komfortlu salon</li>
                            <li><CheckCircle size={16} className="text-green-500" /> 24/7 Dəstək</li>
                        </ul>
                    </div>
                </div>

                {/* Sağ tərəf - Sifariş Xülasəsi */}
                <div className="pt-sidebar">
                    <div className="pt-booking-sticky glass-panel">
                        <div className="price-tag">
                            <span className="total-label">Yekun Qiymət</span>
                            <span className="total-amount">
                                {searchData.totalPrice || vehicle.basePrice} AZN
                            </span>
                        </div>

                        <div className="summary-details mt-6">
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Səyahət Detalları</h4>
                            
                            <div className="summary-item">
                                <div className="summary-icon"><MapPin size={16} /></div>
                                <div className="summary-info">
                                    <span className="label">Götürülmə</span>
                                    <span className="value">{pickupLocation?.address || 'Seçilməyib'}</span>
                                </div>
                            </div>

                            <div className="summary-item">
                                <div className="summary-icon"><Navigation className="rotate-90" size={16} /></div>
                                <div className="summary-info">
                                    <span className="label">Təyinat</span>
                                    <span className="value">{dropoffLocation?.address || 'Seçilməyib'}</span>
                                </div>
                            </div>

                            <div className="summary-item">
                                <div className="summary-icon"><Calendar size={16} /></div>
                                <div className="summary-info">
                                    <span className="label">Tarix və Saat</span>
                                    <span className="value">
                                        {bookingDate ? new Date(bookingDate).toLocaleString('az-AZ') : 'Seçilməyib'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button 
                            className="btn-confirm-booking mt-8"
                            onClick={handleConfirmBooking}
                            disabled={isBooking || !pickupLocation?.address}
                        >
                            {isBooking ? 'Sifariş edilir...' : 'Təsdiqlə və Sifariş Et'}
                        </button>
                        
                        {!pickupLocation?.address && (
                            <p className="text-[10px] text-red-500 mt-2 text-center">
                                * Sifariş üçün əvvəlcə axtarış panelində ünvanları daxil edin.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Lightbox Modal */}
            {lightboxIndex !== null && (
                <div className="pt-lightbox" onClick={() => setLightboxIndex(null)}>
                    <button className="lb-close"><X size={32} /></button>
                    <button 
                        className="lb-prev" 
                        onClick={(e) => { e.stopPropagation(); setLightboxIndex(prev => (prev! > 0 ? prev! - 1 : images.length - 1)) }}
                    >
                        <ChevronLeft size={48} />
                    </button>
                    
                    <div className="lb-content" onClick={(e) => e.stopPropagation()}>
                        <img src={images[lightboxIndex]} alt="Full Size" />
                        <div className="lb-counter">{lightboxIndex + 1} / {images.length}</div>
                    </div>

                    <button 
                        className="lb-next" 
                        onClick={(e) => { e.stopPropagation(); setLightboxIndex(prev => (prev! < images.length - 1 ? prev! + 1 : 0)) }}
                    >
                        <ChevronRight size={48} />
                    </button>
                </div>
            )}
        </div>
    );
};
