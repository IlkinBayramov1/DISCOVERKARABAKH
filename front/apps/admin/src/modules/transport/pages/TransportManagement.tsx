import React, { useState } from 'react';
import {
    Truck, Check, RefreshCw, Eye, Calendar, MapPin, DollarSign, Users, Award, Shield, FileText, ChevronRight, Activity, Search
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import {
    useDrivers, useApproveDriver,
    useVehicles, useCargoVehicles,
    usePricingRules, useRides, useCargoShipments,
    useTransportVendors, useLocations
} from '../hooks/useTransport';
import type { RidePricingRule, CargoVehicle, Vehicle } from '../types';

const TransportManagement: React.FC = () => {
    // Navigation & View States
    const [activeTab, setActiveTab] = useState<'overview' | 'drivers' | 'vehicles' | 'locations' | 'matrix' | 'pricing' | 'rides'>('overview');
    const [vehicleSubTab, setVehicleSubTab] = useState<'passenger' | 'cargo'>('passenger');
    const [rideSubTab, setRideSubTab] = useState<'passenger' | 'cargo'>('passenger');
    const [searchQuery, setSearchQuery] = useState('');

    // Qlobal Vendor Filtri State (UX Premium)
    const [selectedVendorId, setSelectedVendorId] = useState<string>('');

    // Selected Driver for Details Modal
    const [selectedDriverDetails, setSelectedDriverDetails] = useState<any>(null);

    // Queries
    const { data: vendorsRes, isLoading: isVendorsLoading } = useTransportVendors();
    const { data: driversRes, isLoading: isDriversLoading } = useDrivers();
    const { mutateAsync: approveDriver, isPending: isApproving } = useApproveDriver();
    const { data: vehiclesRes, isLoading: isVehiclesLoading } = useVehicles();
    const { data: cargoVehiclesRes, isLoading: isCargoVehiclesLoading } = useCargoVehicles();
    const { data: locationsRes, isLoading: isLocationsLoading } = useLocations();
    const { data: pricingRes, isLoading: isPricingLoading } = usePricingRules();
    const { data: ridesRes, isLoading: isRidesLoading } = useRides();
    const { data: cargoShipmentsRes, isLoading: isCargoShipmentsLoading } = useCargoShipments();

    // Data Processing & Filtering
    const vendorsList = vendorsRes?.data || [];

    // Helper: Find vendor ID of driver
    const getDriverVendorId = (driver: any) => {
        return driver.user_driverprofile_managedByIdTouser?.id || '';
    };

    // Helper: Find vendor name of driver
    const getDriverVendorName = (driver: any) => {
        return driver.user_driverprofile_managedByIdTouser?.vendorprofile?.companyName || 'discoverkarabakh';
    };

    // Helper: Find vendor name of passenger vehicle
    const getVehicleVendorName = (vehicle: any) => {
        return vehicle.user?.vendorprofile?.companyName || 'discoverkarabakh';
    };

    // Helper: Find vendor name of cargo vehicle
    const getCargoVehicleVendorName = (vehicle: any) => {
        return vehicle.user?.vendorProfile?.companyName || 'discoverkarabakh';
    };

    // 1. Filtered Drivers
    const driversList = driversRes?.data || [];
    const filteredDrivers = driversList.filter(d => {
        const matchesVendor = !selectedVendorId || getDriverVendorId(d) === selectedVendorId;
        const matchesSearch = searchQuery === '' || 
            `${d.firstName} ${d.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.phone.includes(searchQuery) ||
            (d.licenseNumber && d.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesVendor && matchesSearch;
    });

    // 2. Filtered Passenger Vehicles
    const passengerVehiclesList: Vehicle[] = vehiclesRes?.data || [];
    const filteredPassengerVehicles = passengerVehiclesList.filter((v: Vehicle) => {
        const matchesVendor = !selectedVendorId || v.vendorId === selectedVendorId;
        const matchesSearch = searchQuery === '' ||
            v.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.plateNumber.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesVendor && matchesSearch;
    });

    // 3. Filtered Cargo Vehicles
    const cargoVehiclesList = cargoVehiclesRes?.data || [];
    const filteredCargoVehicles = cargoVehiclesList.filter(v => {
        const matchesVendor = !selectedVendorId || v.vendorId === selectedVendorId;
        const matchesSearch = searchQuery === '' ||
            v.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.licensePlate.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesVendor && matchesSearch;
    });

    // 4. Filtered Locations
    const locationsList = locationsRes?.data || [];
    const filteredLocations = locationsList.filter(l => {
        const matchesVendor = !selectedVendorId || l.vendorId === selectedVendorId;
        const matchesSearch = searchQuery === '' ||
            l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            l.address.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesVendor && matchesSearch;
    });

    // 5. Filtered Rides
    const ridesList = ridesRes?.data || [];
    const filteredRides = ridesList.filter(r => {
        // Filter rides by vendor (either via assigned driver/vehicle or the vendorId on passenger booking if applicable)
        const driver = driversList.find(d => d.id === r.driverId);
        const driverVendorId = driver ? getDriverVendorId(driver) : '';
        const matchesVendor = !selectedVendorId || driverVendorId === selectedVendorId;

        const matchesSearch = searchQuery === '' ||
            r.pickupLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.dropoffLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (r.user && r.user.email.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesVendor && matchesSearch;
    });

    // 6. Filtered Cargo Shipments
    const shipmentsList = cargoShipmentsRes?.data || [];
    const filteredShipments = shipmentsList.filter(s => {
        const driver = driversList.find(d => d.id === s.driverId);
        const driverVendorId = driver ? getDriverVendorId(driver) : '';
        const matchesVendor = !selectedVendorId || driverVendorId === selectedVendorId;

        const matchesSearch = searchQuery === '' ||
            s.pickupLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.dropoffLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (s.user && s.user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (s.cargoDescription && s.cargoDescription.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesVendor && matchesSearch;
    });

    const pricingList = pricingRes?.data || [];

    // Helper statistics calculations
    const stats = {
        totalRides: filteredRides.length,
        totalShipments: filteredShipments.length,
        activeDrivers: filteredDrivers.filter(d => d.status === 'Approved').length,
        pendingDrivers: filteredDrivers.filter(d => d.status === 'Pending').length,
        fleetSize: filteredPassengerVehicles.length + filteredCargoVehicles.length,
        totalRevenue: filteredRides.reduce((acc, r) => acc + (r.price || 0), 0) +
            filteredShipments.reduce((acc, s) => acc + (s.shipmentpricing?.totalPrice || 0), 0)
    };

    // Handlers
    const handleApproveDriver = async (id: string) => {
        if (window.confirm('Bu sürücü profilini təsdiqləmək istəyirsiniz?')) {
            try {
                await approveDriver(id);
            } catch (err) {
                alert('Təsdiqləmə zamanı xəta baş verdi.');
            }
        }
    };

    // Helper Badges
    const getDriverBadgeVariant = (status: string) => {
        switch (status) {
            case 'Approved': return 'success';
            case 'Pending': return 'warning';
            case 'Suspended': return 'error';
            default: return 'neutral';
        }
    };

    const getRideBadgeVariant = (status: string) => {
        switch (status) {
            case 'Completed': return 'success';
            case 'Ongoing': return 'info';
            case 'Accepted': return 'warning';
            case 'Pending': return 'neutral';
            case 'Cancelled': return 'error';
            default: return 'neutral';
        }
    };

    const getShipmentBadgeVariant = (status: string) => {
        switch (status) {
            case 'Completed':
            case 'Delivered': return 'success';
            case 'InTransit':
            case 'PickedUp':
            case 'AtDropoff': return 'info';
            case 'DriverAssigned':
            case 'VehicleArrived': return 'warning';
            case 'Pending': return 'neutral';
            case 'Cancelled':
            case 'Failed': return 'error';
            default: return 'neutral';
        }
    };

    // Availability Matrix Configuration (Current Month calendar days)
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const monthLabel = today.toLocaleString('az-AZ', { month: 'long', year: 'numeric' });

    // Function to check occupant state on a specific day
    const isVehicleOccupiedOnDay = (vehicleId: string, isCargo: boolean, dayNum: number) => {
        const targetDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
        
        if (isCargo) {
            return shipmentsList.some(shipment => {
                if (shipment.cargoVehicleId !== vehicleId) return false;
                if (shipment.status === 'Cancelled' || shipment.status === 'Failed') return false;
                const shipDateStr = shipment.createdAt.split('T')[0];
                return shipDateStr === targetDateStr;
            });
        } else {
            return ridesList.some(ride => {
                if (ride.vehicleId !== vehicleId) return false;
                if (ride.status === 'Cancelled') return false;
                const rideDateStr = ride.createdAt.split('T')[0];
                return rideDateStr === targetDateStr;
            });
        }
    };

    return (
        <div className="space-y-6">
            {/* Header with Global Vendor Selector */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                <div className="flex items-center gap-3">
                    <Truck className="w-9 h-9 text-indigo-600 bg-indigo-50 p-1.5 rounded-xl border border-indigo-100" />
                    <div>
                        <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                            Nəqliyyat Platforma Monitoru
                            <Badge variant="info">Monitorinq</Badge>
                        </h1>
                        <p className="text-slate-500 font-medium text-xs mt-0.5">
                            Bütün vendorların donanma, sürücü və sifarişlərinin vahid nəzarət və monitorinq paneli.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200/50">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Qlobal Vendor:</span>
                    {isVendorsLoading ? (
                        <RefreshCw className="animate-spin w-4 h-4 text-indigo-600 mr-2" />
                    ) : (
                        <select
                            value={selectedVendorId}
                            onChange={(e) => setSelectedVendorId(e.target.value)}
                            className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-extrabold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                        >
                            <option value="">Bütün Vendorlar</option>
                            {vendorsList.map(vendor => (
                                <option key={vendor.id} value={vendor.id}>
                                    {vendor.companyName || vendor.email || 'Bilinməyən Vendor'}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 overflow-x-auto gap-6 whitespace-nowrap scrollbar-hide">
                <button
                    onClick={() => { setActiveTab('overview'); setSearchQuery(''); }}
                    className={`py-3 px-1 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
                        activeTab === 'overview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-700'
                    }`}
                >
                    <Activity className="w-4 h-4" /> Ümumi Baxış (Dashboard)
                </button>
                <button
                    onClick={() => { setActiveTab('drivers'); setSearchQuery(''); }}
                    className={`py-3 px-1 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
                        activeTab === 'drivers' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-700'
                    }`}
                >
                    <Users className="w-4 h-4" /> Sürücülər {stats.pendingDrivers > 0 && <span className="bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">{stats.pendingDrivers}</span>}
                </button>
                <button
                    onClick={() => { setActiveTab('vehicles'); setSearchQuery(''); }}
                    className={`py-3 px-1 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
                        activeTab === 'vehicles' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-700'
                    }`}
                >
                    <Truck className="w-4 h-4" /> Donanma (Fleet)
                </button>
                <button
                    onClick={() => { setActiveTab('locations'); setSearchQuery(''); }}
                    className={`py-3 px-1 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
                        activeTab === 'locations' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-700'
                    }`}
                >
                    <MapPin className="w-4 h-4" /> Məkanlar & Hub-lar
                </button>
                <button
                    onClick={() => { setActiveTab('matrix'); setSearchQuery(''); }}
                    className={`py-3 px-1 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
                        activeTab === 'matrix' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-700'
                    }`}
                >
                    <Calendar className="w-4 h-4" /> Mövcudluq Matrisi
                </button>
                <button
                    onClick={() => { setActiveTab('pricing'); setSearchQuery(''); }}
                    className={`py-3 px-1 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
                        activeTab === 'pricing' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-700'
                    }`}
                >
                    <DollarSign className="w-4 h-4" /> Tarif dərəcələri
                </button>
                <button
                    onClick={() => { setActiveTab('rides'); setSearchQuery(''); }}
                    className={`py-3 px-1 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
                        activeTab === 'rides' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-700'
                    }`}
                >
                    <FileText className="w-4 h-4" /> Sifarişlər & Reyslər
                </button>
            </div>

            {/* Sub-navigation Subtabs for Fleet & Rides */}
            {activeTab === 'vehicles' && (
                <div className="flex bg-slate-100 p-1 rounded-xl max-w-sm gap-1">
                    <button
                        onClick={() => { setVehicleSubTab('passenger'); setSearchQuery(''); }}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                            vehicleSubTab === 'passenger' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        Sərnişin Vasitələri
                    </button>
                    <button
                        onClick={() => { setVehicleSubTab('cargo'); setSearchQuery(''); }}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                            vehicleSubTab === 'cargo' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        Yük Vasitələri (Cargo)
                    </button>
                </div>
            )}

            {activeTab === 'rides' && (
                <div className="flex bg-slate-100 p-1 rounded-xl max-w-sm gap-1">
                    <button
                        onClick={() => { setRideSubTab('passenger'); setSearchQuery(''); }}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                            rideSubTab === 'passenger' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        Sərnişin Transferləri
                    </button>
                    <button
                        onClick={() => { setRideSubTab('cargo'); setSearchQuery(''); }}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                            rideSubTab === 'cargo' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        Yük Sifarişləri (Cargo)
                    </button>
                </div>
            )}

            {/* Search Input Filter */}
            {['drivers', 'vehicles', 'locations', 'rides'].includes(activeTab) && (
                <div className="relative max-w-md bg-white p-1.5 rounded-xl border border-slate-200/60 shadow-sm">
                    <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Axtarış sözünü daxil edin..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-1.5 rounded-lg border-0 focus:outline-none focus:ring-0 font-medium text-slate-700 placeholder-slate-400 text-xs"
                    />
                </div>
            )}

            {/* Tab 1: Overview Dashboard */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        <Card>
                            <div className="flex items-center gap-3.5">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cəmi Sifarişlər</span>
                                    <h2 className="text-2xl font-black text-slate-800 mt-0.5">{stats.totalRides + stats.totalShipments}</h2>
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="flex items-center gap-3.5">
                                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <DollarSign className="w-6 h-6" />
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ümumi Gəlir</span>
                                    <h2 className="text-2xl font-black text-slate-800 mt-0.5">{stats.totalRevenue.toLocaleString('az-AZ', { style: 'currency', currency: 'AZN' })}</h2>
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="flex items-center gap-3.5">
                                <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
                                    <Users className="w-6 h-6" />
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Aktiv Sürücülər</span>
                                    <h2 className="text-2xl font-black text-slate-800 mt-0.5">{stats.activeDrivers}</h2>
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="flex items-center gap-3.5">
                                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                                    <Truck className="w-6 h-6" />
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Aktiv Donanma</span>
                                    <h2 className="text-2xl font-black text-slate-800 mt-0.5">{stats.fleetSize} vasitə</h2>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Recent Actions / Operations Log */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
                            <h3 className="font-black text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wider">
                                <Activity className="w-5 h-5 text-indigo-500" /> Son Əməliyyatlar (Log)
                            </h3>

                            <div className="divide-y divide-slate-100 text-xs">
                                {[...filteredRides, ...filteredShipments]
                                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                    .slice(0, 8)
                                    .map(op => {
                                        const isShipment = 'weightKg' in op;
                                        return (
                                            <div key={op.id} className="py-3 flex.col md:flex items-center justify-between gap-4">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-2 py-0.5 rounded font-black text-[9px] uppercase ${isShipment ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-indigo-50 text-indigo-700 border border-indigo-100'}`}>
                                                            {isShipment ? 'Cargo' : 'Transfer'}
                                                        </span>
                                                        <span className="font-mono text-slate-400">#{op.id.slice(0, 8).toUpperCase()}</span>
                                                        <span className="text-slate-400 font-medium">{new Date(op.createdAt).toLocaleTimeString()}</span>
                                                    </div>
                                                    <div className="text-slate-700 font-bold mt-1">
                                                        {op.pickupLocation} &rarr; {op.dropoffLocation}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-extrabold text-slate-800">
                                                        {isShipment ? (op.shipmentpricing?.totalPrice || 0).toFixed(2) : (op.price || 0).toFixed(2)} AZN
                                                    </span>
                                                    <Badge variant={isShipment ? getShipmentBadgeVariant(op.status) : getRideBadgeVariant(op.status)}>
                                                        {op.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        );
                                    })}
                                {filteredRides.length === 0 && filteredShipments.length === 0 && (
                                    <div className="py-8 text-center text-slate-400 font-medium">Platformada hələlik heç bir əməliyyat qeydə alınmayıb.</div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
                            <h3 className="font-black text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wider">
                                <Award className="w-5 h-5 text-amber-500" /> Platforma Statusu
                            </h3>
                            <div className="space-y-3.5 text-xs">
                                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                                    <div className="text-slate-400 font-bold uppercase text-[9px]">Sürücü Təsdiq Növbəsi:</div>
                                    <div className="font-extrabold text-slate-700 flex justify-between items-center mt-1">
                                        <span>Gözləyən müraciətlər</span>
                                        <Badge variant={stats.pendingDrivers > 0 ? 'warning' : 'success'}>{stats.pendingDrivers} sürücü</Badge>
                                    </div>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                                    <div className="text-slate-400 font-bold uppercase text-[9px]">Platforma Təhlükəsizliyi:</div>
                                    <div className="font-extrabold text-slate-700 flex justify-between items-center mt-1">
                                        <span>Rol səlahiyyətləri</span>
                                        <span className="text-slate-600 font-bold flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-emerald-500" /> Tam qorunur</span>
                                    </div>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                                    <div className="text-slate-400 font-bold uppercase text-[9px]">Məkan Hub-ları:</div>
                                    <div className="font-extrabold text-slate-700 flex justify-between items-center mt-1">
                                        <span>Qeydiyyatlı məntəqələr</span>
                                        <span className="text-slate-800 font-extrabold">{locationsList.length} məkan</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab 2: Drivers (Sürücülər) */}
            {activeTab === 'drivers' && (
                <Card noPadding>
                    {isDriversLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center text-slate-400 font-medium gap-3">
                            <RefreshCw className="animate-spin h-5 w-5 text-indigo-500" />
                            Sürücülər yüklənir...
                        </div>
                    ) : filteredDrivers.length === 0 ? (
                        <div className="py-20 text-center text-slate-400 font-medium">Sürücü tapılmadı.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                        <th className="px-6 py-4">Sürücü</th>
                                        <th className="px-6 py-4">Vendor (Şirkət)</th>
                                        <th className="px-6 py-4">Telefon</th>
                                        <th className="px-6 py-4">Lisenziya №</th>
                                        <th className="px-6 py-4">Reytinq / Səfərlər</th>
                                        <th className="px-6 py-4">Təyin olunmuş maşın</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Təsdiqləmə</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs">
                                    {filteredDrivers.map(driver => (
                                        <tr key={driver.id} className="hover:bg-slate-50/30 transition-colors">
                                            <td className="px-6 py-4 font-bold text-slate-800">
                                                {driver.firstName} {driver.lastName}
                                            </td>
                                            <td className="px-6 py-4 font-extrabold text-indigo-600">
                                                🏢 {getDriverVendorName(driver)}
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 font-medium">
                                                {driver.phone}
                                            </td>
                                            <td className="px-6 py-4 font-mono text-slate-500 font-medium">
                                                {driver.licenseNumber || 'Yoxdur'}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-slate-600">
                                                ⭐️ {driver.rating ? driver.rating.toFixed(1) : '5.0'} ({driver.totalRides || 0} səfər)
                                            </td>
                                            <td className="px-6 py-4">
                                                {driver.vehicle ? (
                                                    <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-bold border border-indigo-100">
                                                        🚗 {driver.vehicle.brand} ({driver.vehicle.plateNumber})
                                                    </span>
                                                ) : driver.cargovehicle ? (
                                                    <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-100">
                                                        🚛 {driver.cargovehicle.brand} ({driver.cargovehicle.licensePlate})
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 font-medium text-[10px]">Təyin olunmayıb</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant={getDriverBadgeVariant(driver.status)}>
                                                    {driver.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {driver.status === 'Pending' ? (
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() => handleApproveDriver(driver.id)}
                                                        isLoading={isApproving}
                                                        className="gap-1 text-[10px] py-1 px-2.5"
                                                    >
                                                        <Check className="w-3 h-3" />
                                                        Profil Təsdiqlə
                                                    </Button>
                                                ) : (
                                                    <span className="text-slate-400 font-bold text-[10px] pr-2 flex items-center justify-end gap-1 cursor-pointer hover:text-indigo-600" onClick={() => setSelectedDriverDetails(driver)}>
                                                        <Eye className="w-3.5 h-3.5" /> Detallar
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            )}

            {/* Tab 3: Fleet (Donanma) */}
            {activeTab === 'vehicles' && vehicleSubTab === 'passenger' && (
                <Card noPadding>
                    {isVehiclesLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center text-slate-400 font-medium gap-3">
                            <RefreshCw className="animate-spin h-5 w-5 text-indigo-500" />
                            Vasitələr yüklənir...
                        </div>
                    ) : filteredPassengerVehicles.length === 0 ? (
                        <div className="py-20 text-center text-slate-400 font-medium">Nəqliyyat vasitəsi tapılmadı.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                        <th className="px-6 py-4">Model / Marka</th>
                                        <th className="px-6 py-4">Sahib Vendor</th>
                                        <th className="px-6 py-4">Nömrə</th>
                                        <th className="px-6 py-4">Kateqoriya</th>
                                        <th className="px-6 py-4">Tutum</th>
                                        <th className="px-6 py-4">Qiymət (Base / KM)</th>
                                        <th className="px-6 py-4">Sürücü</th>
                                        <th className="px-6 py-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs">
                                    {filteredPassengerVehicles.map(vehicle => (
                                        <tr key={vehicle.id} className="hover:bg-slate-50/30 transition-colors">
                                            <td className="px-6 py-4 font-bold text-slate-800">
                                                {vehicle.brand} {vehicle.model} ({vehicle.year})
                                                <span className="block text-[10px] font-semibold text-slate-400 mt-0.5">{vehicle.color}</span>
                                            </td>
                                            <td className="px-6 py-4 font-extrabold text-indigo-600">
                                                🏢 {getVehicleVendorName(vehicle)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-mono font-bold text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded border border-indigo-100">
                                                    {vehicle.plateNumber}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="info">{vehicle.category}</Badge>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 font-semibold">
                                                {vehicle.seats} yer / {vehicle.luggage} çanta
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-slate-700">
                                                {vehicle.basePrice || 0} AZN / {vehicle.pricePerKm || 0} AZN/km
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-slate-600">
                                                {vehicle.driverprofile ? (
                                                    <span className="text-slate-800">👤 {vehicle.driverprofile.firstName} {vehicle.driverprofile.lastName}</span>
                                                ) : (
                                                    <span className="text-slate-400 font-medium">Boşdur</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant={vehicle.status === 'Active' ? 'success' : 'warning'}>
                                                    {vehicle.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            )}

            {activeTab === 'vehicles' && vehicleSubTab === 'cargo' && (
                <Card noPadding>
                    {isCargoVehiclesLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center text-slate-400 font-medium gap-3">
                            <RefreshCw className="animate-spin h-5 w-5 text-indigo-500" />
                            Yük vasitələri yüklənir...
                        </div>
                    ) : filteredCargoVehicles.length === 0 ? (
                        <div className="py-20 text-center text-slate-400 font-medium">Yük vasitəsi tapılmadı.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                        <th className="px-6 py-4">Model / Marka</th>
                                        <th className="px-6 py-4">Sahib Vendor</th>
                                        <th className="px-6 py-4">Nömrə</th>
                                        <th className="px-6 py-4">Yük Tipi</th>
                                        <th className="px-6 py-4">Max Çəki / Həcm</th>
                                        <th className="px-6 py-4">Soyuducu</th>
                                        <th className="px-6 py-4">Cari Yük</th>
                                        <th className="px-6 py-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs">
                                    {filteredCargoVehicles.map((vehicle: CargoVehicle) => (
                                        <tr key={vehicle.id} className="hover:bg-slate-50/30 transition-colors">
                                            <td className="px-6 py-4 font-bold text-slate-800">
                                                {vehicle.brand} {vehicle.model} ({vehicle.year})
                                            </td>
                                            <td className="px-6 py-4 font-extrabold text-indigo-600">
                                                🏢 {getCargoVehicleVendorName(vehicle)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-mono font-bold text-emerald-600 bg-emerald-50/50 px-2 py-0.5 rounded border border-emerald-100">
                                                    {vehicle.licensePlate}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="neutral">{vehicle.cargoType}</Badge>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 font-semibold">
                                                ⚖️ {vehicle.maxWeightKg} kg / {vehicle.maxVolumeM3} m³
                                            </td>
                                            <td className="px-6 py-4">
                                                {vehicle.isRefrigerated ? (
                                                    <span className="text-[10px] bg-sky-50 text-sky-700 px-2 py-0.5 rounded font-bold border border-sky-100">
                                                        ❄️ {vehicle.temperatureRangeMin}°C / {vehicle.temperatureRangeMax}°C
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 font-medium">Yoxdur</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 font-medium">
                                                {vehicle.currentLoadWeight || 0} kg / {vehicle.currentLoadVolume || 0} m³
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant={
                                                    vehicle.status === 'Available' ? 'success' :
                                                    vehicle.status === 'Reserved' ? 'warning' : 'error'
                                                }>
                                                    {vehicle.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            )}

            {/* Tab 4: Locations (Məkanlar & Hub-lar) */}
            {activeTab === 'locations' && (
                <Card noPadding>
                    {isLocationsLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center text-slate-400 font-medium gap-3">
                            <RefreshCw className="animate-spin h-5 w-5 text-indigo-500" />
                            Məkanlar yüklənir...
                        </div>
                    ) : filteredLocations.length === 0 ? (
                        <div className="py-20 text-center text-slate-400 font-medium">Məkan tapılmadı.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                        <th className="px-6 py-4">Məkan Adı</th>
                                        <th className="px-6 py-4">Yaradan Vendor</th>
                                        <th className="px-6 py-4">Tip</th>
                                        <th className="px-6 py-4">Ünvan</th>
                                        <th className="px-6 py-4">Koordinatlar (Lat, Lng)</th>
                                        <th className="px-6 py-4 text-right">Xəritə keçidi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs">
                                    {filteredLocations.map(loc => (
                                        <tr key={loc.id} className="hover:bg-slate-50/30 transition-colors">
                                            <td className="px-6 py-4 font-bold text-slate-800">
                                                {loc.name}
                                            </td>
                                            <td className="px-6 py-4 font-extrabold text-indigo-600">
                                                🏢 {loc.vendorCompany || 'discoverkarabakh'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="neutral">{loc.type}</Badge>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 font-medium">
                                                {loc.address || 'Qeyd olunmayıb'}
                                            </td>
                                            <td className="px-6 py-4 font-mono text-slate-500 font-medium">
                                                {loc.coordinates?.lat?.toFixed(5) || 0}, {loc.coordinates?.lng?.toFixed(5) || 0}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {loc.googleMapsUrl ? (
                                                    <a
                                                        href={loc.googleMapsUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-indigo-600 hover:text-indigo-800 font-bold inline-flex items-center gap-1"
                                                    >
                                                        Bax <ChevronRight className="w-3 h-3" />
                                                    </a>
                                                ) : (
                                                    <span className="text-slate-400">Yoxdur</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            )}

            {/* Tab 5: Availability Matrix */}
            {activeTab === 'matrix' && (
                <Card>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <div>
                                <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-indigo-600" /> Mövcudluq Matrisi ({monthLabel})
                                </h3>
                                <p className="text-slate-400 text-[10px] mt-0.5">Yaşıl: Boş (Free), Qırmızı: Dolu (Booked)</p>
                            </div>
                        </div>

                        {/* Calendar matrix grid */}
                        <div className="overflow-x-auto pt-2">
                            <div className="min-w-[800px] space-y-3.5">
                                {/* Header Row */}
                                <div className="flex items-center gap-1.5 font-bold text-slate-400 text-[9px] uppercase tracking-wider pb-1">
                                    <div className="w-[180px] shrink-0">Nəqliyyat Vasitəsi</div>
                                    <div className="w-24 shrink-0">Tip</div>
                                    <div className="flex gap-1">
                                        {daysArray.map(day => (
                                            <div key={day} className="w-6 h-6 flex items-center justify-center bg-slate-50 border border-slate-200 rounded font-bold text-slate-600">
                                                {day}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Vehicles Matrix Rows */}
                                {filteredPassengerVehicles.map(vehicle => (
                                    <div key={vehicle.id} className="flex items-center gap-1.5 text-[11px]">
                                        <div className="w-[180px] shrink-0 font-bold text-slate-800 truncate" title={`${vehicle.brand} ${vehicle.model}`}>
                                            🚗 {vehicle.brand} {vehicle.model}
                                            <span className="block text-[8px] font-semibold text-slate-400 mt-0.5">{vehicle.plateNumber}</span>
                                        </div>
                                        <div className="w-24 shrink-0 font-medium text-slate-500">Sərnişin</div>
                                        <div className="flex gap-1">
                                            {daysArray.map(day => {
                                                const occupied = isVehicleOccupiedOnDay(vehicle.id, false, day);
                                                return (
                                                    <div
                                                        key={day}
                                                        className={`w-6 h-6 rounded flex items-center justify-center text-[9px] font-bold border transition-colors ${
                                                            occupied 
                                                            ? 'bg-rose-500 text-white border-rose-600/50 shadow-sm shadow-rose-200' 
                                                            : 'bg-emerald-500 text-white border-emerald-600/50 shadow-sm shadow-emerald-200'
                                                        }`}
                                                        title={occupied ? "Dolu (Booked)" : "Boş (Free)"}
                                                    >
                                                        {occupied ? 'D' : 'B'}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}

                                {filteredCargoVehicles.map(vehicle => (
                                    <div key={vehicle.id} className="flex items-center gap-1.5 text-[11px]">
                                        <div className="w-[180px] shrink-0 font-bold text-slate-800 truncate" title={`${vehicle.brand} ${vehicle.model}`}>
                                            🚛 {vehicle.brand} {vehicle.model}
                                            <span className="block text-[8px] font-semibold text-slate-400 mt-0.5">{vehicle.licensePlate}</span>
                                        </div>
                                        <div className="w-24 shrink-0 font-medium text-slate-500">Cargo Yük</div>
                                        <div className="flex gap-1">
                                            {daysArray.map(day => {
                                                const occupied = isVehicleOccupiedOnDay(vehicle.id, true, day);
                                                return (
                                                    <div
                                                        key={day}
                                                        className={`w-6 h-6 rounded flex items-center justify-center text-[9px] font-bold border transition-colors ${
                                                            occupied 
                                                            ? 'bg-rose-500 text-white border-rose-600/50 shadow-sm shadow-rose-200' 
                                                            : 'bg-emerald-500 text-white border-emerald-600/50 shadow-sm shadow-emerald-200'
                                                        }`}
                                                        title={occupied ? "Dolu (Booked)" : "Boş (Free)"}
                                                    >
                                                        {occupied ? 'D' : 'B'}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}

                                {filteredPassengerVehicles.length === 0 && filteredCargoVehicles.length === 0 && (
                                    <div className="py-8 text-center text-slate-400 font-medium text-xs">Bu vendor üçün heç bir vasitə qeydə alınmayıb.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            {/* Tab 6: Pricing Rules (Qiymət Tarifləri) */}
            {activeTab === 'pricing' && (
                <Card noPadding>
                    {isPricingLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center text-slate-400 font-medium gap-3">
                            <RefreshCw className="animate-spin h-5 w-5 text-indigo-500" />
                            Tariflər yüklənir...
                        </div>
                    ) : pricingList.length === 0 ? (
                        <div className="py-20 text-center text-slate-400 font-medium">Qiymət tarifi tapılmadı.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                        <th className="px-6 py-4">Tarif Qaydası</th>
                                        <th className="px-6 py-4">Xidmət Növü</th>
                                        <th className="px-6 py-4">Giriş Qiyməti (Base)</th>
                                        <th className="px-6 py-4">KM Qiyməti</th>
                                        <th className="px-6 py-4">Minimum Qiymət</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs">
                                    {pricingList.map((rule: RidePricingRule) => (
                                        <tr key={rule.id} className="hover:bg-slate-50/30 transition-colors">
                                            <td className="px-6 py-4 font-bold text-slate-800">
                                                {rule.name}
                                            </td>
                                            <td className="px-6 py-4 capitalize font-semibold text-slate-500">
                                                {rule.type}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-indigo-600">
                                                {rule.basePrice.toFixed(2)} AZN
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-slate-600">
                                                {rule.pricePerKm ? `${rule.pricePerKm.toFixed(2)} AZN/km` : '0.00 AZN/km'}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-slate-600">
                                                {rule.minPrice ? `${rule.minPrice.toFixed(2)} AZN` : '0.00 AZN'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            )}

            {/* Tab 7: Rides & Cargo Shipments (Sifarişlər) */}
            {activeTab === 'rides' && rideSubTab === 'passenger' && (
                <Card noPadding>
                    {isRidesLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center text-slate-400 font-medium gap-3">
                            <RefreshCw className="animate-spin h-5 w-5 text-indigo-500" />
                            Sifarişlər yüklənir...
                        </div>
                    ) : filteredRides.length === 0 ? (
                        <div className="py-20 text-center text-slate-400 font-medium">Sifariş tapılmadı.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                        <th className="px-6 py-4">Tarix</th>
                                        <th className="px-6 py-4">Sərnişin</th>
                                        <th className="px-6 py-4">Sürücü</th>
                                        <th className="px-6 py-4">Marşrut (Başlanğıc / Son)</th>
                                        <th className="px-6 py-4">Qiymət / Məsafə</th>
                                        <th className="px-6 py-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs">
                                    {filteredRides.map(ride => (
                                        <tr key={ride.id} className="hover:bg-slate-50/30 transition-colors">
                                            <td className="px-6 py-4 text-slate-400 font-semibold">
                                                {new Date(ride.createdAt).toLocaleString('az-AZ')}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-800">
                                                {ride.user ? `${ride.user.firstName || ''} ${ride.user.lastName || ''}`.trim() : 'Qonaq'}
                                                <span className="block text-[10px] font-medium text-slate-400 lowercase">{ride.user?.email}</span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 font-semibold">
                                                {ride.driverprofile ? `${ride.driverprofile.firstName} ${ride.driverprofile.lastName}` : (
                                                    <span className="text-slate-400">Təyin edilməyib</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 font-medium max-w-xs truncate">
                                                <span className="text-indigo-600 font-bold block">A: {ride.pickupLocation}</span>
                                                <span className="text-emerald-600 font-bold block mt-0.5">B: {ride.dropoffLocation}</span>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-700">
                                                {ride.price ? `${ride.price} AZN` : 'Hesablanır...'}
                                                <span className="block text-[10px] font-semibold text-slate-400 mt-0.5">{ride.distanceKm ? `${ride.distanceKm} km` : ''}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant={getRideBadgeVariant(ride.status)}>
                                                    {ride.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            )}

            {activeTab === 'rides' && rideSubTab === 'cargo' && (
                <Card noPadding>
                    {isCargoShipmentsLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center text-slate-400 font-medium gap-3">
                            <RefreshCw className="animate-spin h-5 w-5 text-indigo-500" />
                            Logistika yüklənir...
                        </div>
                    ) : filteredShipments.length === 0 ? (
                        <div className="py-20 text-center text-slate-400 font-medium">Yük daşıma sifarişi tapılmadı.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                        <th className="px-6 py-4">Tarix</th>
                                        <th className="px-6 py-4">Göndərən</th>
                                        <th className="px-6 py-4">Sürücü / Nəqliyyat</th>
                                        <th className="px-6 py-4">{"Marşrut (A -> B)"}</th>
                                        <th className="px-6 py-4">Yükün Çəkisi / Həcmi</th>
                                        <th className="px-6 py-4">Yekun Qiymət</th>
                                        <th className="px-6 py-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs">
                                    {filteredShipments.map(shipment => (
                                        <tr key={shipment.id} className="hover:bg-slate-50/30 transition-colors">
                                            <td className="px-6 py-4 text-slate-400 font-semibold">
                                                {new Date(shipment.createdAt).toLocaleString('az-AZ')}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-800">
                                                {shipment.user ? `${shipment.user.firstName || ''} ${shipment.user.lastName || ''}`.trim() : 'Müştəri'}
                                                <span className="block text-[10px] font-medium text-slate-400 lowercase">{shipment.user?.email}</span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 font-semibold">
                                                {shipment.driverprofile ? (
                                                    <div>
                                                        <span className="block">👤 {shipment.driverprofile.firstName} {shipment.driverprofile.lastName}</span>
                                                        {shipment.cargovehicle && (
                                                            <span className="text-[10px] text-indigo-500 font-bold block mt-0.5">🚛 {shipment.cargovehicle.brand} ({shipment.cargovehicle.licensePlate})</span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400">Təyin edilməyib</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 font-medium max-w-xs truncate">
                                                <span className="text-indigo-600 font-bold block">A: {shipment.pickupLocation}</span>
                                                <span className="text-emerald-600 font-bold block mt-0.5">B: {shipment.dropoffLocation}</span>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-slate-700">
                                                ⚖️ {shipment.weightKg} kg
                                                {shipment.volumeM3 ? <span className="block text-[10px] text-slate-400 mt-0.5">📦 {shipment.volumeM3} m³</span> : ''}
                                            </td>
                                            <td className="px-6 py-4 font-extrabold text-slate-800">
                                                {shipment.shipmentpricing?.totalPrice ? (
                                                    <span className="text-indigo-600 font-extrabold">{shipment.shipmentpricing.totalPrice.toFixed(2)} AZN</span>
                                                ) : (
                                                    <span className="text-slate-400 font-medium">Hesablanmayıb</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant={getShipmentBadgeVariant(shipment.status)}>
                                                    {shipment.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            )}

            {/* Read-Only Driver Details Modal */}
            {selectedDriverDetails && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-250">
                    <div className="w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden animate-in scale-in duration-300">
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                <Users className="w-5 h-5 text-indigo-500" />
                                Sürücü Profili Detalları
                            </h3>
                            <button onClick={() => setSelectedDriverDetails(null)} className="p-1 text-slate-400 hover:text-slate-600">
                                <Check className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4 text-xs">
                            <div className="bg-slate-50 p-4 rounded-xl space-y-2.5 border border-slate-150">
                                <div className="text-[10px] font-bold text-slate-400 uppercase">Sürücü adı:</div>
                                <div className="font-extrabold text-sm text-slate-800">{selectedDriverDetails.firstName} {selectedDriverDetails.lastName}</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase mt-2">Əlaqə məlumatları:</div>
                                <div className="font-bold text-slate-700">📞 {selectedDriverDetails.phone}</div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                                    <span className="text-slate-400 font-bold uppercase text-[10px]">Təhlükəsizlik Lisenziyası</span>
                                    <span className="font-mono text-slate-700 font-bold">{selectedDriverDetails.licenseNumber || 'Mövcud deyil'}</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                                    <span className="text-slate-400 font-bold uppercase text-[10px]">Reytinq xalı</span>
                                    <span className="font-bold text-amber-500">⭐️ {selectedDriverDetails.rating ? selectedDriverDetails.rating.toFixed(1) : '5.0'} / 5.0</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                                    <span className="text-slate-400 font-bold uppercase text-[10px]">Cəmi reys sayı</span>
                                    <span className="font-extrabold text-slate-700">{selectedDriverDetails.totalRides || 0} reys</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                                    <span className="text-slate-400 font-bold uppercase text-[10px]">Təsdiqlənmə Statusu</span>
                                    <Badge variant={getDriverBadgeVariant(selectedDriverDetails.status)}>{selectedDriverDetails.status}</Badge>
                                </div>
                                <div className="flex justify-between pb-1">
                                    <span className="text-slate-400 font-bold uppercase text-[10px]">Aid Olduğu Vendor</span>
                                    <span className="font-extrabold text-indigo-600">🏢 {getDriverVendorName(selectedDriverDetails)}</span>
                                </div>
                            </div>
                            <div className="pt-2">
                                <Button type="button" variant="primary" onClick={() => setSelectedDriverDetails(null)} className="w-full">
                                    Bağla
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransportManagement;
