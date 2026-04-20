import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    Plus, X, UploadCloud, MapPin, 
    Info, Camera, Compass
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

    // Data Fetching Hooks
    const { categories } = useAttractionCategories();
    const { uploadImages, uploading } = useUpload();

    // Form State
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        city: 'Shusha',
        address: '',
        description: '',
        categoryId: '',
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
    
    // Media Upload Local State
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
                    categoryId: attr.categoryId || '',
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
            // 1. Upload new files if any
            let uploadedUrls: string[] = [];
            if (localFiles.length > 0) {
                uploadedUrls = await uploadImages(localFiles);
            }

            // 2. Combine with existing and map to AttractionImage structure
            const newImages: Partial<AttractionImage>[] = uploadedUrls.map(url => ({
                url,
                type: 'image',
                isCover: images.length === 0 && uploadedUrls.indexOf(url) === 0
            }));

            const finalImages = [...images, ...newImages];
            
            // 3. Construct Payload
            const payload = {
                ...formData,
                price: formData.entryType === 'free' ? 0 : parseFloat(formData.price || '0'),
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude),
                searchKeywords: keywords.join(','),
                images: finalImages
            };

            if (isEditing) {
                await vendorAttractionApi.updateAttraction(id!, payload as any);
            } else {
                await vendorAttractionApi.createAttraction(payload as any);
            }

            navigate('/vendor/attractions');
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

    return (
        <div className="manage-attraction-page">
            <header className="page-header">
                <div>
                    <h1>{isEditing ? 'Məkanı Redaktə Et' : 'Yeni Məkan Yarat'}</h1>
                    <p>Turistlər üçün cəlbedici və dəqiq məlumatlar daxil edin.</p>
                </div>
                <button className="btn-action" onClick={() => navigate('/vendor/attractions')}>Ləğv Et</button>
            </header>

            <form className="attraction-form-container" onSubmit={handleSubmit}>
                {/* 1. Basic Info */}
                <section className="form-section">
                    <h3><Info size={18} /> Əsas Məlumatlar</h3>
                    <div className="form-group">
                        <label>Məkanın Adı</label>
                        <input 
                            required name="name" value={formData.name} onChange={handleChange}
                            placeholder="Məsələn: Şuşa Qalası" 
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Kateqoriya</label>
                            <select required name="categoryId" value={formData.categoryId} onChange={handleChange}>
                                <option value="">Seçin...</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>İnsan Sıxlığı</label>
                            <select name="crowdLevel" value={formData.crowdLevel} onChange={handleChange}>
                                <option value="low">Aşşağı (Sakit)</option>
                                <option value="medium">Orta</option>
                                <option value="high">Yüksək (Sıx)</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Təsvir (Ətraflı məlumat)</label>
                        <textarea 
                            required name="description" value={formData.description} onChange={handleChange}
                            placeholder="Məkan haqqında maraqlı faktlar, tarixi və s." rows={5}
                        />
                    </div>
                    <div className="form-group">
                        <label>Açar Sözlər (Axtarış üçün)</label>
                        <div className="keywords-input-wrapper">
                            {keywords.map((k, idx) => (
                                <span key={idx} className="keyword-tag">
                                    {k} <button type="button" onClick={() => removeKeyword(idx)}><X size={12} /></button>
                                </span>
                            ))}
                            <input 
                                placeholder="Söz yazıb Enter basın..."
                                value={keywordInput}
                                onChange={(e) => setKeywordInput(e.target.value)}
                                onKeyDown={handleAddKeyword}
                            />
                        </div>
                        <p className="field-hint">Məsələn: qala, tarixi, panorama, karabağ</p>
                    </div>
                </section>

                {/* 2. Media & Virtual Tour */}
                <section className="form-section">
                    <h3><Camera size={18} /> Media və Virtual Tur</h3>
                    <div className="image-management">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Şəkil Linki (URL)</label>
                                <div className="input-with-button">
                                    <input 
                                        placeholder="https://..." 
                                        value={newImageUrl} 
                                        onChange={(e) => setNewImageUrl(e.target.value)}
                                    />
                                    <button type="button" onClick={addImageUrl}><Plus size={18} /></button>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Kompüterdən Yüklə</label>
                                <label className="btn-action" style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>
                                    <UploadCloud size={18} style={{ marginRight: 8 }} /> Şəkilləri Seçin
                                    <input type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handleFileSelect} />
                                </label>
                            </div>
                        </div>

                        {/* External VR link */}
                        <div className="form-group">
                            <label>Xarici VR Tur Linki (Matterport, YouTube 360 və s.)</label>
                            <input 
                                name="virtualTourUrl" value={formData.virtualTourUrl} onChange={handleChange}
                                placeholder="https://matterport.com/..." 
                            />
                        </div>

                        <div className="image-grid">
                            {images.map((img, idx) => (
                                <div key={idx} className={`image-item ${img.isCover ? 'is-cover' : ''}`}>
                                    <img src={getFullImageUrl(img.url!)} alt="Preview" />
                                    <div className="image-overlay">
                                        <button type="button" className="btn-cover" onClick={() => setAsCover(idx)}>Cover</button>
                                        <button type="button" className="btn-remove" onClick={() => removeImage(idx)}><X size={14} /></button>
                                    </div>
                                    <div className="image-type-selector">
                                        <select 
                                            value={img.type} 
                                            onChange={(e) => updateImageType(idx, e.target.value as AttractionImageType)}
                                        >
                                            <option value="image">Normal Şəkil</option>
                                            <option value="360_image">360° Şəkil</option>
                                            <option value="vr_tour">VR Tur</option>
                                        </select>
                                    </div>
                                    {img.isCover && <span className="cover-badge">KAVER</span>}
                                    {img.type === '360_image' && <span className="cover-badge" style={{ left: 'auto', right: 8, background: '#8b5cf6' }}>360</span>}
                                    {img.type === 'vr_tour' && <span className="cover-badge" style={{ left: 'auto', right: 8, background: '#ec4899' }}>VR</span>}
                                </div>
                            ))}
                            {localFiles.map((file, idx) => (
                                <div key={`local-${idx}`} className="image-item" style={{ opacity: 0.6 }}>
                                    <img src={URL.createObjectURL(file)} alt="Local" />
                                    <div className="image-overlay">
                                        <button type="button" className="btn-remove" onClick={() => setLocalFiles(prev => prev.filter((_, i) => i !== idx))}><X size={14} /></button>
                                    </div>
                                    <span className="cover-badge" style={{ background: '#64748b' }}>YÜKLƏNİR</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 3. Location */}
                <section className="form-section">
                    <h3><MapPin size={18} /> Məkan və Giriş</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Şəhər / Rayon</label>
                            <select required name="city" value={formData.city} onChange={handleChange}>
                                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Dəqiq Ünvan</label>
                            <input required name="address" value={formData.address} onChange={handleChange} placeholder="Məsələn: Qala küçəsi 12" />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Giriş Növü</label>
                            <select name="entryType" value={formData.entryType} onChange={handleChange}>
                                <option value="free">Pulsuz</option>
                                <option value="paid">Ödənişli</option>
                                <option value="donation">İanə</option>
                            </select>
                        </div>
                        {formData.entryType !== 'free' && (
                            <div className="form-group">
                                <label>Qiymət (AZN)</label>
                                <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} placeholder="0.00" />
                            </div>
                        )}
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Enlik (Latitude)</label>
                            <input type="number" step="any" name="latitude" value={formData.latitude} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Uzunluq (Longitude)</label>
                            <input type="number" step="any" name="longitude" value={formData.longitude} onChange={handleChange} />
                        </div>
                    </div>
                </section>

                {/* 4. Status */}
                <section className="form-section">
                    <h3><Compass size={18} /> Vəziyyət</h3>
                    <div className="form-group">
                        <label>Məkanın Statusu</label>
                        <select name="status" value={formData.status} onChange={handleChange}>
                            <option value="active">Aktiv (Siyahıda görünür)</option>
                            <option value="closed">Müvəqqəti Qapalı</option>
                            <option value="maintenance">Təmirdə</option>
                        </select>
                    </div>
                </section>

                {/* Sticky Actions */}
                <div className="form-actions">
                    <button type="button" className="btn-action" onClick={() => navigate('/vendor/attractions')}>Ləğv Et</button>
                    <button type="submit" className="btn-submit" disabled={isLoading || uploading}>
                        {uploading ? 'Media Yüklənir...' : (isLoading ? 'Yadda Saxlanılır...' : (isEditing ? 'Yadda Saxla' : 'Məkanı Yarat'))}
                    </button>
                </div>
            </form>
        </div>
    );
}
