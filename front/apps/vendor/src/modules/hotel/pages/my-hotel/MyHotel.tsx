import { useHotels } from '../../hooks/useHotels';
import { HotelCard } from '../../components/HotelCard/HotelCard';
import { Building2, Plus, RefreshCw, Hotel as HotelIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import './MyHotel.css';

export default function MyHotel() {
    const { data: hotels, loading, error, removeHotel } = useHotels(true);

    return (
        <div className="my-hotel-container">
            <div className="page-header">
                <div>
                    <h1>My Property</h1>
                    <p>Manage your primary listing and business profile</p>
                </div>
                {hotels.length === 0 && !loading && (
                    <Link to="/hotel/create" className="btn-primary flex items-center gap-2">
                        <Plus size={20} /> List Property
                    </Link>
                )}
            </div>

            {error && <div className="alert error">{error}</div>}

            <div className="property-view">
                {loading ? (
                    <div className="loading-state centered">
                        <RefreshCw className="spin text-blue-500" size={40} />
                        <p className="mt-4 font-semibold text-slate-500">Syncing with registry...</p>
                    </div>
                ) : hotels.length === 0 ? (
                    <div className="empty-state glassmorphism-card">
                        <HotelIcon size={64} className="text-slate-200 mb-4 mx-auto" />
                        <h3 className="text-xl font-bold text-slate-800">No Listings Found</h3>
                        <p className="text-slate-500 max-w-md mx-auto mb-6">
                            Start creating your professional property profile to reach global travelers.
                        </p>
                        <Link to="/hotel/create" className="btn-primary">
                            List Your First Property
                        </Link>
                    </div>
                ) : (
                    <div className="hotel-focus-grid">
                        <div className="section-title">
                            <Building2 size={24} /> Registered Property
                        </div>
                        <div className="cards-wrapper">
                            {hotels.map(h => (
                                <HotelCard key={h.id} hotel={h} onDelete={removeHotel} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .my-hotel-container { padding: 2rem; max-width: 1440px; margin: 0 auto; }
                .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; }
                .page-header h1 { font-size: 2rem; font-weight: 800; color: #0f172a; margin: 0; }
                .property-view { min-height: 400px; }
                .section-title { font-size: 1.25rem; font-weight: 700; color: #1e293b; display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; }
                .hotel-focus-grid { max-width: 500px; }
                .cards-wrapper { display: flex; flex-direction: column; gap: 2rem; }
                .centered { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 300px; }
            `}</style>
        </div>
    );
}
