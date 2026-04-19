import React, { useState, useEffect } from 'react';
import { 
    X, 
    Save, 
    Info, 
    Calendar as CalendarIcon, 
    TrendingUp, 
    RefreshCw,
    DollarSign,
    Target,
    Layers,
    Loader2
} from 'lucide-react';
import type { IPricingRule, IPricingRulePayload } from '../../types';
import './PricingRuleModal.css';

interface IRoomType {
    id: string;
    name: string;
}

interface PricingRuleModalProps {
    isOpen: boolean;
    onClose: () => void;
    rooms: IRoomType[];
    onSave: (data: IPricingRulePayload) => Promise<boolean>;
    editingRule: IPricingRule | null;
    loading: boolean;
}

const RULE_TYPES = [
    { value: 'WEEKEND', label: 'Weekend Growth', icon: CalendarIcon, color: '#fffbeb', iconColor: '#d97706' },
    { value: 'SEASONAL', label: 'Seasonal Rates', icon: RefreshCw, color: '#eff6ff', iconColor: '#2563eb' },
    { value: 'OCCUPANCY_BASED', label: 'Auto Yield', icon: TrendingUp, color: '#ecfdf5', iconColor: '#059669' },
    { value: 'HOLIDAY', label: 'Peak / Event', icon: Target, color: '#fff1f2', iconColor: '#e11d48' },
    { value: 'SPECIAL', label: 'Manual Promo', icon: DollarSign, color: '#f8fafc', iconColor: '#475569' },
] as const;

