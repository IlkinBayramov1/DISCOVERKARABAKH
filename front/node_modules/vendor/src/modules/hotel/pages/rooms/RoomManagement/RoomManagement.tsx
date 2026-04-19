import React, { useState } from 'react';
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
    ChevronLeft,
    ChevronRight,
    Search,
    RefreshCw,
    MessageSquare,
    MapPin,
    Layers,
    Check,
} from 'lucide-react';
import type { IRoomTypePayload, IRoomType } from '../../../types';
import RoomTypeModal from '../RoomTypeModal'; 
import './RoomManagement.css';

// Reusable Image Slider for Room Cards
const ImageSlider = ({ images, name }: { images: any[], name: string }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="room-slider-empty">
                <BedDouble size={48} className="text-slate-300" />
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
        <div className="room-slider-container">
            <img src={currentImage} alt={`${name} - ${currentIndex + 1}`} className="room-slider-img" />
            {images.length > 1 && (
                <>
                    <button className="room-slider-btn prev" onClick={handlePrevious}>
                        <ChevronLeft size={20} />
                    </button>
                    <button className="room-slider-btn next" onClick={handleNext}>
                        <ChevronRight size={20} />
                    </button>
                    <div className="room-slider-dots">
                        {images.map((_, idx) => (
                            <span key={idx} className={`room-slider-dot ${idx === currentIndex ? 'active' : ''}`} />
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

    const { data: hotels } = useHotels();
    const currentHotel = hotels?.find(h => h.id === hotelId);

    const { rooms, loading, error, addRoomType, editRoomType, removeRoomType } = useRooms(hotelId || undefined);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<IRoomType | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleOpenCreate = () => {
        setEditingRoom(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (room: IRoomType) => {
        setEditingRoom(room);
        setIsModalOpen(true);
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
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    const filteredRooms = rooms.filter(room =>
        room.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isGlobalView = !hotelId;

    return (
        <div className="rm-layout-wrapper">
            
            {/* DASHBOARD HEADER */}
            <header className="rm-header">
                <div className="rm-header-left">
                    <h1 className="rm-page-title">{isGlobalView ? 'Room Management' : 'Room Management'}</h1>
                    <div className="rm-subtitle">
                        {isGlobalView ? (
                            <span><Layers size={14} /> Add or Edit your room types.</span>
                        ) : (
                            <>
                                <MapPin size={14} />
                                <span>{currentHotel?.name || 'Searching...'}</span>
                            </>
                        )}
                    </div>
                </div>
                {!isGlobalView && (
                    <button className="rm-btn-primary" onClick={handleOpenCreate}>
                        <Plus size={18} /> New Category
                    </button>
                )}
            </header>

            {/* SEARCH BAR */}
            <div className="rm-controls-row">
                <div className="rm-search-wrapper">
                    <Search className="rm-search-icon" size={18} />
                    <input
                        type="text"
                        placeholder="Filter room categories..."
                        className="rm-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="rm-refresh-btn" title="Refresh" onClick={() => window.location.reload()}>
                    <RefreshCw size={18} />
                </button>
            </div>

            {error && <div className="rm-alert-error">{error}</div>}

            {/* ROOM LIST */}
            <div className="rm-content-area">
                {loading ? (
                    <div className="rm-loading-state">
                        <RefreshCw className="rm-spin-icon" size={48} />
                        <p>Syncing room inventory...</p>
                    </div>
                ) : filteredRooms.length === 0 ? (
                    <div className="rm-empty-state">
                        <div className="rm-empty-icon-box">
                            <BedDouble size={40} />
                        </div>
                        <h3>No Categories Match</h3>
                        <p>We couldn't find any room types matching your current filters or property.</p>
                        {!isGlobalView && (
                            <button className="rm-btn-primary mt-4" onClick={handleOpenCreate}>
                                Create First Category
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="rm-grid">
                        {filteredRooms.map((room: IRoomType) => (
                            <div key={room.id} className="rm-card">
                                
                                {/* Image & Top Badges */}
                                <div className="rm-card-media">
                                    <ImageSlider images={room.images || []} name={room.name} />
                                    <div className="rm-card-badges-top">
                                        <div className={`rm-badge-inventory ${room.totalInventory > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                            <span className="dot"></span>
                                            {room.totalInventory > 0 ? `${room.totalInventory} Units Available` : 'Sold Out'}
                                        </div>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="rm-card-body">
                                    <div className="rm-card-title-row">
                                        <h3 title={room.name}>{room.name}</h3>
                                        <div className="rm-action-group">
                                            <button className="rm-icon-btn" title="View Reviews" onClick={() => navigate(`/rooms/reviews?roomId=${room.id}&hotelId=${hotelId}`)}>
                                                <MessageSquare size={16} />
                                            </button>
                                            <button className="rm-icon-btn danger" title="Delete Category" onClick={() => handleDelete(room.id, room.name)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <p className="rm-card-desc">
                                        {room.description || 'Premium room configuration tailored for comfort and elegance.'}
                                    </p>

                                    <div className="rm-specs-pills">
                                        <span className="rm-spec-pill">
                                            <Users size={14} /> {room.maxAdults}A, {room.maxChildren}C
                                        </span>
                                        <span className="rm-spec-pill">
                                            <Maximize size={14} /> {room.roomSizeM2 || 0} m²
                                        </span>
                                        <span className="rm-spec-pill bed">
                                            <BedDouble size={14} /> {room.bedType}
                                        </span>
                                    </div>

                                    {/* Mini Amenities View */}
                                    {room.roomAmenities && room.roomAmenities.length > 0 && (
                                        <div className="rm-mini-amenities">
                                            {room.roomAmenities.slice(0, 4).map((am, idx) => (
                                                <span key={idx} className="rm-mini-am-item">
                                                    <Check size={12} className="check-icon" />
                                                    {am.amenityName}
                                                </span>
                                            ))}
                                            {room.roomAmenities.length > 4 && (
                                                <span className="rm-mini-am-item more">+{room.roomAmenities.length - 4} more</span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Footer (Price & Main Action) */}
                                <div className="rm-card-footer">
                                    <div className="rm-price-block">
                                        <span className="price-label">Standard Rate</span>
                                        <div className="price-value">
                                            <span className="currency">₼</span>{room.basePrice || 0}
                                            <span className="period">/night</span>
                                        </div>
                                    </div>
                                    
                                    <button className="rm-btn-manage" onClick={() => handleOpenEdit(room)}>
                                        <PencilLine size={16} /> Manage Configuration
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* MODAL COMPONENT */}
            <RoomTypeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                editingRoom={editingRoom}
                isSaving={loading}
            />
        </div>
    );
}