import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { transportApi, type LocationData } from '../../api/transport.web.api';
import { getUserRole } from '../../../../shared/utils/token';
import { WaypointsInput } from '../../components/WaypointsInput';
import { LocationAutocomplete } from '../../components/LocationAutocomplete';
import { Package, MapPin, AlertTriangle } from 'lucide-react';
import '../passenger/PassengerTransportPage.css'; // Reuse styles

export const CargoTransportPage = () => {
    const navigate = useNavigate();

    // Auth Check
    useEffect(() => {
        const role = getUserRole();
        if (role === 'tourist') {
            navigate('/', { replace: true });
        }
    }, [navigate]);

    const [pickupLocation, setPickupLocation] = useState<LocationData>({ lat: 0, lng: 0, address: '' });
    const [dropoffLocation, setDropoffLocation] = useState<LocationData>({ lat: 0, lng: 0, address: '' });
    const [waypoints, setWaypoints] = useState<LocationData[]>([]);

    // Cargo specific fields
    const [weightKg, setWeightKg] = useState<string>('');
    const [cargoDescription, setCargoDescription] = useState<string>('');
    const [isHazardous, setIsHazardous] = useState<boolean>(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleBooking = async () => {
        try {
            setLoading(true);
            setError('');

            if (!weightKg || isNaN(Number(weightKg))) {
                throw new Error("Düzgün çəki (kq) qeyd edin.");
            }

            const res = await transportApi.createShipment({
                pickupLocation,
                dropoffLocation,
                waypoints,
                weightKg: Number(weightKg),
                cargoDescription,
                isHazardous
            });

            if (res.success) {
                alert('Yük təslimatı uğurla göndərildi!');
                navigate('/account/trips');
            }
        } catch (err: any) {
            setError(err.message || 'Error booking cargo shipment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="transport-page-container">
            <div className="transport-header glassmorphism" style={{ borderLeft: '4px solid var(--primary)' }}>
                <h1>Yük Daşımacılığı (Cargo)</h1>
                <p>Ağır və böyük həcmli yüklərinizin Qarabağ daxilində daşınması.</p>
            </div>

            <div className="transport-content">
                <div className="transport-form glassmorphism">
                    {error && <div className="alert-error mb-4">{error}</div>}

                    <h3 className="font-bold mb-4 flex-align-center gap-2">
                        <MapPin size={20} className="text-primary" /> Ünvan Məlumatları
                    </h3>

                    <div className="form-group">
                        <label>Başlanğıc Ünvan (Pickup)</label>
                        <LocationAutocomplete
                            value={pickupLocation}
                            onChange={setPickupLocation}
                            placeholder="Məsələn: Ağdam Sənaye Parkı"
                            className="form-input"
                        />
                    </div>

                    <WaypointsInput waypoints={waypoints} onChange={setWaypoints} />

                    <div className="form-group mb-6">
                        <label>Təyinat Ünvanı (Dropoff)</label>
                        <LocationAutocomplete
                            value={dropoffLocation}
                            onChange={setDropoffLocation}
                            placeholder="Məsələn: Zəngilan Aeroportu"
                            className="form-input"
                        />
                    </div>

                    <div className="separator my-6" style={{ height: 1, background: 'var(--border)' }}></div>

                    <h3 className="font-bold mb-4 flex-align-center gap-2">
                        <Package size={20} className="text-primary" /> Yük Məlumatları
                    </h3>

                    <div className="form-group">
                        <label>Yükün Çəkisi (Kq) *</label>
                        <input
                            type="number"
                            className="form-input"
                            placeholder="Məs: 1500"
                            value={weightKg}
                            onChange={(e) => setWeightKg(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Yükün Təsviri</label>
                        <textarea
                            className="form-input"
                            rows={3}
                            placeholder="Məs: Tikinti materialları, mebel və s."
                            value={cargoDescription}
                            onChange={(e) => setCargoDescription(e.target.value)}
                        />
                    </div>

                    <div className="form-group checkbox-group mt-4">
                        <label className="flex-align-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isHazardous}
                                onChange={(e) => setIsHazardous(e.target.checked)}
                            />
                            <span><AlertTriangle size={16} className="text-danger inline mr-1" /> Təhlükəli Yük (Hazardous)</span>
                        </label>
                    </div>

                </div>

                <div className="transport-summary glassmorphism">
                    <h3>Yük Xülasəsi</h3>
                    <div className="summary-details">
                        <div className="summary-row">
                            <span>Çəki:</span>
                            <strong>{weightKg ? `${weightKg} Kq` : '-'}</strong>
                        </div>
                        <div className="summary-row">
                            <span>Aralıq məkanlar:</span>
                            <strong>{waypoints.length}</strong>
                        </div>
                        <div className="summary-row">
                            <span>Təhlükəli Yük:</span>
                            <strong>{isHazardous ? 'Bəli' : 'Xeyr'}</strong>
                        </div>
                    </div>

                    <button
                        className="btn-primary w-full mt-6"
                        disabled={loading || !weightKg}
                        onClick={handleBooking}
                    >
                        Karqo Sifarişi Ver
                    </button>
                    {!weightKg && <p className="text-sm text-center text-muted mt-2">Davam etmək üçün çəkini qeyd edin</p>}
                </div>
            </div>
        </div>
    );
};
