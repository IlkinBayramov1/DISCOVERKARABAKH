import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
    Plus, 
    RefreshCw, 
    Edit2, 
    Trash2, 
    DollarSign,
    TrendingUp,
    Calendar,
    Target
} from 'lucide-react';
import { useHotels } from '../../hooks/useHotels';
import { useRooms } from '../../hooks/useRooms';
import { useRevenue } from '../../hooks/useRevenue';
import PricingRuleModal from './PricingRuleModal';
import type { IPricingRule, IPricingRulePayload } from '../../types';
import './PricingRules.css';

export default function PricingRules() {
    const [searchParams] = useSearchParams();
    const urlHotelId = searchParams.get('hotelId');
    
    const { data: hotels, loading: hotelsLoading } = useHotels(true);
    const [selectedHotelId, setSelectedHotelId] = useState<string>(urlHotelId || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRule, setEditingRule] = useState<IPricingRule | null>(null);

    useEffect(() => {
        if (hotels && hotels.length > 0 && !selectedHotelId) {
            setSelectedHotelId(urlHotelId || hotels[0].id);
        }
    }, [hotels, selectedHotelId, urlHotelId]);

    const { rooms } = useRooms(selectedHotelId || undefined);
    const { rules, loading, error, fetchRules, addRule, updateRule, removeRule } = useRevenue(selectedHotelId);

    useEffect(() => {
        if (selectedHotelId) {
            fetchRules();
        }
    }, [selectedHotelId, fetchRules]);

    const handleSave = async (data: IPricingRulePayload) => {
        if (editingRule) {
            return await updateRule(editingRule.id, data);
        } else {
            return await addRule(data);
        }
    };

    const handleDelete = async (ruleId: string) => {
        if (window.confirm('Are you sure you want to delete this pricing rule?')) {
            await removeRule(ruleId);
        }
    };

    const getRuleIcon = (type: string) => {
        switch (type) {
            case 'WEEKEND': return <Calendar size={18} />;
            case 'SEASONAL': return <RefreshCw size={18} />;
            case 'OCCUPANCY_BASED': return <TrendingUp size={18} />;
            case 'HOLIDAY': return <Target size={18} />;
            default: return <DollarSign size={18} />;
        }
    };

    const getRuleTypeClass = (type: string) => {
        switch (type) {
            case 'WEEKEND': return 'type-weekend';
            case 'SEASONAL': return 'type-seasonal';
            case 'OCCUPANCY_BASED': return 'type-occupancy';
            case 'HOLIDAY': return 'type-holiday';
            default: return '';
        }
    };

    if (hotelsLoading) {
        return (
            <div className="pricing-rules-container centered">
                <div className="spinner"></div>
                <p>Loading Property Details...</p>
            </div>
        );
    }

    return (
        <div className="pricing-rules-container">
            {/* HEADER */}
            <div className="pricing-header">
                <div>
                    <h1><DollarSign size={40} className="text-blue-500" /> Revenue & Promotions</h1>
                    <p className="subtitle">Automate your rates and manage special offers to maximize property yield.</p>
                </div>

                <div className="header-actions">
                    <div className="flex flex-col gap-1 mr-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Managing Property</label>
                        <select
                            className="styled-select-premium"
                            value={selectedHotelId}
                            onChange={(e) => setSelectedHotelId(e.target.value)}
                        >
                            {hotels?.map(h => (
                                <option key={h.id} value={h.id}>{h.name}</option>
                            ))}
                        </select>
                    </div>
                    <button className="btn-primary shadow-lg shadow-blue-500/20" onClick={() => {
                        setEditingRule(null);
                        setIsModalOpen(true);
                    }}>
                        <Plus size={24} /> New Strategy
                    </button>
                </div>
            </div>

            {/* KPI ANALYTICS ROW */}
            <div className="revenue-stats-row">
                <div className="stat-card">
                    <div className="stat-icon rules"><Target size={28} /></div>
                    <div className="stat-info">
                        <span className="stat-val">{rules.length}</span>
                        <span className="stat-label">Active Rules</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon revenue"><DollarSign size={28} /></div>
                    <div className="stat-info">
                        <span className="stat-val">Yield</span>
                        <span className="stat-label">System Active</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon promo"><Calendar size={28} /></div>
                    <div className="stat-info">
                        <span className="stat-val">
                            {rules.filter(r => r.type === 'SEASONAL' || r.type === 'HOLIDAY').length}
                        </span>
                        <span className="stat-label">Promo Campaigns</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon growth"><TrendingUp size={28} /></div>
                    <div className="stat-info">
                        <span className="stat-val">Auto</span>
                        <span className="stat-label">Optimization</span>
                    </div>
                </div>
            </div>

            {error && <div className="alert-box error mb-6 p-4 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 font-bold">{error}</div>}

            {loading && rules.length === 0 ? (
                <div className="rules-loader text-center p-20 glassmorphism-card">
                    <RefreshCw size={48} className="spin text-blue-500 mb-4" />
                    <p className="font-bold text-slate-400">Syncing with revenue engine...</p>
                </div>
            ) : rules.length === 0 ? (
                <div className="empty-rules">
                    <TrendingUp size={80} className="text-slate-100 mb-6" />
                    <h3>No Active Promotions</h3>
                    <p>Drive more bookings by setting up seasonal offers, weekend deals, or occupancy-based adjustments.</p>
                    <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                        Launch First Strategy
                    </button>
                </div>
            ) : (
                <div className="rules-grid">
                    {rules.map(rule => (
                        <div key={rule.id} className="rule-card">
                            <div className="rule-header">
                                <span className={`rule-type-badge ${getRuleTypeClass(rule.type)}`}>
                                    {getRuleIcon(rule.type)}
                                    {rule.type.replace('_', ' ')}
                                </span>
                                <label className="switch">
                                    <input 
                                        type="checkbox" 
                                        checked={rule.isActive} 
                                        onChange={(e) => updateRule(rule.id, { isActive: e.target.checked })}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>

                            <div className="rule-body">
                                <h3 className="rule-title">{rule.name}</h3>
                                <p className="rule-desc">
                                    {rule.type === 'WEEKEND' && 'Strategic markup for Friday to Sunday high-demand nights.'}
                                    {rule.type === 'SEASONAL' && `Timeline promotion active from ${rule.startDate} to ${rule.endDate}.`}
                                    {rule.type === 'OCCUPANCY_BASED' && `Automatic trigger activated when property exceeds ${rule.occupancyThreshold}% capacity.`}
                                    {rule.type === 'HOLIDAY' && `Peak-period pricing adjustment for events/holidays.`}
                                    {rule.type === 'SPECIAL' && `Manual promotion campaign targeting specific segments.`}
                                </p>
                            </div>

                            <div className="rule-adjustment">
                                <span className="adj-label">Yield Adjustment</span>
                                <div className={`adj-value ${rule.value >= 0 ? 'positive' : 'negative'}`}>
                                    {rule.value >= 0 ? '+' : ''}
                                    {rule.adjustment === 'PERCENTAGE' ? `${rule.value}%` : `₼${rule.value}`}
                                    <span className="adj-meta">
                                        {rule.adjustment === 'FIXED_OVERRIDE' ? 'Fixed Override' : 'Incremental'}
                                    </span>
                                </div>
                                {rule.type === 'OCCUPANCY_BASED' && (
                                    <div className="threshold-display">
                                        <div className="flex justify-between mb-2 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                            <span>Activation Threshold</span>
                                            <span className="text-blue-500">{rule.occupancyThreshold}%</span>
                                        </div>
                                        <div className="threshold-bar">
                                            <div className="threshold-fill" style={{ width: `${rule.occupancyThreshold}%` }}></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="rule-footer">
                                <div className="rule-status">
                                    <span className={`status-dot ${rule.isActive ? 'active' : 'inactive'}`}></span>
                                    {rule.isActive ? 'System Active' : 'On Pause'}
                                </div>
                                <div className="rule-actions">
                                    <button className="btn-rule-action" onClick={() => {
                                        setEditingRule(rule);
                                        setIsModalOpen(true);
                                    }}>
                                        <Edit2 size={18} />
                                    </button>
                                    <button className="btn-rule-action delete" onClick={() => handleDelete(rule.id)}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <PricingRuleModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                rooms={rooms || []}
                onSave={handleSave}
                editingRule={editingRule}
                loading={loading}
            />
        </div>
    );
}
