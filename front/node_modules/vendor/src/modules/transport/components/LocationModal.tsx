import React, { useState, useEffect } from 'react';
import type { ITransportLocation } from '../types';
import './PricingModal.css'; // Reusing general modal styles or create LocationModal.css

interface LocationModalProps {
    location: ITransportLocation | null;
    onSave: (data: Partial<ITransportLocation>) => void;
    onClose: () => void;
}

// Helper to convert coordinate formats (Decimal or DMS like 39°45'41.6"N) to Decimal
const parseCoordinate = (coord: string): number => {
    const cleanStr = coord.trim().replace(/,/g, '.');
    if (!isNaN(Number(cleanStr))) return Number(cleanStr);

    const regex = /(\d+)[°\s]+(\d+)['\s]+([\d.]+)(?:["\s]+([NSEW]))?/i;
    const match = cleanStr.match(regex);
    if (match) {
        const d = parseFloat(match[1]);
        const m = parseFloat(match[2]);
        const s = parseFloat(match[3]);
        const dir = match[4] ? match[4].toUpperCase() : null;

        let decimal = d + m / 60 + s / 3600;
        if (dir === 'S' || dir === 'W') {
            decimal = decimal * -1;
        }
        return decimal;
    }
    return NaN;
};

const LocationModal: React.FC<LocationModalProps> = ({ location, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        lat: '',
        lng: '',
        type: 'Hotel',
    });

    useEffect(() => {
        if (location) {
            setFormData({
                name: location.name || '',
                address: location.address || '',
                lat: location.coordinates?.lat?.toString() || '',
                lng: location.coordinates?.lng?.toString() || '',
                type: location.type || 'Hotel',
            });
        }
    }, [location]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.address || !formData.lat || !formData.lng) {
            alert('Bütün məcbur xanaları (Ad, Ünvan, Lat, Lng) doldurun.');
            return;
        }

        const parsedLat = parseCoordinate(formData.lat);
        const parsedLng = parseCoordinate(formData.lng);

        if (isNaN(parsedLat) || isNaN(parsedLng)) {
            alert('Koordinat formatı düzgün deyil. (Format: 39°45\'41.6"N və ya 39.7615)');
            return;
        }

        const payload: Partial<ITransportLocation> = {
            name: formData.name,
            address: formData.address,
            coordinates: {
                lat: parsedLat,
                lng: parsedLng
            },
            type: formData.type as any
        };

        onSave(payload);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content glassmorphism" style={{ maxWidth: '500px' }}>
                <div className="modal-header">
                    <h2>{location ? 'Məkanı Redaktə Et' : 'Yeni Məkan Əlavə Et'}</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label>Məkanın Adı *</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Məs: Şuşa Hotel"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Tip *</label>
                        <select
                            className="form-input"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="Hotel">Otel (Hotel)</option>
                            <option value="Airport">Hava Limanı (Airport)</option>
                            <option value="Attraction">Gəzməli Yer (Attraction)</option>
                            <option value="Custom">Digər (Custom)</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Ünvan *</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="Məs: Qarabağ küçəsi 5, Şuşa"
                            required
                        />
                    </div>

                    <div className="form-row flex gap-4">
                        <div className="form-group flex-1">
                            <label>Enlik (Latitude) *</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.lat}
                                onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                                placeholder="Məs: 39°45'41.6&quot;N və ya 39.75"
                                required
                            />
                        </div>
                        <div className="form-group flex-1">
                            <label>Uzunluq (Longitude) *</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.lng}
                                onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                                placeholder="Məs: 46°44'32.0&quot;E və ya 46.75"
                                required
                            />
                        </div>
                    </div>

                    <p className="text-sm text-muted mt-2 mb-4">
                        Qeyd: Dəqiq Xəritə API koordinatlarını daxil edin ki, axtarışlar zamanı sərnişinlər məkanı rahat tapsınlar.
                    </p>

                    <div className="modal-actions mt-4 flex justify-end gap-3">
                        <button type="button" className="btn-secondary" onClick={onClose}>Ləğv Et</button>
                        <button type="submit" className="btn-primary">
                            {location ? 'Yenilə' : 'Yarat'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LocationModal;
