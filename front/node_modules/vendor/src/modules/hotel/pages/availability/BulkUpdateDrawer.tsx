import React, { useState } from 'react';
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

interface BulkUpdateDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    rooms: IRoomType[];
    onUpdate: (payload: ICalendarBulkUpdate) => Promise<boolean>;
    loading: boolean;
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export default function BulkUpdateDrawer({ isOpen, onClose, rooms, onUpdate, loading }: BulkUpdateDrawerProps) {
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
        <div className="drawer-overlay" onClick={onClose}>
            <div className="bulk-drawer-content" onClick={e => e.stopPropagation()}>
                {/* HEADER */}
                <div className="drawer-header">
                    <div className="flex justify-between items-center w-full">
                        <div>
                            <h3>Bulk Strategy</h3>
                            <p className="drawer-subtitle">Dynamic Inventory & Rate Optimization</p>
                        </div>
                        <button className="btn-close-drawer !bg-transparent" onClick={onClose}>
                            <X size={24} className="text-slate-400" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="drawer-body">
                    {/* SECTION: SCOPE */}
                    <div className="section-title-premium">
                        <Layers size={14} className="text-blue-500" /> Target Inventory
                    </div>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="form-label-premium">Room Category</label>
                            <select 
                                className="input-premium" 
                                required
                                value={formData.roomTypeId}
                                onChange={e => setFormData({...formData, roomTypeId: e.target.value})}
                            >
                                <option value="">Select Room Type</option>
                                {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="form-label-premium">Start Date</label>
                                <input 
                                    type="date" 
                                    className="input-premium" 
                                    required
                                    value={formData.startDate}
                                    onChange={e => setFormData({...formData, startDate: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="form-label-premium">End Date</label>
                                <input 
                                    type="date" 
                                    className="input-premium" 
                                    required
                                    value={formData.endDate}
                                    onChange={e => setFormData({...formData, endDate: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECTION: DAYS SELECTION */}
                    <div className="section-title-premium">
                        <CalendarIcon size={14} className="text-indigo-500" /> Days of the Week
                    </div>
                    <div className="days-grid">
                        {WEEKDAYS.map(day => (
                            <button 
                                key={day} 
                                type="button" 
                                className={`day-btn ${formData.days.includes(day) ? 'active' : ''}`}
                                onClick={() => handleToggleDay(day)}
                            >
                                {day[0]}
                            </button>
                        ))}
                    </div>

                    {/* SECTION: REVENUE MANAGEMENT */}
                    <div className="section-title-premium">
                        <DollarSign size={14} className="text-emerald-500" /> Rate Architecture
                    </div>
                    
                    <div>
                        <label className="form-label-premium">Base Rate (AZN)</label>
                        <input 
                            type="number" 
                            className="input-premium" 
                            placeholder="e.g. 150"
                            value={formData.basePrice}
                            onChange={e => setFormData({...formData, basePrice: e.target.value})}
                        />
                    </div>

                    <div className="mt-6">
                        <label className="custom-checkbox-premium">
                            <input 
                                type="checkbox" 
                                className="w-5 h-5 rounded-lg border-2 border-slate-200"
                                checked={formData.isAdjustmentActive}
                                onChange={e => setFormData({...formData, isAdjustmentActive: e.target.checked})}
                            />
                            Apply Advanced Yield Adjustment
                        </label>
                    </div>

                    {formData.isAdjustmentActive && (
                        <div className="adjustment-box">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="form-label-premium">Vector</label>
                                    <select 
                                        className="input-premium"
                                        value={formData.adjustmentType}
                                        onChange={e => setFormData({...formData, adjustmentType: e.target.value as any})}
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed (AZN)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="form-label-premium">Magnitude</label>
                                    <input 
                                        type="number" 
                                        className="input-premium font-black text-blue-600" 
                                        placeholder="e.g. 10 or -5"
                                        value={formData.adjustmentValue}
                                        onChange={e => setFormData({...formData, adjustmentValue: e.target.value})}
                                    />
                                </div>
                            </div>
                            <p className="text-[11px] font-bold text-slate-400 mt-4 italic flex items-center gap-2">
                                <Info size={12} /> Positive (+) increases, Negative (-) discounts.
                            </p>
                        </div>
                    )}

                    {/* SECTION: OPERATIONAL CONTROLS */}
                    <div className="section-title-premium">
                        <Activity size={14} className="text-amber-500" /> Operational Status
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="form-label-premium">Allocation</label>
                            <input 
                                type="number" 
                                className="input-premium" 
                                placeholder="Total Units"
                                value={formData.availableRooms}
                                onChange={e => setFormData({...formData, availableRooms: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="form-label-premium">Min Stay</label>
                            <input 
                                type="number" 
                                className="input-premium" 
                                placeholder="Nights"
                                value={formData.minStay}
                                onChange={e => setFormData({...formData, minStay: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="custom-checkbox-premium">
                            <input 
                                type="checkbox" 
                                className="w-5 h-5"
                                checked={formData.closedToArrival}
                                onChange={e => setFormData({...formData, closedToArrival: e.target.checked})}
                            />
                            Closed to Arrival (CTA)
                        </label>
                        <label className="custom-checkbox-premium">
                            <input 
                                type="checkbox" 
                                className="w-5 h-5"
                                checked={formData.closedToDeparture}
                                onChange={e => setFormData({...formData, closedToDeparture: e.target.checked})}
                            />
                            Closed to Departure (CTD)
                        </label>
                        <label className="custom-checkbox-premium text-rose-600">
                            <input 
                                type="checkbox" 
                                className="w-5 h-5 accent-rose-600"
                                checked={formData.isStopped}
                                onChange={e => setFormData({...formData, isStopped: e.target.checked})}
                            />
                            <Lock size={14} className="ml-1" /> FULL STOP SELL (Emergency)
                        </label>
                    </div>
                </form>

                <div className="drawer-actions">
                    <button className="btn-reject-full" onClick={onClose} disabled={loading}>
                        Cancel
                    </button>
                    <button 
                        className="btn-approve-full" 
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? <RefreshCw size={20} className="spin" /> : <><Save size={20} /> Deploy Update</>}
                    </button>
                </div>
            </div>
        </div>
    );
}
