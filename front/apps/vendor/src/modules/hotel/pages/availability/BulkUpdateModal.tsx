import React, { useState, useEffect } from 'react';
import { 
    X, 
    Calendar as CalendarIcon, 
    Save, 
    Info, 
    DollarSign,
    RefreshCw,
    Layers,
    Activity,
    Lock
} from 'lucide-react';
import './BulkUpdateModal.css';

interface IRoomType {
    id: string;
    name: string;
}

interface ICalendarBulkUpdate {
    roomTypeId: string;
    startDate: string;
    endDate: string;
    days?: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun')[];
    basePrice?: number;
    priceAdjustment?: {
        type: 'percentage' | 'fixed';
        value: number;
    };
    availableRooms?: number;
    minStay?: number;
    maxStay?: number | null;
    isStopped?: boolean;
    closedToArrival?: boolean;
    closedToDeparture?: boolean;
}

interface BulkUpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    rooms: IRoomType[];
    onUpdate: (payload: ICalendarBulkUpdate) => Promise<boolean>;
    loading: boolean;
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export default function BulkUpdateModal({ isOpen, onClose, rooms, onUpdate, loading }: BulkUpdateModalProps) {
    const [formData, setFormData] = useState({
        roomTypeId: '',
        startDate: '',
        endDate: '',
        days: [...WEEKDAYS],
        basePrice: '',
        isAdjustmentActive: false,
        adjustmentType: 'percentage' as 'percentage' | 'fixed',
        adjustmentValue: '',
        availableRooms: '',
        minStay: '',
        maxStay: '',
        closedToArrival: false,
        closedToDeparture: false,
        isStopped: false
    });

    // Body scroll lock
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'auto';
        return () => { document.body.style.overflow = 'auto'; };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleToggleDay = (day: typeof WEEKDAYS[number]) => {
        setFormData(prev => ({
            ...prev,
            days: prev.days.includes(day) 
                ? prev.days.filter(d => d !== day) 
                : [...prev.days, day]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.roomTypeId) return;

        const payload: ICalendarBulkUpdate = {
            roomTypeId: formData.roomTypeId,
            startDate: formData.startDate,
            endDate: formData.endDate,
            days: formData.days as any,
            basePrice: formData.basePrice ? Number(formData.basePrice) : undefined,
            priceAdjustment: formData.isAdjustmentActive ? {
                type: formData.adjustmentType,
                value: Number(formData.adjustmentValue)
            } : undefined,
            availableRooms: formData.availableRooms ? Number(formData.availableRooms) : undefined,
            minStay: formData.minStay ? Number(formData.minStay) : undefined,
            maxStay: formData.maxStay ? Number(formData.maxStay) : undefined,
            closedToArrival: formData.closedToArrival,
            closedToDeparture: formData.closedToDeparture,
            isStopped: formData.isStopped
        };

        const success = await onUpdate(payload);
        if (success) {
            onClose();
        }
    };

    return (
        <div className="dk-bulk-modal-overlay" onClick={onClose}>
            <div className="dk-bulk-modal-container" onClick={e => e.stopPropagation()}>
                
                {/* HEADER */}
                <div className="dk-bulk-modal-header">
                    <div className="dk-bulk-title-group">
                        <div className="dk-bulk-icon-badge">
                            <Layers size={22} />
                        </div>
                        <div>
                            <h2>Bulk Strategy Deployment</h2>
                            <p>Dynamic Inventory & Rate Optimization across multiple dates</p>
                        </div>
                    </div>
                    <button className="dk-bulk-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form id="bulk-update-form" onSubmit={handleSubmit} className="dk-bulk-modal-body">
                    
                    {/* SCOPE & DATES */}
                    <div className="dk-bulk-card">
                        <h4 className="dk-bulk-card-heading"><CalendarIcon size={16} /> Target Scope & Timeline</h4>
                        
                        <div className="dk-form-group">
                            <label>Target Room Category</label>
                            <select 
                                className="dk-bulk-input main-select" 
                                required
                                value={formData.roomTypeId}
                                onChange={e => setFormData({...formData, roomTypeId: e.target.value})}
                            >
                                <option value="">-- Select Room Category --</option>
                                {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                            </select>
                        </div>

                        <div className="dk-grid-2">
                            <div className="dk-form-group">
                                <label>Start Date</label>
                                <input 
                                    type="date" 
                                    className="dk-bulk-input" 
                                    required
                                    value={formData.startDate}
                                    onChange={e => setFormData({...formData, startDate: e.target.value})}
                                />
                            </div>
                            <div className="dk-form-group">
                                <label>End Date</label>
                                <input 
                                    type="date" 
                                    className="dk-bulk-input" 
                                    required
                                    value={formData.endDate}
                                    onChange={e => setFormData({...formData, endDate: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="dk-form-group mt-4 mb-0">
                            <label>Target Days of Week</label>
                            <div className="dk-days-grid">
                                {WEEKDAYS.map(day => (
                                    <button 
                                        key={day} 
                                        type="button" 
                                        className={`dk-day-btn ${formData.days.includes(day) ? 'active' : ''}`}
                                        onClick={() => handleToggleDay(day)}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* REVENUE ARCHITECTURE */}
                    <div className="dk-bulk-card">
                        <h4 className="dk-bulk-card-heading"><DollarSign size={16} className="text-emerald-500" /> Rate Architecture</h4>
                        
                        <div className="dk-form-group">
                            <label>Base Nightly Rate (₼)</label>
                            <div className="dk-input-icon-wrap">
                                <DollarSign size={16} className="icon text-emerald-500" />
                                <input 
                                    type="number" 
                                    className="dk-bulk-input with-icon font-black text-emerald-600 text-lg" 
                                    placeholder="Leave blank to keep existing"
                                    value={formData.basePrice}
                                    onChange={e => setFormData({...formData, basePrice: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="dk-adjustment-toggle">
                            <label className="dk-checkbox-label">
                                <input 
                                    type="checkbox" 
                                    checked={formData.isAdjustmentActive}
                                    onChange={e => setFormData({...formData, isAdjustmentActive: e.target.checked})}
                                />
                                <span className="custom-check"></span>
                                Apply Advanced Yield Adjustment
                            </label>
                        </div>

                        {formData.isAdjustmentActive && (
                            <div className="dk-adjustment-box">
                                <div className="dk-grid-2">
                                    <div className="dk-form-group mb-0">
                                        <label>Adjustment Vector</label>
                                        <select 
                                            className="dk-bulk-input"
                                            value={formData.adjustmentType}
                                            onChange={e => setFormData({...formData, adjustmentType: e.target.value as any})}
                                        >
                                            <option value="percentage">Percentage (%)</option>
                                            <option value="fixed">Fixed Amount (₼)</option>
                                        </select>
                                    </div>
                                    <div className="dk-form-group mb-0">
                                        <label>Magnitude</label>
                                        <input 
                                            type="number" 
                                            className="dk-bulk-input font-bold" 
                                            placeholder="e.g. 10 or -5"
                                            value={formData.adjustmentValue}
                                            onChange={e => setFormData({...formData, adjustmentValue: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <p className="dk-helper-text">
                                    <Info size={12} /> Positive values increase the rate, negative values apply a discount.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* OPERATIONAL PROTOCOLS */}
                    <div className="dk-bulk-card mb-0">
                        <h4 className="dk-bulk-card-heading"><Activity size={16} className="text-amber-500" /> Operational & Restriction Protocols</h4>
                        
                        <div className="dk-grid-2 mb-6">
                            <div className="dk-form-group mb-0">
                                <label>Daily Allocation Override</label>
                                <input 
                                    type="number" 
                                    className="dk-bulk-input" 
                                    placeholder="Total Rooms Available"
                                    value={formData.availableRooms}
                                    onChange={e => setFormData({...formData, availableRooms: e.target.value})}
                                />
                            </div>
                            <div className="dk-form-group mb-0">
                                <label>Minimum Length of Stay (LOS)</label>
                                <input 
                                    type="number" 
                                    className="dk-bulk-input" 
                                    placeholder="Min. Nights"
                                    value={formData.minStay}
                                    onChange={e => setFormData({...formData, minStay: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="dk-restriction-toggles">
                            <label className="dk-checkbox-label">
                                <input 
                                    type="checkbox" 
                                    checked={formData.closedToArrival}
                                    onChange={e => setFormData({...formData, closedToArrival: e.target.checked})}
                                />
                                <span className="custom-check"></span>
                                Closed to Arrival (CTA)
                            </label>
                            
                            <label className="dk-checkbox-label">
                                <input 
                                    type="checkbox" 
                                    checked={formData.closedToDeparture}
                                    onChange={e => setFormData({...formData, closedToDeparture: e.target.checked})}
                                />
                                <span className="custom-check"></span>
                                Closed to Departure (CTD)
                            </label>

                            <div className="dk-divider-vertical" />

                            <label className="dk-checkbox-label danger">
                                <input 
                                    type="checkbox" 
                                    checked={formData.isStopped}
                                    onChange={e => setFormData({...formData, isStopped: e.target.checked})}
                                />
                                <span className="custom-check"></span>
                                <Lock size={14} /> FULL STOP SELL (Emergency Halt)
                            </label>
                        </div>
                    </div>

                </form>

                {/* FOOTER */}
                <div className="dk-bulk-modal-footer">
                    <button type="button" className="dk-btn-ghost" onClick={onClose} disabled={loading}>
                        Cancel Update
                    </button>
                    <button type="submit" form="bulk-update-form" className="dk-btn-primary" disabled={loading}>
                        {loading ? (
                            <><RefreshCw size={18} className="spin-icon" /> Pushing to Grid...</>
                        ) : (
                            <><Save size={18} /> Deploy Strategy</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}