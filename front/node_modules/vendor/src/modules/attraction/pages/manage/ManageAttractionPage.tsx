import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Plus, X, UploadCloud, MapPin, Clock,
    Camera, Save, RefreshCw, DollarSign, Map as MapIcon, Shield
} from 'lucide-react';
import { vendorAttractionApi } from '../../api/attraction.api';
import { useUpload } from '../../../hotel/hooks/useUpload';
import { useAttractionCategories } from '../../hooks/useAttractionCategories';
import type { AttractionImage, AttractionImageType } from '../../types';
import './ManageAttractionPage.css';

const CITIES = ['Shusha', 'Lachin', 'Khankendi', 'Aghdam', 'Kalbajar', 'Fuzuli'];

export default function ManageAttractionPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditing = !!id;

    const { categories } = useAttractionCategories();
    const { uploadImages, uploading } = useUpload();

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        city: 'Shusha',
        address: '',
        description: '',
        category: '',
        entryType: 'free' as 'free' | 'paid' | 'donation',
        price: '',
        crowdLevel: 'medium' as 'low' | 'medium' | 'high',
        status: 'active' as 'active' | 'closed' | 'maintenance',
        latitude: '39.76',
        longitude: '46.74',
        virtualTourUrl: '',
        searchKeywords: ''
    });

    const [images, setImages] = useState<Partial<AttractionImage>[]>([]);

    const [keywords, setKeywords] = useState<string[]>([]);
    const [keywordInput, setKeywordInput] = useState('');

    const handleWorkingHourChange = (dayOfWeek: number, field: string, value: any) => {
        setWorkingHours(prev => prev.map(h =>
            h.dayOfWeek === dayOfWeek ? { ...h, [field]: value } : h
        ));
    };

    // Day 0 is Sunday, 1 is Monday ... 6 is Saturday
    const [workingHours, setWorkingHours] = useState<any[]>(
        Array.from({ length: 7 }, (_, i) => ({
            dayOfWeek: i,
            openTime: '09:00',
            closeTime: '18:00',
            isClosed: false
        }))
    );

    const [localFiles, setLocalFiles] = useState<File[]>([]);
    const [newImageUrl, setNewImageUrl] = useState('');

    useEffect(() => {
        if (isEditing) loadAttraction();
    }, [id]);

    const loadAttraction = async () => {
        try {
            setIsLoading(true);
            const res = await vendorAttractionApi.getAttractionById(id!);
            const attr = res.data;
            if (attr) {
                setFormData({
                    name: attr.name || '',
                    city: attr.city || 'Shusha',
                    address: attr.address || '',
                    description: attr.description || '',
                    category: attr.category || '',
                    entryType: attr.entryType || 'free',
                    price: attr.price?.toString() || '',
                    crowdLevel: attr.crowdLevel || 'medium',
                    status: attr.status || 'active',
                    latitude: attr.latitude?.toString() || '39.76',
                    longitude: attr.longitude?.toString() || '46.74',
                    virtualTourUrl: attr.virtualTourUrl || '',
                    searchKeywords: attr.searchKeywords || ''
                });
                setImages(attr.images || []);
                setKeywords(attr.searchKeywords ? attr.searchKeywords.split(',').filter(k => k.trim()) : []);

                if (attr.workingHours && attr.workingHours.length > 0) {
                    // Merge with defaults to ensure all 7 days are present
                    const merged = Array.from({ length: 7 }, (_, i) => {
                        const existing = attr.workingHours?.find((h: any) => h.dayOfWeek === i);
                        return existing || { dayOfWeek: i, openTime: '09:00', closeTime: '18:00', isClosed: true };
                    });
                    setWorkingHours(merged);
                }
            }
        } catch (error) {
            console.error('Failed to load attraction', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddKeyword = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && keywordInput.trim()) {
            e.preventDefault();
            if (!keywords.includes(keywordInput.trim())) {
                setKeywords([...keywords, keywordInput.trim()]);
            }
            setKeywordInput('');
        }
    };

    const removeKeyword = (idx: number) => {
        setKeywords(keywords.filter((_, i) => i !== idx));
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setLocalFiles(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const addImageUrl = () => {
        if (!newImageUrl.trim()) return;
        setImages(prev => [...prev, { url: newImageUrl.trim(), type: 'image', isCover: prev.length === 0 }]);
        setNewImageUrl('');
    };

    const removeImage = (idx: number) => {
        setImages(prev => prev.filter((_, i) => i !== idx));
    };

    const setAsCover = (idx: number) => {
        setImages(prev => prev.map((img, i) => ({ ...img, isCover: i === idx })));
    };

    const updateImageType = (idx: number, type: AttractionImageType) => {
        setImages(prev => prev.map((img, i) => i === idx ? { ...img, type } : img));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let uploadedUrls: string[] = [];
            if (localFiles.length > 0) {
                uploadedUrls = await uploadImages(localFiles);
            }

            const newImages: Partial<AttractionImage>[] = uploadedUrls.map(url => ({
                url,
                type: 'image',
                isCover: images.length === 0 && uploadedUrls.indexOf(url) === 0
            }));

            const finalImages = [...images, ...newImages];

            const payload = {
                ...formData,
                price: formData.entryType === 'free' ? 0 : parseFloat(formData.price || '0'),
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude),
                searchKeywords: keywords.join(','),
                images: finalImages,
                workingHours: workingHours.map(h => ({
                    dayOfWeek: h.dayOfWeek,
                    openTime: h.isClosed ? null : h.openTime,
                    closeTime: h.isClosed ? null : h.closeTime,
                    isClosed: h.isClosed
                }))
            };

            if (isEditing) {
                await vendorAttractionApi.updateAttraction(id!, payload as any);
            } else {
                await vendorAttractionApi.createAttraction(payload as any);
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => navigate('/attractions'), 800);
        } catch (error: any) {
            alert(`Xəta baş verdi: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const getFullImageUrl = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http') || url.startsWith('blob:')) return url;
        const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:4004';
        return `${baseUrl}/${url.startsWith('/') ? url.slice(1) : url}`;
    };

    if (isLoading && isEditing && !formData.name) {
        return (
            <div className="dk-ma-loading-screen">
                <RefreshCw size={48} className="spin-icon" />
                <p>Məkan məlumatları yüklənir...</p>
            </div>
        );
    }

    return (
        <div className="dk-ma-layout">
            <div className="dk-ma-container">

                {/* HEADER */}
                <header className="dk-ma-header">
                    <button onClick={() => navigate('/attractions')} className="dk-btn-back">
                        İdarəetmə Panelinə Qayıt
                    </button>
                    <div className="header-title-row">
                        <div>
                            <h1>{isEditing ? 'Məkanı Redaktə Et' : 'Yeni Məkan Yarat'}</h1>
                            <p>Turistlər üçün cəlbedici və dəqiq məlumatlar daxil edin.</p>
                        </div>
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="dk-ma-form">

                    {/* SECTION 1: IDENTITY */}
                    <div className="dk-form-card">
                        <h2 className="card-title"><MapIcon size={18} /> Əsas Məlumatlar</h2>

                        <div className="dk-input-group">
                            <label>Məkanın Adı</label>
                            <input
                                name="name" className="dk-input main-input"
                                value={formData.name} onChange={handleChange}
                                required placeholder="Məsələn: Şuşa Qalası"
                            />
                        </div>

                        <div className="dk-grid-2">
                            <div className="dk-input-group">
                                <label>Kateqoriya</label>
                                <select required name="category" className="dk-input" value={formData.category} onChange={handleChange}>
                                    <option value="">Seçin...</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="dk-input-group">
                                <label>İnsan Sıxlığı (Mövsümi)</label>
                                <select name="crowdLevel" className="dk-input" value={formData.crowdLevel} onChange={handleChange}>
                                    <option value="low">Aşşağı (Sakit)</option>
                                    <option value="medium">Orta</option>
                                    <option value="high">Yüksək (Sıx)</option>
                                </select>
                            </div>
                        </div>

                        <div className="dk-input-group mt-5">
                            <label>Təsvir (Ətraflı məlumat)</label>
                            <textarea
                                name="description" className="dk-input textarea"
                                value={formData.description} onChange={handleChange}
                                required rows={4} placeholder="Məkan haqqında maraqlı faktlar, tarixi və s."
                            />
                        </div>

                        <div className="dk-input-group mt-5">
                            <label>Axtarış Açar Sözləri</label>
                            <div className="dk-tag-adder">
                                <input
                                    className="dk-input" placeholder="Açar sözü yazıb Enter basın (məs: qala, tarixi)..."
                                    value={keywordInput} onChange={e => setKeywordInput(e.target.value)}
                                    onKeyDown={handleAddKeyword}
                                />
                            </div>
                            <div className="dk-tags-container mt-3">
                                {keywords.map((k, idx) => (
                                    <div key={idx} className="dk-tag-pill info">
                                        <span>{k}</span>
                                        <button type="button" onClick={() => removeKeyword(idx)}><X size={14} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: LOCATION & ACCESS */}
                    <div className="dk-form-card">
                        <h2 className="card-title"><MapPin size={18} /> Məkan və Giriş</h2>

                        <div className="dk-grid-2">
                            <div className="dk-input-group">
                                <label>Şəhər / Rayon</label>
                                <select required name="city" className="dk-input" value={formData.city} onChange={handleChange}>
                                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="dk-input-group">
                                <label>Dəqiq Ünvan</label>
                                <input
                                    name="address" className="dk-input"
                                    value={formData.address} onChange={handleChange}
                                    required placeholder="Məsələn: Qala küçəsi 12"
                                />
                            </div>
                        </div>

                        <div className="dk-grid-2 mt-5">
                            <div className="dk-input-group">
                                <label>Giriş Növü</label>
                                <select name="entryType" className="dk-input" value={formData.entryType} onChange={handleChange}>
                                    <option value="free">Pulsuz (İctimai)</option>
                                    <option value="paid">Ödənişli</option>
                                    <option value="donation">İanə Əsaslı</option>
                                </select>
                            </div>
                            {formData.entryType !== 'free' && (
                                <div className="dk-input-group animate-fade-in">
                                    <label className="text-emerald-600"><DollarSign size={14} /> Qiymət (AZN)</label>
                                    <input
                                        type="number" step="0.01" name="price" className="dk-input font-bold text-emerald-600"
                                        value={formData.price} onChange={handleChange} placeholder="0.00"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="dk-grid-2 mt-5">
                            <div className="dk-input-group">
                                <label>Enlik (Latitude)</label>
                                <input type="number" step="any" name="latitude" className="dk-input" value={formData.latitude} onChange={handleChange} />
                            </div>
                            <div className="dk-input-group">
                                <label>Uzunluq (Longitude)</label>
                                <input type="number" step="any" name="longitude" className="dk-input" value={formData.longitude} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2.5: WORKING HOURS */}
                    <div className="dk-form-card">
                        <h2 className="card-title"><Clock size={18} /> İş Saatları (Visiting Hours)</h2>
                        <p className="card-subtitle-inner">Həftəlik iş qrafikini və istirahət günlərini qeyd edin.</p>

                        <div className="dk-working-hours-list">
                            {[1, 2, 3, 4, 5, 6, 0].map(dayIdx => {
                                const dayName = ['Bazar', 'Bazar ertəsi', 'Çərşənbə axşamı', 'Çərşənbə', 'Cümə axşamı', 'Cümə', 'Şənbə'][dayIdx];
                                const h = workingHours.find(wh => wh.dayOfWeek === dayIdx) || { dayOfWeek: dayIdx, openTime: '09:00', closeTime: '18:00', isClosed: false };

                                return (
                                    <div key={dayIdx} className={`dk-wh-row ${h.isClosed ? 'is-closed' : ''}`}>
                                        <div className="day-name">{dayName}</div>

                                        <div className="wh-controls">
                                            <label className="dk-checkbox-wrap">
                                                <input
                                                    type="checkbox"
                                                    checked={h.isClosed}
                                                    onChange={(e) => handleWorkingHourChange(dayIdx, 'isClosed', e.target.checked)}
                                                />
                                                <span>Bağlıdır</span>
                                            </label>

                                            {!h.isClosed && (
                                                <div className="time-inputs animate-fade-in">
                                                    <input
                                                        type="time" className="dk-input-small"
                                                        value={h.openTime}
                                                        onChange={(e) => handleWorkingHourChange(dayIdx, 'openTime', e.target.value)}
                                                    />
                                                    <span className="dash">-</span>
                                                    <input
                                                        type="time" className="dk-input-small"
                                                        value={h.closeTime}
                                                        onChange={(e) => handleWorkingHourChange(dayIdx, 'closeTime', e.target.value)}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* SECTION 3: MEDIA & VR */}
                    <div className="dk-form-card">
                        <h2 className="card-title"><Camera size={18} /> Visual Media & Virtual Tur</h2>

                        <div className="dk-input-group mb-6">
                            <label>Xarici VR Tur Linki (Matterport, YouTube 360 və s.)</label>
                            <input
                                name="virtualTourUrl" className="dk-input"
                                value={formData.virtualTourUrl} onChange={handleChange}
                                placeholder="https://matterport.com/..."
                            />
                        </div>

                        <div className="dk-media-uploader-row">
                            <div className="dk-input-group flex-1">
                                <label>Şəkil Linki Əlavə Et (URL)</label>
                                <div className="dk-input-action-wrap">
                                    <input
                                        className="dk-input" placeholder="https://..."
                                        value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)}
                                    />
                                    <button type="button" className="btn-inline-add" onClick={addImageUrl}><Plus size={18} /></button>
                                </div>
                            </div>

                            <label className="dk-file-dropzone-small">
                                <UploadCloud size={24} className="text-blue-500 mb-1" />
                                <span>Kompüterdən Yüklə</span>
                                <input type="file" multiple accept="image/*" onChange={handleFileSelect} disabled={uploading} hidden />
                            </label>
                        </div>

                        <div className="dk-media-grid mt-6">
                            {images.map((img, idx) => (
                                <div key={`exist-${idx}`} className={`dk-media-item ${img.isCover ? 'is-cover' : ''}`}>
                                    <img src={getFullImageUrl(img.url!)} alt={`Preview ${idx}`} />

                                    <div className="media-top-actions">
                                        {img.isCover && <span className="badge-cover">COVER</span>}
                                        {img.type === '360_image' && <span className="badge-360">360°</span>}
                                        {img.type === 'vr_tour' && <span className="badge-vr">VR</span>}
                                        <button type="button" className="btn-remove-media" onClick={() => removeImage(idx)}><X size={14} strokeWidth={3} /></button>
                                    </div>

                                    <div className="media-bottom-controls">
                                        <button type="button" className="btn-set-cover" onClick={() => setAsCover(idx)}>Kaver Et</button>
                                        <select
                                            className="select-media-type"
                                            value={img.type}
                                            onChange={(e) => updateImageType(idx, e.target.value as AttractionImageType)}
                                        >
                                            <option value="image">Normal</option>
                                            <option value="360_image">360°</option>
                                            <option value="vr_tour">VR</option>
                                        </select>
                                    </div>
                                </div>
                            ))}

                            {localFiles.map((file, idx) => (
                                <div key={`local-${idx}`} className="dk-media-item local">
                                    <img src={URL.createObjectURL(file)} alt="Local preview" />
                                    <div className="media-top-actions">
                                        <button type="button" className="btn-remove-media" onClick={() => setLocalFiles(prev => prev.filter((_, i) => i !== idx))}><X size={14} strokeWidth={3} /></button>
                                    </div>
                                    <div className="media-overlay-loading">
                                        <UploadCloud size={20} className="animate-pulse text-white" />
                                        <span>Gözləyir</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SECTION 4: STATUS */}
                    <div className="dk-form-card mb-10">
                        <h2 className="card-title"><Shield size={18} /> Vəziyyət / İdarəetmə</h2>
                        <div className="dk-input-group max-w-sm">
                            <label>Məkanın Platformadakı Statusu</label>
                            <select name="status" className="dk-input font-bold" value={formData.status} onChange={handleChange}>
                                <option value="active">Aktiv (Siyahıda görünür)</option>
                                <option value="closed">Müvəqqəti Qapalı</option>
                                <option value="maintenance">Təmirdə</option>
                            </select>
                        </div>
                    </div>

                    {/* STICKY FOOTER */}
                    <div className="dk-form-footer">
                        <button type="button" onClick={() => navigate('/attractions')} className="dk-btn-ghost">
                            Ləğv Et
                        </button>
                        <button type="submit" className="dk-btn-submit" disabled={isLoading || uploading}>
                            {uploading || isLoading ? (
                                <><RefreshCw size={20} className="spin-icon" /> Gözləyin...</>
                            ) : (
                                <><Save size={20} /> {isEditing ? 'Dəyişiklikləri Saxla' : 'Məkanı Təsdiqlə'}</>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}