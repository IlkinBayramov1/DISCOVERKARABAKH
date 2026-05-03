import { useState, useEffect } from 'react';
import { transportVendorApi } from '../api/transport.api';
import type { ITransportLocation } from '../types';
import { Plus, Edit2, Trash2, MapPin, Navigation, Map, Building, Plane, Tent } from 'lucide-react';
import LocationModal from "../components/LocationModal";
import './VendorLocationsPage.css';

export default function VendorLocationsPage() {
    const [locations, setLocations] = useState<ITransportLocation[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<ITransportLocation | null>(null);

    useEffect(() => {
        loadLocations();
    }, []);

    const loadLocations = async () => {
        setLoading(true);
        try {
            const res = await transportVendorApi.getLocations() as any;
            if (res.success) setLocations(res.data);
            else if (Array.isArray(res)) setLocations(res);
        } catch (error) {
            console.error('Failed to load locations', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (data: Partial<ITransportLocation>) => {
        try {
            if (selectedLocation && selectedLocation._id) {
                await transportVendorApi.updateLocation(selectedLocation._id, data);
            } else if (selectedLocation && selectedLocation.id) {
                await transportVendorApi.updateLocation(selectedLocation.id, data);
            } else {
                await transportVendorApi.createLocation(data);
            }
            setIsModalOpen(false);
            setSelectedLocation(null);
            loadLocations();
        } catch (error) {
            console.error('Save failed', error);
            alert("Məkan məlumatlarını yadda saxlayarkən xəta baş verdi.");
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`"${name}" məkanını silmək istədiyinizdən əminsiniz?`)) {
            try {
                await transportVendorApi.deleteLocation(id);
                loadLocations();
            } catch (error) {
                console.error('Failed to delete location', error);
                alert('Silinmə xətası.');
            }
        }
    };

    const openEdit = (location: ITransportLocation) => {
        setSelectedLocation(location);
        setIsModalOpen(true);
    };

    const openNew = () => {
        setSelectedLocation(null);
        setIsModalOpen(true);
    };

    // İkon təyinatı üçün köməkçi funksiya
    const getLocationIcon = (type: string) => {
        switch (type) {
            case 'Hotel': return <Building size={18} />;
            case 'Airport': return <Plane size={18} />;
            case 'Attraction': return <Tent size={18} />;
            default: return <Map size={18} />;
        }
    };

    return (
        <div className="dk-vendor-page">

            {/* PAGE HEADER */}
            <div className="dk-page-header">
                <div className="header-text">
                    <h1>Locations & Hubs</h1>
                    <p>Manage pickup/drop-off points, hotels, and attractions for your transport network.</p>
                </div>
                <button className="dk-btn-primary" onClick={openNew}>
                    <Plus size={18} />
                    <span>Add Location</span>
                </button>
            </div>

            {/* CONTENT AREA */}
            {loading ? (
                <div className="dk-loading-state">
                    <div className="spinner"></div>
                    <p>Loading locations...</p>
                </div>
            ) : locations.length === 0 ? (
                <div className="dk-empty-state">
                    <div className="empty-icon-wrapper">
                        <MapPin size={48} />
                    </div>
                    <h2>No Locations Found</h2>
                    <p>You haven't defined any service locations yet. Add hotels, airports, or specific points to map your transport routes.</p>
                    <button className="dk-btn-outline" style={{ marginTop: '16px' }} onClick={openNew}>
                        <Plus size={18} /> Add Your First Location
                    </button>
                </div>
            ) : (
                <div className="dk-table-card box-shadow">
                    <div className="table-responsive">
                        <table className="dk-data-table">
                            <thead>
                                <tr>
                                    <th>Location Name</th>
                                    <th>Type</th>
                                    <th>Address Details</th>
                                    <th>Coordinates (Lat, Lng)</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {locations.map(loc => {
                                    const id = loc._id || loc.id;
                                    return (
                                        <tr key={id}>
                                            <td>
                                                <div className="loc-cell">
                                                    <div className={`loc-icon-box ${loc.type?.toLowerCase() || 'custom'}`}>
                                                        {getLocationIcon(loc.type || 'Custom')}
                                                    </div>
                                                    <div className="loc-info">
                                                        <span className="loc-name">{loc.name}</span>
                                                        {loc.popularity ? <span className="loc-pop">Pop: {loc.popularity}</span> : null}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`status-badge active`}>{loc.type || 'Custom'}</span>
                                            </td>
                                            <td>
                                                <div className="address-text">{loc.address}</div>
                                            </td>
                                            <td>
                                                <div className="coord-cell">
                                                    <span className="coord-pill">
                                                        {loc.coordinates?.lat}, {loc.coordinates?.lng}
                                                    </span>
                                                    {loc.coordinates?.lat && loc.coordinates?.lng && (
                                                        <a
                                                            href={`http://googleusercontent.com/maps.google.com/5${loc.coordinates.lat},${loc.coordinates.lng}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            title="View on Maps"
                                                            className="map-link-btn"
                                                        >
                                                            <Navigation size={14} />
                                                        </a>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button className="icon-action-btn edit" onClick={() => openEdit(loc)} title="Edit Location">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button className="icon-action-btn delete" onClick={() => handleDelete(id as string, loc.name)} title="Delete Location">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* MODAL */}
            {isModalOpen && (
                <LocationModal
                    location={selectedLocation}
                    onSave={handleSave}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedLocation(null);
                    }}
                />
            )}
        </div>
    );
}