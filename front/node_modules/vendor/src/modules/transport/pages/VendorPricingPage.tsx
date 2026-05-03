import { useState, useEffect } from 'react';
import { transportVendorApi } from '../api/transport.api';
import type { IPricingRule } from '../types';
import { Plus, Edit2, Trash2, Car, Truck, Calculator, MapPin, Clock, Target } from 'lucide-react';
import PricingModal from '../components/PricingModal';
import './VendorPricingPage.css';

export default function VendorPricingPage() {
    const [rules, setRules] = useState<IPricingRule[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRule, setSelectedRule] = useState<IPricingRule | null>(null);
    const [activeTab, setActiveTab] = useState<'passenger' | 'cargo'>('passenger');

    useEffect(() => {
        loadRules();
    }, []);

    const loadRules = async () => {
        setLoading(true);
        try {
            const res = await transportVendorApi.getPricingRules() as any;
            if (res.success) setRules(res.data);
            else if (Array.isArray(res)) setRules(res);
        } catch (error) {
            console.error('Failed to load pricing rules', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (data: Partial<IPricingRule>) => {
        try {
            if (selectedRule && selectedRule.id) {
                await transportVendorApi.updatePricingRule(selectedRule.id, data);
            } else {
                await transportVendorApi.createPricingRule(data);
            }
            setIsModalOpen(false);
            setSelectedRule(null);
            loadRules();
        } catch (error) {
            console.error('Failed to save rule', error);
            alert('An error occurred while saving the pricing rule.');
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete the "${name}" pricing rule?`)) {
            try {
                await transportVendorApi.deletePricingRule(id);
                loadRules();
            } catch (error) {
                console.error('Failed to delete rule', error);
                alert('Deletion failed.');
            }
        }
    };

    const openEdit = (rule: IPricingRule) => {
        setSelectedRule(rule);
        setIsModalOpen(true);
    };

    const openNew = () => {
        setSelectedRule({
            id: '',
            name: '',
            type: 'PerKm' as any,
            basePrice: 0,
            config: { transportType: activeTab }
        } as unknown as IPricingRule);
        setIsModalOpen(true);
    };

    const filteredRules = rules.filter(r => {
        const type = r.config?.transportType || 'passenger';
        return type === activeTab;
    });

    const getRuleIcon = (type: string) => {
        switch (type) {
            case 'Fixed': return <Target size={20} />;
            case 'Hourly': return <Clock size={20} />;
            default: return <MapPin size={20} />;
        }
    };

    return (
        <div className="dk-vendor-page">

            {/* PAGE HEADER */}
            <div className="dk-page-header">
                <div className="header-text">
                    <h1>Pricing Rules & Tariffs</h1>
                    <p>Configure dynamic pricing, base fares, and distance rates for your fleet.</p>
                </div>
                <button className="dk-btn-primary" onClick={openNew}>
                    <Plus size={18} />
                    <span>Create Rule</span>
                </button>
            </div>

            {/* SEGMENTED TABS */}
            <div className="dk-tabs-wrapper">
                <div className="dk-segmented-control">
                    <button
                        className={`segment-btn ${activeTab === 'passenger' ? 'active' : ''}`}
                        onClick={() => setActiveTab('passenger')}
                    >
                        <Car size={18} /> Passenger Tariffs
                    </button>
                    <button
                        className={`segment-btn ${activeTab === 'cargo' ? 'active' : ''}`}
                        onClick={() => setActiveTab('cargo')}
                    >
                        <Truck size={18} /> Cargo Tariffs
                    </button>
                </div>
            </div>

            {/* CONTENT AREA */}
            {loading ? (
                <div className="dk-loading-state">
                    <div className="spinner"></div>
                    <p>Loading your pricing configurations...</p>
                </div>
            ) : filteredRules.length === 0 ? (
                <div className="dk-empty-state">
                    <div className="empty-icon-wrapper">
                        <Calculator size={48} />
                    </div>
                    <h2>No Pricing Rules Configured</h2>
                    <p>You haven't set up any pricing rules for {activeTab === 'passenger' ? 'passenger transport' : 'cargo transport'}. Create a rule to start accepting bookings.</p>
                    <button className="dk-btn-outline" style={{ marginTop: '16px' }} onClick={openNew}>
                        <Plus size={18} /> Add Your First Tariff
                    </button>
                </div>
            ) : (
                <div className="dk-pricing-grid">
                    {filteredRules.map(rule => (
                        <div key={rule.id} className="dk-pricing-card box-shadow">

                            <div className="pricing-card-header">
                                <div className="rule-title-box">
                                    <div className={`rule-icon ${rule.type.toLowerCase()}`}>
                                        {getRuleIcon(rule.type)}
                                    </div>
                                    <h3>{rule.name}</h3>
                                </div>
                                <div className="action-buttons">
                                    <button className="icon-action-btn edit" onClick={() => openEdit(rule)} title="Edit Rule">
                                        <Edit2 size={16} />
                                    </button>
                                    <button className="icon-action-btn delete" onClick={() => handleDelete(rule.id, rule.name)} title="Delete Rule">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="pricing-card-body">
                                <div className="calc-type-badge">
                                    <Calculator size={14} />
                                    Calculation: <strong>{rule.type}</strong>
                                </div>

                                <div className="price-metrics">
                                    <div className="metric-row highlight">
                                        <span className="metric-label">Base / Starting Fare</span>
                                        <div className="metric-value">
                                            <span className="currency">₼</span>
                                            <span className="amount">{rule.basePrice}</span>
                                        </div>
                                    </div>

                                    {rule.type === 'PerKm' && rule.pricePerKm !== undefined && (
                                        <div className="metric-row">
                                            <span className="metric-label">Rate Per Kilometer</span>
                                            <div className="metric-value small">
                                                <span className="amount">{rule.pricePerKm}</span>
                                                <span className="unit">₼ / km</span>
                                            </div>
                                        </div>
                                    )}

                                    {(rule.type === 'Hourly' || rule.type === 'PerKm') && rule.pricePerMin !== undefined && (
                                        <div className="metric-row">
                                            <span className="metric-label">Wait Time / Per Minute</span>
                                            <div className="metric-value small">
                                                <span className="amount">{rule.pricePerMin}</span>
                                                <span className="unit">₼ / min</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}

            {/* MODAL */}
            {isModalOpen && (
                <PricingModal
                    rule={selectedRule}
                    onSave={handleSave}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedRule(null);
                    }}
                />
            )}
        </div>
    );
}