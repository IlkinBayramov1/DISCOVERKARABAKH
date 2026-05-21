import React from 'react';
import { Plus, Trash2, MapPin } from 'lucide-react';
import type { LocationData } from '../api/transport.web.api';
import { LocationAutocomplete } from './LocationAutocomplete';
import './WaypointsInput.css';

interface WaypointsInputProps {
    waypoints: LocationData[];
    onChange: (waypoints: LocationData[]) => void;
}

export const WaypointsInput: React.FC<WaypointsInputProps> = ({ waypoints, onChange }) => {
    const handleAddWaypoint = () => {
        onChange([...waypoints, { lat: 0, lng: 0, address: '' }]);
    };

    const handleRemoveWaypoint = (index: number) => {
        onChange(waypoints.filter((_, idx) => idx !== index));
    };

    const handleLocationChange = (index: number, location: LocationData) => {
        const newWaypoints = [...waypoints];
        newWaypoints[index] = location;
        onChange(newWaypoints);
    };

    return (
        <div className="waypoints-container">
            <div className="flex-between mb-3">
                <label className="font-bold text-sm text-muted">Aralıq məkanlar (Waypoints)</label>
                <button
                    type="button"
                    className="btn-text-primary text-sm flex-align-center gap-1"
                    onClick={handleAddWaypoint}
                >
                    <Plus size={16} /> Əlavə et
                </button>
            </div>

            {waypoints.length === 0 ? (
                <div className="waypoint-empty-state">
                    Heç bir aralıq məkan yoxdur.
                </div>
            ) : (
                <div className="waypoints-list">
                    {waypoints.map((wp, index) => (
                        <div key={index} className="waypoint-item">
                            <div className="waypoint-icon">
                                <MapPin size={16} />
                            </div>
                            <div className="waypoint-input-wrapper">
                                <LocationAutocomplete
                                    value={wp}
                                    onChange={(location) => handleLocationChange(index, location)}
                                    placeholder={`Aralıq məkan ${index + 1}`}
                                    className="form-input waypoint-input"
                                />
                            </div>
                            <button
                                type="button"
                                className="icon-btn-danger"
                                onClick={() => handleRemoveWaypoint(index)}
                                title="Sil"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
