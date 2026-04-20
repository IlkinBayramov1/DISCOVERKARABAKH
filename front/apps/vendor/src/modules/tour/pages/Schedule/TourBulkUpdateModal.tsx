import React, { useState } from 'react';
import { X, Calendar, Layers, DollarSign, Clock, CheckCircle2 } from 'lucide-react';
import './TourBulkUpdateModal.css';

interface TourBulkUpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    tours: any[];
    selectedTourId: string;
    onUpdate: (payload: any) => Promise<boolean>;
    loading: boolean;
}

export default function TourBulkUpdateModal({
    isOpen,
    onClose,
    tours,
    selectedTourId,
    onUpdate,
    loading
}: TourBulkUpdateModalProps) {
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        isStopped: false,
        maxSeats: undefined as number | undefined,
        priceOverride: undefined as number | undefined
    });

    const activeTourName = tours.find(t => t.id === selectedTourId)?.name || 'Active Tour';

    const [activeTab, setActiveTab] = useState<'basics' | 'days'>('basics');

    if (!isOpen) return null;

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const toggleDay = (day: string) => {
        setFormData(prev => ({
            ...prev,
            daysOfWeek: prev.daysOfWeek.includes(day)
                ? prev.daysOfWeek.filter(d => d !== day)
                : [...prev.daysOfWeek, day]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.startDate || !formData.endDate) {
            alert('Please select date range');
            return;
        }
        await onUpdate(formData);
    };

    return (
        <div className="dk-tbu-overlay">
            <div className="dk-tbu-modal glass">
                
                {/* MODAL HEADER */}
                <div className="dk-tbu-header">
                    <div className="title-area">
                        <div className="icon-pulse">
                            <Clock size={24} className="text-blue-500" />
                        </div>
                        <div>
                            <h3>Strategic Deployment</h3>
                            <p>Configuring: <strong>{activeTourName}</strong></p>
                        </div>
                    </div>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                {/* TABS */}
                <div className="dk-tbu-tabs">
                    <button 
                        className={`tab-item ${activeTab === 'basics' ? 'active' : ''}`}
                        onClick={() => setActiveTab('basics')}
                    >
                        Parameter Configuration
                    </button>
                    <button 
                        className={`tab-item ${activeTab === 'days' ? 'active' : ''}`}
                        onClick={() => setActiveTab('days')}
                    >
                        Recurrence Pattern
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="dk-tbu-content">
                    
                    {activeTab === 'basics' && (
                        <div className="tab-pane animate-in">
                            <div className="form-grid">
                                <div className="form-group col-span-1">
                                    <label><Calendar size={14} /> Start Date</label>
                                    <input 
                                        type="date" 
                                        required
                                        value={formData.startDate}
                                        onChange={e => setFormData({...formData, startDate: e.target.value})}
                                    />
                                </div>
                                <div className="form-group col-span-1">
                                    <label><Calendar size={14} /> End Date</label>
                                    <input 
                                        type="date" 
                                        required
                                        value={formData.endDate}
                                        onChange={e => setFormData({...formData, endDate: e.target.value})}
                                    />
                                </div>
                                
                                <div className="form-group col-span-2">
                                    <label><Layers size={14} /> Capacity Adjustment (Empty for base size)</label>
                                    <input 
                                        type="number" 
                                        placeholder="Overrides base group size..."
                                        value={formData.maxSeats || ''}
                                        onChange={e => setFormData({...formData, maxSeats: e.target.value ? parseInt(e.target.value) : undefined})}
                                    />
                                </div>

                                <div className="form-group col-span-2">
                                    <label><DollarSign size={14} /> Price Override (Empty for base price)</label>
                                    <input 
                                        type="number" 
                                        placeholder="Specific pricing for this range..."
                                        value={formData.priceOverride || ''}
                                        onChange={e => setFormData({...formData, priceOverride: e.target.value ? parseFloat(e.target.value) : undefined})}
                                    />
                                </div>

                                <div className="form-group col-span-2 mt-4">
                                    <div className={`status-toggle ${formData.isStopped ? 'stopped' : 'open'}`} onClick={() => setFormData({...formData, isStopped: !formData.isStopped})}>
                                        <div className="toggle-info">
                                            <strong>{formData.isStopped ? 'Stop Sell (Inactive)' : 'Open for Bookings'}</strong>
                                            <span>{formData.isStopped ? 'Hidden from customers' : 'Visible on platform'}</span>
                                        </div>
                                        <div className="toggle-switch"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'days' && (
                        <div className="tab-pane animate-in">
                            <p className="pane-hint">Select the days of the week to apply these changes to within the specified date range.</p>
                            <div className="days-selector">
                                {days.map(day => (
                                    <button 
                                        key={day}
                                        type="button"
                                        className={`day-toggle ${formData.daysOfWeek.includes(day) ? 'active' : ''}`}
                                        onClick={() => toggleDay(day)}
                                    >
                                        {formData.daysOfWeek.includes(day) && <CheckCircle2 size={12} className="check" />}
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="dk-tbu-footer">
                        <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>Discard Changes</button>
                        <button type="submit" className="btn-save" disabled={loading}>
                            {loading ? <Clock className="spin" size={18} /> : <CheckCircle2 size={18} />}
                            {loading ? 'Processing...' : 'Execute Deployment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
