import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LocationData, TaxiSearchResult } from '../../api/transport.web.api';
import { useSearchTaxis } from '../../hooks/useSearchTaxis';
import { WaypointsInput } from '../../components/WaypointsInput';
import { LocationAutocomplete } from '../../components/LocationAutocomplete';
import { Car, MapPin, Navigation, Users, Loader } from 'lucide-react';
import './PassengerTransportPage.css';

export const PassengerTransportPage = () => {
    const navigate = useNavigate();

    const [pickupLocation, setPickupLocation] = useState<LocationData>({ lat: 0, lng: 0, address: '' });
    const [dropoffLocation, setDropoffLocation] = useState<LocationData>({ lat: 0, lng: 0, address: '' });
    const [waypoints, setWaypoints] = useState<LocationData[]>([]);
    const [paxCount, setPaxCount] = useState<number>(1);
    const [bookingDate, setBookingDate] = useState<string>(() => {
        const now = new Date();
        now.setHours(now.getHours() + 2);
        // Correctly format to local ISO-like string (YYYY-MM-DDTHH:mm)
        const tzOffset = now.getTimezoneOffset() * 60000;
        return new Date(now.getTime() - tzOffset).toISOString().slice(0, 16);
    });

    const { mutate: searchTaxis, isPending: isSearching, data: searchResult } = useSearchTaxis();

    const [error, setError] = useState('');

    // Load active taxis automatically on component mount
    useEffect(() => {
        searchTaxis({ paxCount: 1 });
    }, []);

    const handleSearch = () => {
        if (!pickupLocation.address || !dropoffLocation.address) {
            setError('Zəhmət olmasa başlanğıc və bitiş ünvanlarını qeyd edin.');
            return;
        }
        setError('');
        searchTaxis({
            pickupLocation,
            dropoffLocation,
            waypoints,
            paxCount,
            scheduledAt: new Date(bookingDate).toISOString()
        });
    };

    const handleBookVehicle = (taxi: TaxiSearchResult) => {
        console.log('Navigating to vehicle details:', taxi.vehicle.id, 'for date:', bookingDate);
        const targetUrl = `/transport/details/${taxi.vehicle.id}`;
        
        navigate(targetUrl, {
            state: {
                pickupLocation,
                dropoffLocation,
                waypoints,
                paxCount,
                bookingDate,
                totalPrice: taxi.pricing.totalPrice,
                distanceKm: taxi.pricing.distanceKm
            }
        });
    };

    return (
        <div className="pt-modern-container">
            <div className="pt-hero">
                <div className="pt-hero-overlay"></div>
                <h1>Qarabağ Daxili Transfer</h1>
                <p>İstədiyiniz ünvandan lüks və ya standart avtomobillərlə təhlükəsiz səyahətinizə başlayın.</p>
            </div>

            <div className="pt-layout-grid">
                {/* Sol Panel - Axtarış Forması */}
                <div className="pt-search-card glass-panel">
                    <h2 className="text-xl font-bold mb-6 text-gray-800">Səyahətinizi Planlayın</h2>
                    
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="pt-form-group">
                        <label><MapPin size={16} className="text-indigo-600" /> Başlanğıc Ünvan</label>
                        <LocationAutocomplete
                            value={pickupLocation}
                            onChange={setPickupLocation}
                            placeholder="Məs: Füzuli Beynəlxalq Hava Limanı"
                            className="pt-input"
                        />
                    </div>

                    <WaypointsInput waypoints={waypoints} onChange={setWaypoints} />

                    <div className="pt-form-group mt-5">
                        <label><Navigation size={16} className="text-indigo-600" /> Təyinat Ünvanı</label>
                        <LocationAutocomplete
                            value={dropoffLocation}
                            onChange={setDropoffLocation}
                            placeholder="Məs: Şuşa Qalası"
                            className="pt-input"
                        />
                    </div>

                    <div className="pt-form-row flex gap-4 mt-5">
                        <div className="pt-form-group flex-1">
                            <label className="flex items-center gap-1 text-sm font-semibold mb-2">
                                <Users size={14} className="text-indigo-600" /> Sərnişin Sayı
                            </label>
                            <select
                                className="pt-input"
                                value={paxCount}
                                onChange={(e) => setPaxCount(Number(e.target.value))}
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                    <option key={num} value={num}>{num} Sərnişin</option>
                                ))}
                            </select>
                        </div>
                        <div className="pt-form-group flex-[1.5]">
                            <label className="flex items-center gap-1 text-sm font-semibold mb-2">
                                Gediş Tarixi və Saatı
                            </label>
                            <input 
                                type="datetime-local" 
                                className="pt-input"
                                value={bookingDate}
                                onChange={(e) => setBookingDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <button 
                        className="pt-btn-primary mt-8 w-full"
                        onClick={handleSearch}
                        disabled={isSearching}
                    >
                        {isSearching ? <span className="flex-align-center gap-2 justify-center"><Loader className="animate-spin" size={18}/> Axtarılır...</span> : 'Maşınları Göstər'}
                    </button>
                </div>

                {/* Sağ Panel - Maşın Siyahısı */}
                <div className="pt-results-panel">
                    {isSearching && (
                        <div className="pt-loading-state p-20 text-center">
                            <Loader className="animate-spin mx-auto mb-4 text-indigo-500" size={48} />
                            <h3 className="text-gray-600">Aktiv nəqliyyat vasitələri axtarılır...</h3>
                        </div>
                    )}

                    {!searchResult && !isSearching && (
                        <div className="pt-empty-state">
                            <Car size={48} className="text-indigo-200 mb-4" />
                            <h3>Transfer Axtarışı</h3>
                            <p>Bizim avtomobil donanmamızdan təklifləri görmək üçün soldakı formunu doldurub axtarışa verin.</p>
                        </div>
                    )}

                    {searchResult && !isSearching && (
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex-align-center gap-2">
                                <Car className="text-indigo-600" size={20} /> 
                                {searchResult.data?.length > 0 ? (
                                    `Sizin üçün ${searchResult.count ?? 0} nəqliyyat vasitəsi tapıldı`
                                ) : (
                                    'Hazırda aktiv nəqliyyat vasitəsi yoxdur'
                                )}
                            </h3>
                            
                            {(!searchResult.data || searchResult.data.length === 0) ? (
                                <div className="pt-no-results glass-panel p-8 text-center text-gray-500">
                                    <Navigation size={40} className="mx-auto mb-3 text-gray-300" />
                                    <p>Təəssüf ki, axtarış meyarlarınıza uyğun boş maşın tapılmadı.</p>
                                    <p className="text-xs mt-2">Sərnişin sayını azaldıb və ya başqa ünvanı yoxlaya bilərsiniz.</p>
                                </div>
                            ) : (
                                <div className="pt-taxi-list">
                                    {searchResult.data.map((taxi, idx) => {
                                        // User requested specifically to obscure vendor company names with generic "Premium" logic
                                        const category = taxi.vehicle.category;
                                        const customTitle = category.toLowerCase() === 'premium' ? 'Premium Taxi' : 'Standart Taksi / Transfer';
                                        const firstImage = taxi.vehicle.images?.[0];
                                        
                                        return (
                                            <div key={idx} className="pt-taxi-card">
                                                <div className="pt-taxi-image-container">
                                                    {firstImage ? (
                                                        <img src={firstImage} alt={`${taxi.vehicle.brand} ${taxi.vehicle.model}`} className="pt-taxi-img" />
                                                    ) : (
                                                        <div className="pt-taxi-image-placeholder">
                                                            <Car size={32} className="text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="pt-taxi-details">
                                                    <div className="flex-between mb-1">
                                                        <h4 className="font-bold text-gray-800">{taxi.vehicle.brand} {taxi.vehicle.model}</h4>
                                                        <span className="pt-taxi-price">
                                                            {taxi.pricing.totalPrice} {taxi.pricing.currency}
                                                            {(!pickupLocation.address || !dropoffLocation.address) && (
                                                                <span className="block text-[10px] font-normal text-gray-400 line-through-none">* baza qiymət</span>
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="flex-between text-xs text-gray-500 mb-3">
                                                        <span>{customTitle}</span>
                                                        <span className="text-indigo-600 font-medium">{taxi.vehicle.vendorCompany}</span>
                                                    </div>
                                                    
                                                    <div className="flex-between mt-auto">
                                                        <div className="flex gap-2">
                                                            <span className="pt-badge-neutral"><Users size={12} /> {taxi.vehicle.seats} yer</span>
                                                        </div>
                                                        <button 
                                                            className="pt-btn-reserve" 
                                                            onClick={() => handleBookVehicle(taxi)}
                                                        >
                                                            Detallara Bax & Sifariş
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
