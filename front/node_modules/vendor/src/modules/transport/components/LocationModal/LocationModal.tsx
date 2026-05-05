import React, { useState, useEffect } from 'react';
import type { ITransportLocation } from '../../types';
import './LocationModal.css';

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

const parseGoogleMapsUrl = (url: string): { lat: string; lng: string } | null => {
    // Format 3: ...3d39.7594652!4d46.7431602... (Most accurate marker position)
    // Supports both !3d/!4d and !1d/!2d patterns
    const regexData = /(?:3d|2d|1d)(-?\d+\.\d+).+?(?:4d|2d|1d)(-?\d+\.\d+)/g;
    const matches = [...url.matchAll(regexData)];
    if (matches.length > 0) {
        const lastMatch = matches[matches.length - 1];
        // We need to be careful about which is lat and which is lng. 
        // Usually 3d is Lat, 4d is Lng.
        // If it's the very specific marker data, it's usually at the end.
        return { lat: lastMatch[1], lng: lastMatch[2] };
    }

    // Format 2: ...q=39.7594652,46.7431602...
    const regexQ = /[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/;
    const matchQ = url.match(regexQ);
    if (matchQ) {
        return { lat: matchQ[1], lng: matchQ[2] };
    }

    // Format 1: .../@39.7610298,46.7388617,960m/...
    const regexAt = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const matchAt = url.match(regexAt);
    if (matchAt) {
        return { lat: matchAt[1], lng: matchAt[2] };
    }

    return null;
};

const LocationModal: React.FC<LocationModalProps> = ({ location, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        googleMapsUrl: '',
        lat: '',
        lng: '',
        type: 'Hotel',
    });

    useEffect(() => {
        if (location) {
            setFormData({
                name: location.name || '',
                address: location.address || '',
                googleMapsUrl: location.googleMapsUrl || '',
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
            googleMapsUrl: formData.googleMapsUrl,
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

                    <div className="form-group bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
                        <label className="text-blue-700">Google Maps Linki (Opsional)</label>
                        <input
                            type="text"
                            className="form-input border-blue-200"
                            placeholder="Linki bura yapışdırın..."
                            value={formData.googleMapsUrl}
                            onChange={(e) => {
                                const newUrl = e.target.value;
                                const coords = parseGoogleMapsUrl(newUrl);
                                if (coords) {
                                    setFormData({ ...formData, googleMapsUrl: newUrl, lat: coords.lat, lng: coords.lng });
                                } else {
                                    setFormData({ ...formData, googleMapsUrl: newUrl });
                                }
                            }}
                        />
                        <p className="text-[11px] text-blue-500 mt-1">
                            Google Maps-dən linki bura yapışdırdıqda koordinatlar avtomatik dolacaq.
                        </p>
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
