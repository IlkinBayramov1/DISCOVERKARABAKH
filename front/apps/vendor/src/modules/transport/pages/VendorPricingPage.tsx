import { useState, useEffect } from 'react';
import { transportVendorApi } from '../api/transport.api';
import type { IPricingRule } from '../types';
import { Plus, Edit, Trash2 } from 'lucide-react';
import PricingModal from '../components/PricingModal';
import './VendorTransport.css';

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
        if (selectedRule) {
            await transportVendorApi.updatePricingRule(selectedRule.id, data);
        } else {
            await transportVendorApi.createPricingRule(data);
        }
        setIsModalOpen(false);
        setSelectedRule(null);
        loadRules();
    };

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Siz "${name}" qaydasını silmək istədiyinizdən əminsiniz?`)) {
            try {
                await transportVendorApi.deletePricingRule(id);
                loadRules();
            } catch (error) {
                console.error('Failed to delete rule', error);
                alert('Silinmə xətası.');
            }
        }
    };

    const openEdit = (rule: IPricingRule) => {
        setSelectedRule(rule);
        setIsModalOpen(true);
    };

    const openNew = () => {
        // Pre-fill config with transportType so the modal knows which context we're in
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

    return (
        <div className="vendor-page-container">
            <div className="page-header flex-between mb-6">
                <div>
                    <h1>Qiymət Qaydaları (Pricing Rules)</h1>
                    <p className="text-muted">Daşımacılıq xidmətləriniz üçün qiymət tənzimləmələri.</p>
                </div>
                <button className="btn-primary flex-align-center gap-2" onClick={openNew}>
                    <Plus size={18} /> Yeni Qayda
                </button>
            </div>

            <div className="tabs-container my-4">
                <button
                    className={`tab-button ${activeTab === 'passenger' ? 'active' : ''}`}
                    onClick={() => setActiveTab('passenger')}
                >
                    <span className="flex-align-center gap-2">Sərnişin Daşıma Qiymətləri</span>
                </button>
                <button
                    className={`tab-button ${activeTab === 'cargo' ? 'active' : ''}`}
                    onClick={() => setActiveTab('cargo')}
                >
                    <span className="flex-align-center gap-2">Yük Daşıma Qiymətləri</span>
                </button>
            </div>

            {loading ? (
                <div className="flex-align-center gap-2"><span className="spinner"></span> Yüklənir...</div>
            ) : (
                <div className="grid-cards">
                    {filteredRules.map(rule => (
                        <div key={rule.id} className="pricing-card glassmorphism">
                            <div className="flex-between mb-3">
                                <h3>{rule.name}</h3>
                                <div className="flex gap-2">
                                    <button className="icon-btn-text" onClick={() => openEdit(rule)}><Edit size={16} /></button>
                                    <button className="icon-btn-text text-danger" onClick={() => handleDelete(rule.id, rule.name)}><Trash2 size={16} color="red" /></button>
                                </div>
                            </div>
                            <div className="price-details border-top pt-3">
                                <div className="price-row flex-between mb-2">
                                    <span className="text-muted">Hesablanma:</span> <strong>{rule.type}</strong>
                                </div>
                                <div className="price-row flex-between mb-2">
                                    <span className="text-muted">Baza/Açılış (₼):</span> <strong>{rule.basePrice}</strong>
                                </div>
                                {rule.pricePerKm !== undefined && (
                                    <div className="price-row flex-between mb-2">
                                        <span className="text-muted">1 KM :</span> <strong>{rule.pricePerKm} ₼</strong>
                                    </div>
                                )}
                                {rule.pricePerMin !== undefined && (
                                    <div className="price-row flex-between mb-2">
                                        <span className="text-muted">Dəqiqə :</span> <strong>{rule.pricePerMin} ₼</strong>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {filteredRules.length === 0 && (
                        <div className="empty-state text-center py-5">
                            {activeTab === 'passenger' ? 'Heç bir sərnişin' : 'Heç bir yük'} qiymət qaydası tapılmadı.
                        </div>
                    )}
                </div>
            )}

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
