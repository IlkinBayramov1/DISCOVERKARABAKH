import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useRooms } from '../../../hooks/useRooms';
import { useHotels } from '../../../hooks/useHotels';
import {
    BedDouble,
    Plus,
    PencilLine,
    Trash2,
    Users,
    Maximize,
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Search,
    RefreshCw,
    MessageSquare,
    MapPin,
} from 'lucide-react';
import type { IRoomTypePayload, IRoomType } from '../../../types';
import RoomTypeDrawer from '../RoomTypeDrawer';
import './RoomManagement.css';

// Reusable Image Slider for Room Cards
const ImageSlider = ({ images, name }: { images: any[], name: string }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="no-image-placeholder room-placeholder" style={{ height: '240px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BedDouble size={48} className="text-slate-200" />
            </div>
        );
    }

    const handlePrevious = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prevIndex) => prevIndex === 0 ? images.length - 1 : prevIndex - 1);
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prevIndex) => prevIndex === images.length - 1 ? 0 : prevIndex + 1);
    };

    const currentImage = images[currentIndex].url || images[currentIndex];

    return (
        <div className="hotel-image-slider h-full">
            <img src={currentImage} alt={`${name} - ${currentIndex + 1}`} className="w-full h-full object-cover" />
            {images.length > 1 && (
                <>
                    <button className="slider-btn prev" onClick={handlePrevious}>
                        <ChevronLeft size={20} />
                    </button>
                    <button className="slider-btn next" onClick={handleNext}>
                        <ChevronRight size={20} />
                    </button>
                    <div className="slider-dots">
                        {images.map((_, idx) => (
                            <span key={idx} className={`dot ${idx === currentIndex ? 'active' : ''}`} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default function RoomManagement() {
    const [searchParams] = useSearchParams();
    const hotelId = searchParams.get('hotelId');
    const navigate = useNavigate();

    // Fetch hotels to get the hotel name
    const { data: hotels } = useHotels();
    const currentHotel = hotels?.find(h => h.id === hotelId);

    const { rooms, loading, error, addRoomType, editRoomType, removeRoomType } = useRooms(hotelId || undefined);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<IRoomType | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleOpenCreate = () => {
        setEditingRoom(null);
        setIsDrawerOpen(true);
    };

    const handleOpenEdit = (room: IRoomType) => {
        setEditingRoom(room);
        setIsDrawerOpen(true);
    };

    const handleDelete = async (roomId: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete "${name}"? This will permanently remove all associated physical room inventory.`)) {
            try {
                await removeRoomType(roomId);
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleSave = async (payload: IRoomTypePayload) => {
        try {
            if (editingRoom) {
                await editRoomType(editingRoom.id, payload);
            } else {
                await addRoomType(payload);
            }
            setIsDrawerOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    const filteredRooms = rooms.filter(room =>
        room.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isGlobalView = !hotelId;

    return (
        <div className="room-management-container">
            <div className="dashboard-header mb-5">
                <div>
                    <button className="btn-back mb-2" onClick={() => navigate('/hotel/dashboard')}>
                        <ArrowLeft size={16} /> Back to Hub
                    </button>
                    <h1 className="text-3xl font-extrabold">{isGlobalView ? 'Global Inventory' : 'Room Management'}</h1>
                    <div className="flex items-center gap-2 text-slate-500 font-medium">
                        {isGlobalView ? (
                            <span>Aggregating all your property room classes</span>
                        ) : (
                            <>
                                <MapPin size={16} />
                                <span>{currentHotel?.name || 'Searching...'}</span>
                            </>
                        )}
                    </div>
                </div>
                {!isGlobalView && (
                    <button className="btn-primary flex items-center gap-2" onClick={handleOpenCreate}>
                        <Plus size={20} /> New Category
                    </button>
                )}
            </div>

            {/* SEARCH BAR */}
            <div className="search-actions mb-4 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Filter room categories..."
                        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-blue-500 transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-500 transition-all">
                    <RefreshCw size={20} />
                </button>
            </div>

            {error && <div className="alert error glassmorphism-card mb-4">{error}</div>}

            <div className="room-list-section">
                {loading ? (
                    <div className="loading-state centered p-5">
                        <RefreshCw className="spin text-blue-500" size={48} />
                        <p className="mt-4 font-bold text-slate-500">Syncing room inventory...</p>
                    </div>
                ) : filteredRooms.length === 0 ? (
                    <div className="empty-state glassmorphism-card p-5 text-center">
                        <BedDouble size={48} className="text-slate-200 mb-4 mx-auto" />
                        <h3>No Categories Match</h3>
                        <p className="text-slate-500 mb-6">We couldn't find any room types matching your current filters.</p>
                        {!isGlobalView && (
                            <button className="btn-primary" onClick={handleOpenCreate}>Create First Category</button>
                        )}
                    </div>
                ) : (
                    <div className="room-grid">
                        {filteredRooms.map((room: IRoomType) => (
                            <div key={room.id} className="room-card glassmorphism-card">
                                <div className="room-card-header">
                                    <ImageSlider images={room.images || []} name={room.name} />
                                    <div className="room-badges">
                                        <div className="inventory-badge">
                                            {room.totalInventory} Available
                                        </div>
                                        <div className="price-badge">
                                            ₼{room.basePrice || 0} <span className="text-[10px] opacity-70">/ NIGHT</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="room-card-body">
                                    <div className="room-title-row">
                                        <h3>{room.name}</h3>
                                        <div className="text-[11px] font-extrabold text-blue-500 bg-blue-50 px-3 py-1 rounded-full mt-1 inline-block">
                                            {room.bedType}
                                        </div>
                                    </div>

                                    <p className="room-desc">{room.description || 'Premium room configuration tailored for comfort and elegance.'}</p>

                                    <div className="room-specs">
                                        <div className="spec-item">
                                            <Users size={16} />
                                            <span>{room.maxAdults} / {room.maxChildren} Guests</span>
                                        </div>
                                        <div className="spec-item">
                                            <Maximize size={16} />
                                            <span>{room.roomSizeM2 || 0} m² Area</span>
                                        </div>
                                        <div className="spec-item">
                                            <BedDouble size={16} />
                                            <span>{room.bedType}</span>
                                        </div>
                                        <div className="spec-item">
                                            <RefreshCw size={16} />
                                            <span>Daily Clean</span>
                                        </div>
                                    </div>

                                    <div className="room-card-actions">
                                        <button className="btn-edit-main" onClick={() => handleOpenEdit(room)}>
                                            <PencilLine size={18} /> Manage Category
                                        </button>
                                        <button
                                            className="action-icon-btn reviews"
                                            title="View Reviews"
                                            onClick={() => navigate(`/rooms/reviews?roomId=${room.id}&hotelId=${hotelId}`)}
                                        >
                                            <MessageSquare size={20} />
                                        </button>
                                        <button
                                            className="action-icon-btn delete"
                                            onClick={() => handleDelete(room.id, room.name)}
                                            title="Delete Category"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <RoomTypeDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                onSave={handleSave}
                editingRoom={editingRoom}
                isSaving={loading}
            />

            <style>{`
                .centered { min-height: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
                .spin { animation: spin 1.5s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
                .font-extrabold { font-weight: 800; }
                .font-medium { font-weight: 500; }
            `}</style>
        </div>
    );
}
