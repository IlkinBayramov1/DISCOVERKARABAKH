import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import type { IPricingRule } from '../../types';
import './PricingModal.css';

interface PricingModalProps {
    rule?: IPricingRule | null;
    onSave: (data: Partial<IPricingRule>) => Promise<void>;
    onClose: () => void;
}

export default function PricingModal({ rule, onSave, onClose }: PricingModalProps) {
    const [formData, setFormData] = useState<Partial<IPricingRule>>({
        name: '',
        type: 'PerKm',
        basePrice: 0,
        pricePerKm: 0,
        pricePerMin: 0
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (rule) {
            setFormData({
                name: rule.name || '',
                type: rule.type || 'PerKm',
                basePrice: rule.basePrice || 0,
                pricePerKm: rule.pricePerKm || 0,
                pricePerMin: rule.pricePerMin || 0
            });
        }
    }, [rule]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave(formData);
        } catch (error) {
            console.error('Failed to save pricing rule', error);
            alert('Qaydanı yadda saxlamaq mümkün olmadı.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="pricing-modal-content glassmorphism-card">
                <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
                <h2>{rule ? 'Qaydanı Yenilə' : 'Yeni Qiymət Qaydası'}</h2>
                <p className="text-muted mb-4">Tarif detallarını və qaydalarını təyin edin.</p>

                <form onSubmit={handleSubmit} className="pricing-form">
                    <div className="input-group mb-3">
                        <label>Qayda Adı (məs: Hava Limanı Transferi, Ekonom Daxili)</label>
                        <input
                            type="text"
                            required
                            className="form-input"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="input-group mb-3">
                        <label>Hesablanma Tipi</label>
                        <select
                            className="form-input"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                        >
                            <option value="PerKm">Məsafəyə Görə (Per Km)</option>
                            <option value="Fixed">Sabit Qiymət (Fixed)</option>
                            <option value="Hourly">Saatlıq & Zamanla (Hourly)</option>
                        </select>
                    </div>

                    <div className="form-row flex gap-3 mb-3">
                        <div className="input-group flex-1">
                            <label>Açılış/Baza Qiyməti (₼)</label>
                            <input
                                type="number"
                                min="0" step="0.1"
                                required
                                className="form-input"
                                value={formData.basePrice}
                                onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) })}
                            />
                        </div>

                        {formData.type === 'PerKm' && (
                            <div className="input-group flex-1">
                                <label>1 KM üçün (₼)</label>
                                <input
                                    type="number"
                                    min="0" step="0.1"
                                    className="form-input"
                                    required
                                    value={formData.pricePerKm || 0}
                                    onChange={(e) => setFormData({ ...formData, pricePerKm: parseFloat(e.target.value) })}
                                />
                            </div>
                        )}

                        {(formData.type === 'Hourly' || formData.type === 'PerKm') && (
                            <div className="input-group flex-1">
                                <label>Gözləmə/Müddət (Dəqiqə üçün ₼)</label>
                                <input
                                    type="number"
                                    min="0" step="0.1"
                                    className="form-input"
                                    value={formData.pricePerMin || 0}
                                    onChange={(e) => setFormData({ ...formData, pricePerMin: parseFloat(e.target.value) })}
                                />
                            </div>
                        )}
                    </div>

                    <div className="form-actions mt-4 pt-3 border-top">
                        <button type="submit" className="btn-primary w-full flex-align-center justify-center gap-2" disabled={loading}>
                            {loading ? <span className="spinner"></span> : <><Check size={16} /> Yadda Saxla</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
