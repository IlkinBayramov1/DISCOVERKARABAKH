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
} from 'lucide-react';
import type { IPricingRule, IPricingRulePayload } from '../../types';

interface IRoomType {
    id: string;
    name: string;
}

interface PricingRuleDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    rooms: IRoomType[];
    onSave: (data: IPricingRulePayload) => Promise<boolean>;
    editingRule: IPricingRule | null;
    loading: boolean;
}

const RULE_TYPES = [
    { value: 'WEEKEND', label: 'Weekend Growth', icon: CalendarIcon, color: '#ecfdf5', iconColor: '#059669' },
    { value: 'SEASONAL', label: 'Seasonal Rates', icon: RefreshCw, color: '#eff6ff', iconColor: '#2563eb' },
    { value: 'OCCUPANCY_BASED', label: 'Auto Yield', icon: TrendingUp, color: '#fffbeb', iconColor: '#d97706' },
    { value: 'HOLIDAY', label: 'Peak / Event', icon: Target, color: '#fff1f2', iconColor: '#e11d48' },
    { value: 'SPECIAL', label: 'Manual Promo', icon: DollarSign, color: '#f8fafc', iconColor: '#475569' },
] as const;

export default function PricingRuleDrawer({ 
    isOpen, 
    onClose, 
    rooms, 
    onSave, 
    editingRule, 
    loading 
}: PricingRuleDrawerProps) {
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="drawer-overlay" onClick={onClose}>
            <div className="drawer-content" onClick={e => e.stopPropagation()}>
                {/* HEADER */}
                <div className="drawer-header">
                    <div>
                        <h3>{editingRule ? 'Modify Strategy' : 'New Pricing Strategy'}</h3>
                        <p className="text-[13px] font-medium text-slate-400 mt-1">Configure automated yield rules for your property</p>
                    </div>
                    <button className="btn-rule-action" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="drawer-body">
                    {/* BASIC INFO */}
                    <div className="section-title-premium">
                        <Info size={16} className="text-blue-500" />
                        Strategy Identity
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6">
                        <div className="form-group">
                            <label className="form-label-premium">Strategy Name</label>
                            <input 
                                type="text" 
                                className="input-premium" 
                                placeholder="e.g., Summer High Demand Uplift"
                                required
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label-premium">Applicable Room Inventory</label>
                            <div className="relative">
                                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <select 
                                    className="input-premium pl-12"
                                    value={formData.roomTypeId || ''}
                                    onChange={e => setFormData({...formData, roomTypeId: e.target.value || null})}
                                >
                                    <option value="">All Inventory (Global Strategy)</option>
                                    {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* RULE TYPE */}
                    <div className="section-title-premium">
                        <Target size={16} className="text-rose-500" />
                        Automation Trigger
                    </div>
                    
                    <div className="rule-type-selector-grid">
                        {RULE_TYPES.map(rt => {
                            const Icon = rt.icon;
                            const isSelected = formData.type === rt.value;
                            return (
                                <button 
                                    key={rt.value}
                                    type="button"
                                    className={`type-card ${isSelected ? 'active' : ''}`}
                                    onClick={() => setFormData({...formData, type: rt.value})}
                                >
                                    <div className="icon-wrap" style={{ backgroundColor: rt.color, color: rt.iconColor }}>
                                        <Icon size={22} strokeWidth={2.5} />
                                    </div>
                                    <span>{rt.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* PRICING ADJUSTMENT */}
                    <div className="section-title-premium">
                        <DollarSign size={16} className="text-emerald-500" />
                        Revenue Impact
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-group">
                            <label className="form-label-premium">Adjustment Type</label>
                            <select 
                                className="input-premium"
                                value={formData.adjustment}
                                onChange={e => setFormData({...formData, adjustment: e.target.value as any})}
                            >
                                <option value="PERCENTAGE">Percentage (%)</option>
                                <option value="FIXED_ADDITION">Fixed Addition (₼)</option>
                                <option value="FIXED_OVERRIDE">Strategy Override (₼)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label-premium">Value</label>
                            <input 
                                type="number" 
                                className="input-premium font-black text-blue-600" 
                                required
                                value={formData.value}
                                onChange={e => setFormData({...formData, value: Number(e.target.value)})}
                            />
                        </div>
                    </div>

                    {/* CONDITIONAL SECTIONS */}
                    {formData.type === 'OCCUPANCY_BASED' && (
                        <div className="mt-8 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                            <label className="form-label-premium flex justify-between">
                                Trigger Threshold 
                                <span className="text-blue-600 text-sm">{formData.occupancyThreshold}%</span>
                            </label>
                            <input 
                                type="range" 
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-4"
                                min="0" max="100" step="5"
                                value={formData.occupancyThreshold}
                                onChange={e => setFormData({...formData, occupancyThreshold: Number(e.target.value)})}
                            />
                            <p className="text-[11px] text-slate-400 mt-4 font-medium italic">
                                Strategy will activate automatically when property occupancy exceeds this level.
                            </p>
                        </div>
                    )}

                    {(formData.type === 'SEASONAL' || formData.type === 'HOLIDAY') && (
                        <div className="mt-8 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                            <div className="section-title-premium !m-0 !mt-0 !border-0 !p-0 mb-4">
                                <CalendarIcon size={14} /> Activation Timeline
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="form-label-premium">Effective From</label>
                                    <input 
                                        type="date" 
                                        className="input-premium"
                                        value={formData.startDate}
                                        onChange={e => setFormData({...formData, startDate: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="form-label-premium">Expires On</label>
                                    <input 
                                        type="date" 
                                        className="input-premium"
                                        value={formData.endDate}
                                        onChange={e => setFormData({...formData, endDate: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </form>

                {/* FOOTER ACTIONS */}
                <div className="drawer-actions">
                    <button type="button" className="btn-reject-full" onClick={onClose} disabled={loading}>
                        Discard
                    </button>
                    <button type="submit" className="btn-approve-full" onClick={handleSubmit} disabled={loading}>
                        {loading ? <RefreshCw className="spin" size={20} /> : (
                            <><Save size={20} /> {editingRule ? 'Save Strategy' : 'Deploy Strategy'}</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
