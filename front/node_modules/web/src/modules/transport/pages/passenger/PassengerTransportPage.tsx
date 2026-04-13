import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { transportApi, type LocationData } from '../../api/transport.web.api';
import { WaypointsInput } from '../../components/WaypointsInput';
import { LocationAutocomplete } from '../../components/LocationAutocomplete';
import { Car, MapPin, Navigation } from 'lucide-react';
import './PassengerTransportPage.css';

export const PassengerTransportPage = () => {
    const navigate = useNavigate();

    const [pickupLocation, setPickupLocation] = useState<LocationData>({ lat: 0, lng: 0, address: '' });
    const [dropoffLocation, setDropoffLocation] = useState<LocationData>({ lat: 0, lng: 0, address: '' });
    const [waypoints, setWaypoints] = useState<LocationData[]>([]);
    const [vehicleCategory, setVehicleCategory] = useState<string>('Economy');

    const [price, setPrice] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const calculatePrice = async () => {
        try {
            setLoading(true);
            setError('');
            const res = await transportApi.calculatePrice({
                pickupLocation,
                dropoffLocation,
                waypoints,
                category: vehicleCategory
            });
            if (res.success) {
                setPrice(res.data.price);
            }
        } catch (err: any) {
            setError(err.message || 'Error calculating price');
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async () => {
        try {
            setLoading(true);
            setError('');

            const res = await transportApi.createRide({
                pickupLocation,
                dropoffLocation,
                waypoints,
                vehicleCategory
            });

            if (res.success) {
                alert('Transfer initiated successfully!');
                navigate('/account/trips');
            }
        } catch (err: any) {
            setError(err.message || 'Error booking transfer');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="transport-page-container">
            <div className="transport-header glassmorphism">
                <h1>Sərnişin Daşımacılığı (Transfer)</h1>
                <p>Qarabağ daxilində rahat və təhlükəsiz səyahətiniz üçün transfer sifariş edin.</p>
            </div>

            <div className="transport-content">
                <div className="transport-form glassmorphism">
                    {error && <div className="alert-error mb-4">{error}</div>}

                    <div className="form-group">
                        <label><MapPin size={16} className="text-primary mr-1" /> Başlanğıc Ünvan (Pickup)</label>
                        <LocationAutocomplete
                            value={pickupLocation}
                            onChange={setPickupLocation}
                            placeholder="Məsələn: Füzuli Hava Limanı"
                            className="form-input"
                        />
                    </div>

                    <WaypointsInput waypoints={waypoints} onChange={setWaypoints} />

                    <div className="form-group mb-6">
                        <label><Navigation size={16} className="text-primary mr-1" /> Təyinat Ünvanı (Dropoff)</label>
                        <LocationAutocomplete
                            value={dropoffLocation}
                            onChange={setDropoffLocation}
                            placeholder="Məsələn: Şuşa Hotel Mərkəzi"
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label><Car size={16} className="text-primary mr-1" /> Maşın Növü (Category)</label>
                        <select
                            className="form-input"
                            value={vehicleCategory}
                            onChange={(e) => {
                                setVehicleCategory(e.target.value);
                                setPrice(null); // reset price when category changes
                            }}
                        >
                            <option value="Economy">Economy</option>
                            <option value="Business">Business</option>
                            <option value="Premium">Premium</option>
                            <option value="Minivan">Minivan</option>
                            <option value="Bus">Bus</option>
                        </select>
                    </div>

                    <div className="action-buttons mt-6 flex-align-center gap-4">
                        <button className="btn-secondary flex-1" onClick={calculatePrice} disabled={loading}>
                            {loading ? 'Yüklənir...' : 'Qiyməti Hesabla'}
                        </button>
                    </div>
                </div>

                <div className="transport-summary glassmorphism">
                    <h3>Sifariş Xülasəsi</h3>
                    <div className="summary-details">
                        <div className="summary-row">
                            <span>Kateqoriya:</span>
                            <strong>{vehicleCategory}</strong>
                        </div>
                        <div className="summary-row">
                            <span>Aralıq dayanacaqlar:</span>
                            <strong>{waypoints.length}</strong>
                        </div>

                        <div className="summary-divider"></div>

                        <div className="summary-row total-price">
                            <span>Təxmini Qiymət:</span>
                            <strong>{price ? `${price} AZN` : 'Hesablanmayıb'}</strong>
                        </div>
                    </div>

                    <button
                        className="btn-primary w-full mt-6"
                        disabled={loading || !price}
                        onClick={handleBooking}
                    >
                        Sifarişi Təsdiqlə
                    </button>
                    {!price && <p className="text-sm text-center text-muted mt-2">Sifariş vermək üçün əvvəlcə qiyməti hesablayın</p>}
                </div>
            </div>
        </div>
    );
};