export default function PricingRuleModal({ 
    isOpen, 
    onClose, 
    rooms, 
    onSave, 
    editingRule, 
    loading 
}: PricingRuleModalProps) {
    const [formData, setFormData] = useState<IPricingRulePayload>({
        name: '',
        roomTypeId: null,
        type: 'WEEKEND',
        adjustment: 'PERCENTAGE',
        value: 0,
        startDate: '',
        endDate: '',
        daysOfWeek: '6,0',
        occupancyThreshold: 80,
        priority: 1,
        isActive: true
    });

    useEffect(() => {
        if (editingRule) {
            setFormData({
                name: editingRule.name,
                roomTypeId: editingRule.roomTypeId || null,
                type: editingRule.type,
                adjustment: editingRule.adjustment,
                value: editingRule.value,
                startDate: editingRule.startDate || '',
                endDate: editingRule.endDate || '',
                daysOfWeek: editingRule.daysOfWeek || '',
                occupancyThreshold: editingRule.occupancyThreshold || 0,
                priority: editingRule.priority || 1,
                isActive: editingRule.isActive
            });
        } else {
            setFormData({
                name: '',
                roomTypeId: null,
                type: 'WEEKEND',
                adjustment: 'PERCENTAGE',
                value: 0,
                startDate: '',
                endDate: '',
                daysOfWeek: '6,0',
                occupancyThreshold: 80,
                priority: 1,
                isActive: true
            });
        }
    }, [editingRule, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await onSave(formData);
        if (success) onClose();
    };

    return (
        <div className="dk-pr-modal-overlay" onClick={onClose}>
            <div className="dk-pr-modal-container" onClick={e => e.stopPropagation()}>
                
                {/* HEADER */}
                <div className="dk-pr-modal-header">
                    <div className="dk-pr-title-group">
                        <div className="dk-pr-icon-badge">
                            <TrendingUp size={28} />
                        </div>
                        <div className="dk-pr-header-text">
                            <h2>{editingRule ? 'Modify Strategy' : 'New Yield Strategy'}</h2>
                            <p>Configure advanced pricing triggers and revenue protocols</p>
                        </div>
                    </div>
                    <button className="dk-pr-close" onClick={onClose}>
                        <X size={22} />
                    </button>
                </div>

                <div className="dk-pr-modal-body">
                    <form id="pricing-rule-form" onSubmit={handleSubmit}>
                        
                        {/* SECTION: IDENTITY */}
                        <div className="dk-pr-section">
                            <div className="dk-pr-section-title">
                                <Info size={16} /> Strategy Identity
                            </div>
                            <div className="dk-pr-field">
                                <label className="dk-pr-label">Internal Strategy Name</label>
                                <input 
                                    type="text" 
                                    className="dk-pr-input" 
                                    placeholder="e.g., Summer Peak Demand Markup"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div className="dk-pr-field mb-0">
                                <label className="dk-pr-label">Target Inventory Scope</label>
                                <div className="relative">
                                    <Layers className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <select 
                                        className="dk-pr-input dk-pr-select pl-14 font-bold"
                                        value={formData.roomTypeId || ''}
                                        onChange={e => setFormData({...formData, roomTypeId: e.target.value || null})}
                                    >
                                        <option value="">Global (All Room Categories)</option>
                                        {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* SECTION: TRIGGER TYPE */}
                        <div className="dk-pr-section">
                            <div className="dk-pr-section-title">
                                <Target size={16} /> Automation Architecture
                            </div>
                            <div className="dk-pr-type-grid">
                                {RULE_TYPES.map(rt => {
                                    const Icon = rt.icon;
                                    const isSelected = formData.type === rt.value;
                                    return (
                                        <button 
                                            key={rt.value}
                                            type="button"
                                            className={`dk-pr-type-card ${isSelected ? 'active' : ''}`}
                                            onClick={() => setFormData({...formData, type: rt.value})}
                                        >
                                            <div className="icon-box" style={{ backgroundColor: rt.color, color: rt.iconColor }}>
                                                <Icon size={24} />
                                            </div>
                                            <span>{rt.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* SECTION: ECONOMIC IMPACT */}
                        <div className="dk-pr-section">
                            <div className="dk-pr-section-title">
                                <DollarSign size={16} /> Economics & Magnitude
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="dk-pr-field">
                                    <label className="dk-pr-label">Adjustment Vector</label>
                                    <select 
                                        className="dk-pr-input dk-pr-select font-bold"
                                        value={formData.adjustment}
                                        onChange={e => setFormData({...formData, adjustment: e.target.value as any})}
                                    >
                                        <option value="PERCENTAGE">Percentage (%)</option>
                                        <option value="FIXED_ADDITION">Fixed Addition (₼)</option>
                                        <option value="FIXED_OVERRIDE">Hard Override (₼)</option>
                                    </select>
                                </div>
                                <div className="dk-pr-field">
                                    <label className="dk-pr-label">Value Magnitude</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input 
                                            type="number" 
                                            className="dk-pr-input pl-14 font-black text-amber-600 text-lg" 
                                            required
                                            value={formData.value}
                                            onChange={e => setFormData({...formData, value: Number(e.target.value)})}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* OCCUPANCY SLIDER */}
                            {formData.type === 'OCCUPANCY_BASED' && (
                                <div className="dk-pr-slider-wrap mt-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">Trigger Threshold</span>
                                        <span className="text-xl font-black text-amber-600">{formData.occupancyThreshold}%</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        className="dk-pr-range"
                                        min="0" max="100" step="5"
                                        value={formData.occupancyThreshold}
                                        onChange={e => setFormData({...formData, occupancyThreshold: Number(e.target.value)})}
                                    />
                                    <p className="text-[11px] text-slate-400 font-medium italic">
                                        Optimization protocol activates when property occupancy exceeds this value.
                                    </p>
                                </div>
                            )}

                            {/* DATE CONTROLS */}
                            {(formData.type === 'SEASONAL' || formData.type === 'HOLIDAY') && (
                                <div className="dk-pr-date-group mt-4 grid grid-cols-2 gap-4">
                                    <div className="dk-pr-field mb-0">
                                        <label className="dk-pr-label">Effective From</label>
                                        <input 
                                            type="date" 
                                            className="dk-pr-input font-bold"
                                            value={formData.startDate}
                                            onChange={e => setFormData({...formData, startDate: e.target.value})}
                                        />
                                    </div>
                                    <div className="dk-pr-field mb-0">
                                        <label className="dk-pr-label">Expires On</label>
                                        <input 
                                            type="date" 
                                            className="dk-pr-input font-bold"
                                            value={formData.endDate}
                                            onChange={e => setFormData({...formData, endDate: e.target.value})}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                {/* FOOTER ACTIONS */}
                <div className="dk-pr-modal-footer">
                    <button 
                        type="button" 
                        className="dk-btn-premium-ghost" 
                        onClick={onClose} 
                        disabled={loading}
                    >
                        Discard Changes
                    </button>
                    <button 
                        form="pricing-rule-form"
                        type="submit" 
                        className="dk-btn-premium-primary"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Processing Protocol...
                            </>
                        ) : (
                            <>
                                <Save size={20} /> 
                                {editingRule ? 'Save Modification' : 'Deploy DNA Strategy'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
