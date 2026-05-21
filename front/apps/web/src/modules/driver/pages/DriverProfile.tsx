import { useState, useEffect } from 'react';
import { transportDriverApi } from '../../transport/api/transport.web.api';

export default function DriverProfilePage() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [statusUpdating, setStatusUpdating] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await transportDriverApi.getProfile();
            setProfile(data);
        } catch (error) {
            console.error('Failed to load profile', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus: 'Online' | 'Offline' | 'Busy') => {
        setStatusUpdating(true);
        try {
            await transportDriverApi.updateStatus(newStatus);
            setProfile({ ...profile, status: newStatus });
        } catch (error) {
            console.error('Failed to update status', error);
        } finally {
            setStatusUpdating(false);
        }
    };

    if (loading) return <div className="p-8">Yüklənir...</div>;
    if (!profile) return <div className="p-8 text-red-500">Profil tapılmadı.</div>;

    const isCargo = !!profile.currentCargoVehicleId;

    return (
        <div className="bg-white p-8 rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold mb-6">Mənim Profilim</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Info */}
                <div>
                    <h2 className="text-lg font-semibold mb-4 border-b pb-2">Şəxsi Məlumatlar</h2>
                    <div className="space-y-3">
                        <p><span className="text-gray-500">Ad Soyad:</span> {profile.firstName} {profile.lastName}</p>
                        <p><span className="text-gray-500">Telefon:</span> {profile.phone}</p>
                        <p><span className="text-gray-500">Vəsiqə:</span> {profile.licenseNumber || 'Yoxdur'}</p>
                        <p><span className="text-gray-500">Sürücü Tipi:</span> {isCargo ? 'Yük Daşıma (Cargo)' : 'Sərnişin (Passenger)'}</p>
                        <p><span className="text-gray-500">İşlədiyi Şirkət (Vendor):</span> {profile.managedBy?.vendorProfile?.companyName || profile.managedById || 'Günəbaxan'}</p>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-lg font-semibold mb-4 border-b pb-2">İş Statusu</h2>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => handleStatusChange('Online')}
                                disabled={statusUpdating || profile.status === 'Online'}
                                className={`px-4 py-2 rounded-lg font-medium transition ${profile.status === 'Online' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                Online (İşlər açıq)
                            </button>
                            <button 
                                onClick={() => handleStatusChange('Offline')}
                                disabled={statusUpdating || profile.status === 'Offline'}
                                className={`px-4 py-2 rounded-lg font-medium transition ${profile.status === 'Offline' ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                Offline (İşə bağlı)
                            </button>
                            <button 
                                onClick={() => handleStatusChange('Busy')}
                                disabled={statusUpdating || profile.status === 'Busy'}
                                className={`px-4 py-2 rounded-lg font-medium transition ${profile.status === 'Busy' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                Məşğul
                            </button>
                        </div>
                    </div>
                </div>

                {/* Vehicle Info */}
                <div>
                    <h2 className="text-lg font-semibold mb-4 border-b pb-2">Avtomobil Məlumatları</h2>
                    <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                        {isCargo && profile.currentCargoVehicle ? (
                            <>
                                <p><span className="text-gray-500">Marka/Model:</span> {profile.currentCargoVehicle.brand} {profile.currentCargoVehicle.model}</p>
                                <p><span className="text-gray-500">Nömrə Nişanı:</span> {profile.currentCargoVehicle.licensePlate}</p>
                                <p><span className="text-gray-500">Yük Tipi:</span> {profile.currentCargoVehicle.cargoType}</p>
                                <p><span className="text-gray-500">Maksimum Çəki:</span> {profile.currentCargoVehicle.maxWeightKg} kq</p>
                                <p><span className="text-gray-500">Həcm:</span> {profile.currentCargoVehicle.maxVolumeM3} m³</p>
                            </>
                        ) : profile.currentVehicle ? (
                            <>
                                <p><span className="text-gray-500">Marka/Model:</span> {profile.currentVehicle.brand} {profile.currentVehicle.model}</p>
                                <p><span className="text-gray-500">Rəng:</span> {profile.currentVehicle.color}</p>
                                <p><span className="text-gray-500">Nömrə Nişanı:</span> {profile.currentVehicle.plateNumber}</p>
                                <p><span className="text-gray-500">Kateqoriya:</span> {profile.currentVehicle.category}</p>
                                <p><span className="text-gray-500">Oturacaq sayı:</span> {profile.currentVehicle.seats}</p>
                            </>
                        ) : (
                            <p className="text-gray-500 italic">Avtomobil təyin edilməyib.</p>
                        )}
                    </div>

                    <div className="mt-6">
                        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Statistika</h2>
                        <div className="flex gap-6">
                            <div className="bg-primary/10 text-primary p-4 rounded-lg flex-1 text-center">
                                <p className="text-3xl font-bold">{profile.totalRides || 0}</p>
                                <p className="text-sm">Tamamlanmış Sifariş</p>
                            </div>
                            <div className="bg-yellow-50 text-yellow-600 p-4 rounded-lg flex-1 text-center">
                                <p className="text-3xl font-bold">{profile.rating || '5.0'}</p>
                                <p className="text-sm">Reytinq</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
