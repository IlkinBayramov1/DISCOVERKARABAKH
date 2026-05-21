import React, { useState } from 'react';
import { X, Calendar, Layers, DollarSign, Clock, CheckCircle2, Zap } from 'lucide-react';
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

    const activeTourName = tours.find(t => t.id === selectedTourId)?.name || 'Selected Experience';

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
            alert('Please select both start and end dates.');
            return;
        }
        await onUpdate(formData);
    };

    return (
        <div className="dk-tbu-overlay" onClick={onClose}>
            <div className="dk-tbu-modal" onClick={e => e.stopPropagation()}>
                
                {/* MODAL HEADER */}
                <div className="dk-tbu-header">
                    <div className="dk-tbu-title-area">
                        <div className="dk-icon-badge">
                            <Zap size={24} />
                        </div>
                        <div>
                            <h2>Strategic Deployment</h2>
                            <p>Configuring: <strong>{activeTourName}</strong></p>
                        </div>
                    </div>
                    <button className="dk-btn-close-modal" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {/* TABS */}
                <div className="dk-tbu-tabs">
                    <button 
                        type="button"
                        className={`dk-tab-btn ${activeTab === 'basics' ? 'active' : ''}`}
                        onClick={() => setActiveTab('basics')}
                    >
                        Parameter Configuration
                    </button>
                    <button 
                        type="button"
                        className={`dk-tab-btn ${activeTab === 'days' ? 'active' : ''}`}
                        onClick={() => setActiveTab('days')}
                    >
                        Recurrence Pattern
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="dk-tbu-body">
                    
                    {/* BASICS TAB */}
                    {activeTab === 'basics' && (
                        <div className="dk-tab-content animate-slide-in">
                            <div className="dk-tbu-grid-2">
                                <div className="dk-tbu-input-group">
                                    <label><Calendar size={14} /> Start Date</label>
                                    <input 
                                        type="date" className="dk-tbu-input" required
                                        value={formData.startDate}
                                        onChange={e => setFormData({...formData, startDate: e.target.value})}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                                <div className="dk-tbu-input-group">
                                    <label><Calendar size={14} /> End Date</label>
                                    <input 
                                        type="date" className="dk-tbu-input" required
                                        value={formData.endDate}
                                        onChange={e => setFormData({...formData, endDate: e.target.value})}
                                        min={formData.startDate || new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                            </div>

                            <div className="dk-tbu-input-group mt-5">
                                <label><Layers size={14} /> Capacity Adjustment (Empty for base size)</label>
                                <input 
                                    type="number" className="dk-tbu-input" placeholder="Overrides standard group capacity..."
                                    value={formData.maxSeats || ''}
                                    onChange={e => setFormData({...formData, maxSeats: e.target.value ? parseInt(e.target.value) : undefined})}
                                />
                            </div>

                            <div className="dk-tbu-input-group mt-5">
                                <label><DollarSign size={14} className="text-emerald-500" /> Price Override (Empty for base price)</label>
                                <input 
                                    type="number" className="dk-tbu-input font-bold text-emerald-600" placeholder="Specific pricing for this date range..."
                                    value={formData.priceOverride || ''}
                                    onChange={e => setFormData({...formData, priceOverride: e.target.value ? parseFloat(e.target.value) : undefined})}
                                />
                            </div>

                            <div className="dk-tbu-status-toggle mt-6">
                                <div className="toggle-text">
                                    <strong>{formData.isStopped ? 'Stop Sell (Inactive)' : 'Open for Bookings'}</strong>
                                    <span>{formData.isStopped ? 'Hidden from customers during this period' : 'Visible and available on the platform'}</span>
                                </div>
                                <label className="dk-switch">
                                    <input 
                                        type="checkbox" 
                                        checked={!formData.isStopped} 
                                        onChange={() => setFormData({...formData, isStopped: !formData.isStopped})} 
                                    />
                                    <span className="dk-slider round"></span>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* DAYS TAB */}
                    {activeTab === 'days' && (
                        <div className="dk-tab-content animate-slide-in">
                            <div className="dk-tbu-hint-box">
                                <InfoIcon />
                                <p>Select the days of the week to apply these changes to within your specified date range.</p>
                            </div>
                            
                            <div className="dk-tbu-days-grid">
                                {days.map(day => {
                                    const isActive = formData.daysOfWeek.includes(day);
                                    return (
                                        <button 
                                            key={day} type="button"
                                            className={`dk-day-pill ${isActive ? 'active' : ''}`}
                                            onClick={() => toggleDay(day)}
                                        >
                                            {isActive && <CheckCircle2 size={14} />}
                                            {day}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* FOOTER */}
                    <div className="dk-tbu-footer">
                        <button type="button" className="dk-btn-discard" onClick={onClose} disabled={loading}>
                            Discard Action
                        </button>
                        <button type="submit" className="dk-btn-execute" disabled={loading}>
                            {loading ? <Clock className="spin-icon" size={18} /> : <Zap size={18} />}
                            {loading ? 'Processing...' : 'Execute Deployment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Simple internal icon component for the hint box
const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
        <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
);