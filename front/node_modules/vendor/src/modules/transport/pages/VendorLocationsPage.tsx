import { useState, useEffect } from 'react';
import { transportVendorApi } from '../api/transport.api';
import type { ITransportLocation } from '../types';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';
import LocationModal from "../components/LocationModal";
import './VendorTransport.css'; // Make sure styling is shared

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
        if (window.confirm(`Siz "${name}" məkanını silmək istədiyinizdən əminsiniz?`)) {
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

    return (
        <div className="vendor-page-container">
            <div className="page-header flex-between mb-6">
                <div>
                    <h1>Məkanlar (Locations)</h1>
                    <p className="text-muted">Nəqliyyat sistemində axtarıla biləcək xüsusi məkanları idarə edin.</p>
                </div>
                <button className="btn-primary flex-align-center gap-2" onClick={openNew}>
                    <Plus size={18} /> Yeni Məkan
                </button>
            </div>

            {loading ? (
                <div className="flex-align-center gap-2"><span className="spinner"></span> Yüklənir...</div>
            ) : (
                <div className="table-responsive bg-white rounded-lg shadow-sm border border-gray-100">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Adı</th>
                                <th>Tip</th>
                                <th>Ünvan</th>
                                <th>Koordinatlar (Lat, Lng)</th>
                                <th>Populyarlıq</th>
                                <th>Əməliyyatlar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {locations.map(loc => {
                                const id = loc._id || loc.id;
                                return (
                                    <tr key={id}>
                                        <td>
                                            <div className="flex-align-center gap-2">
                                                <MapPin size={16} className="text-primary" />
                                                <strong>{loc.name}</strong>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-badge active`}>{loc.type}</span>
                                        </td>
                                        <td>{loc.address}</td>
                                        <td className="text-muted text-sm flex-align-center gap-2">
                                            {loc.coordinates?.lat}, {loc.coordinates?.lng}
                                            {loc.coordinates?.lat && loc.coordinates?.lng && (
                                                <a
                                                    href={`https://www.google.com/maps?q=${loc.coordinates.lat},${loc.coordinates.lng}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    title="Xəritədə bax"
                                                    className="text-primary hover:underline"
                                                >
                                                    <MapPin size={14} />
                                                </a>
                                            )}
                                        </td>
                                        <td>{loc.popularity || 0}</td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button className="icon-btn-text" onClick={() => openEdit(loc)} title="Redaktə et"><Edit size={16} /></button>
                                                <button className="icon-btn-text text-danger" onClick={() => handleDelete(id as string, loc.name)} title="Sil"><Trash2 size={16} color="red" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {locations.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-muted">Heç bir məkan tapılmadı.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

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
