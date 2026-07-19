import React, { useState } from 'react';
import { X, CheckCircle, Car, Edit2, UploadCloud, Trash2, RotateCcw, AlertTriangle, Loader, Calendar } from 'lucide-react';
import { useAssignDriverVehicle, useDrivers, useUpdateDriverLicense, useUploadImages } from '../../hooks/useDrivers';
import { useVehicles } from '../../hooks/useVehicles';
import type { IDriverProfile, UpdateDriverLicenseRequest } from '../../types';
import { LICENSE_CATEGORIES, Lightbox, type LicenseCategory } from '@dk/ui';
import './DriverModal.css';

interface DriverModalProps {
    driver: IDriverProfile;
    onClose: () => void;
    onStatusChange: (status: string) => void;
}

interface UploadItem {
    id: string;
    file: File | null;
    status: 'uploading' | 'failed' | 'success';
    url?: string;
}

export default function DriverModal({ driver, onClose, onStatusChange }: DriverModalProps) {
    const { data: vehicles = [], isLoading: isLoadingVehicles } = useVehicles();
    const { data: allDrivers = [] } = useDrivers();
    const { mutate: assignVehicle, isPending: isAssigning } = useAssignDriverVehicle();
    const { mutateAsync: uploadImagesAsync } = useUploadImages();
    const { mutateAsync: updateLicenseAsync, isPending: isSavingLicense } = useUpdateDriverLicense();

    // Mode state
    const [isEditing, setIsEditing] = useState(false);

    // Edit Form State
    const [licenseNumber, setLicenseNumber] = useState(driver.licenseNumber || '');
    const [licenseExpiryDate, setLicenseExpiryDate] = useState(() => {
        if (!driver.licenseExpiryDate) return '';
        const d = new Date(driver.licenseExpiryDate);
        if (isNaN(d.getTime())) return '';
        return d.toISOString().split('T')[0];
    });
    const [selectedCategories, setSelectedCategories] = useState<LicenseCategory[]>(driver.licenseCategories || []);

    // File Upload States
    const initUploads = (urls?: string[]): UploadItem[] => {
        return (urls || []).map(url => ({
            id: url,
            file: null,
            status: 'success',
            url
        }));
    };

    const [licenseUploads, setLicenseUploads] = useState<UploadItem[]>(() => initUploads(driver.licenseImages));
    const [idCardUploads, setIdCardUploads] = useState<UploadItem[]>(() => initUploads(driver.idCardImages));

    // Lightbox states
    const [lightboxImages, setLightboxImages] = useState<string[]>([]);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [showLightbox, setShowLightbox] = useState(false);

    const [selectedVehicleId, setSelectedVehicleId] = useState<string>(driver.currentVehicleId || '');

    // Find taken vehicles
    const takenVehicleIds = (allDrivers || [])
        .filter(d => d.id !== driver.id && d.currentVehicleId)
        .map(d => d.currentVehicleId);

    const handleAssign = () => {
        assignVehicle({
            id: driver.id,
            vehicleId: selectedVehicleId || null
        }, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    // Category Change Handler
    const handleCategoryChange = (category: LicenseCategory) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    // Parallel File Uploader with Validation
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, type: 'license' | 'idCard') => {
        if (!e.target.files || e.target.files.length === 0) return;
        const files = Array.from(e.target.files);
        const targetUploads = type === 'license' ? licenseUploads : idCardUploads;
        const setTargetUploads = type === 'license' ? setLicenseUploads : setIdCardUploads;

        // Validation: Max files 5
        if (targetUploads.length + files.length > 5) {
            alert('Hər sənəd növü üçün maksimum 5 şəkil yükləyə bilərsiniz.');
            return;
        }

        // Validation: File size limit 5MB
        const invalidSize = files.some(file => file.size > 5 * 1024 * 1024);
        if (invalidSize) {
            alert('Yüklənən faylın ölçüsü maksimum 5MB ola bilər.');
            return;
        }

        // Validation: File extension check
        const allowedExtensions = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        const invalidFormat = files.some(file => !allowedExtensions.includes(file.type));
        if (invalidFormat) {
            alert('Yalnız JPG, JPEG, PNG və WEBP şəkil formatları dəstəklənir.');
            return;
        }

        // Map files to local state items as 'uploading'
        const newItems: UploadItem[] = files.map(file => ({
            id: Math.random().toString(36).substring(2, 9),
            file,
            status: 'uploading'
        }));

        setTargetUploads(prev => [...prev, ...newItems]);

        // Upload in parallel
        await Promise.all(
            newItems.map(async (item) => {
                try {
                    const urls = await uploadImagesAsync([item.file!]);
                    if (urls && urls[0]) {
                        setTargetUploads(prev =>
                            prev.map(p => p.id === item.id ? { ...p, status: 'success', url: urls[0] } : p)
                        );
                    } else {
                        throw new Error('No url returned');
                    }
                } catch (err) {
                    setTargetUploads(prev =>
                        prev.map(p => p.id === item.id ? { ...p, status: 'failed' } : p)
                    );
                }
            })
        );
        e.target.value = '';
    };

    // Retry Failed Upload
    const handleRetry = async (itemId: string, type: 'license' | 'idCard') => {
        const targetUploads = type === 'license' ? licenseUploads : idCardUploads;
        const setTargetUploads = type === 'license' ? setLicenseUploads : setIdCardUploads;
        const item = targetUploads.find(i => i.id === itemId);
        if (!item || !item.file) return;

        setTargetUploads(prev =>
            prev.map(p => p.id === itemId ? { ...p, status: 'uploading' } : p)
        );

        try {
            const urls = await uploadImagesAsync([item.file]);
            if (urls && urls[0]) {
                setTargetUploads(prev =>
                    prev.map(p => p.id === itemId ? { ...p, status: 'success', url: urls[0] } : p)
                );
            } else {
                throw new Error('Upload error');
            }
        } catch (err) {
            setTargetUploads(prev =>
                prev.map(p => p.id === itemId ? { ...p, status: 'failed' } : p)
            );
        }
    };

    // Remove file (from state)
    const handleRemove = (itemId: string, type: 'license' | 'idCard') => {
        const setTargetUploads = type === 'license' ? setLicenseUploads : setIdCardUploads;
        setTargetUploads(prev => prev.filter(p => p.id !== itemId));
    };

    // Form Submission & Validation
    const handleSaveLicense = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Validation
        if (!licenseNumber.trim()) {
            alert('Vəsiqə nömrəsi daxil edilməlidir.');
            return;
        }

        if (!licenseExpiryDate) {
            alert('Vəsiqənin bitmə tarixi daxil edilməlidir.');
            return;
        }

        const selectedDate = new Date(licenseExpiryDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
            alert('Bitmə tarixi keçmiş zaman ola bilməz.');
            return;
        }

        if (selectedCategories.length === 0) {
            alert('Ən azı 1 vəsiqə kateqoriyası seçilməlidir.');
            return;
        }

        const finalLicenseImages = licenseUploads.filter(i => i.status === 'success').map(i => i.url!);
        const finalIdCardImages = idCardUploads.filter(i => i.status === 'success').map(i => i.url!);

        if (finalLicenseImages.length === 0) {
            alert('Ən azı 1 sürücülük vəsiqəsi şəkli yüklənməlidir.');
            return;
        }

        // Timezone Buffer: end of local day converted to UTC
        const dateWithBuffer = new Date(licenseExpiryDate);
        dateWithBuffer.setHours(23, 59, 59, 999);
        const isoExpiryDate = dateWithBuffer.toISOString();

        const payload: UpdateDriverLicenseRequest = {
            licenseNumber: licenseNumber.trim(),
            licenseExpiryDate: isoExpiryDate,
            licenseCategories: selectedCategories,
            licenseImages: finalLicenseImages,
            idCardImages: finalIdCardImages
        };

        try {
            await updateLicenseAsync({
                id: driver.id,
                data: payload
            });
            setIsEditing(false);
        } catch (err: any) {
            console.error(err);
            alert('Vəsiqə məlumatları yadda saxlanılarkən xəta baş verdi: ' + (err.message || 'Naməlum xəta.'));
        }
    };

    const handleOpenLightbox = (images: string[], index: number) => {
        setLightboxImages(images);
        setLightboxIndex(index);
        setShowLightbox(true);
    };

    const isUploadingAny = [...licenseUploads, ...idCardUploads].some(i => i.status === 'uploading');

    return (
        <div className="modal-overlay">
            <div className="modal-content glassmorphism">
                <button className="close-btn" onClick={onClose}><X size={20} /></button>

                <div className="modal-header">
                    <h2 className="modal-header__title">{isEditing ? 'Vəsiqə Məlumatlarını Redaktə Et' : 'Sürücü Profili'}</h2>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="edit-btn"
                        >
                            <Edit2 size={13} /> Redaktə Et
                        </button>
                    )}
                </div>

                <div className="modal-form">

                    {!isEditing ? (
                        <>
                            <p className="text-muted">Sürücüyə dair detallar və tənzimləmələr.</p>

                            <div className="info-grid">
                                <div className="info-card">
                                    <span className="info-card__label">Ad Soyad</span>
                                    <div className="info-card__value">{driver.firstName} {driver.lastName}</div>
                                </div>
                                <div className="info-card">
                                    <span className="info-card__label">Əlaqə / Telefon</span>
                                    <div className="info-card__value">{driver.phone}</div>
                                </div>
                                <div className="info-card">
                                    <span className="info-card__label">Cari Status</span>
                                    <span className={`status-badge ${driver.status.toLowerCase()}`}>{driver.status}</span>
                                </div>
                                <div className="info-card">
                                    <span className="info-card__label">Vəsiqə (ŞN)</span>
                                    <div className="info-card__value info-card__value--mono">{driver.licenseNumber}</div>
                                </div>
                                <div className="info-card">
                                    <span className="info-card__label">Bitmə Tarixi</span>
                                    <div className="info-card__value info-card__value--flex">
                                        <Calendar size={14} className="doc-gallery__icon" />
                                        {driver.licenseExpiryDate ? new Date(driver.licenseExpiryDate).toLocaleDateString('az-AZ') : 'Təyin edilməyib'}
                                    </div>
                                </div>
                                <div className="info-card">
                                    <span className="info-card__label">Kateqoriyalar</span>
                                    <div className="category-tags">
                                        {driver.licenseCategories && driver.licenseCategories.length > 0 ? (
                                            driver.licenseCategories.map(cat => (
                                                <span key={cat} className="category-tag">
                                                    {cat}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="category-tag--empty">Təyin edilməyib</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Document Previews Qalereyası */}
                            <div className="doc-gallery">
                                <div>
                                    <h4 className="doc-gallery__title">Sürücülük Vəsiqəsi Şəkilləri</h4>
                                    {driver.licenseImages && driver.licenseImages.length > 0 ? (
                                        <div className="doc-gallery__grid">
                                            {driver.licenseImages.map((img, idx) => (
                                                <div
                                                    key={idx}
                                                    className="doc-gallery__item"
                                                    onClick={() => handleOpenLightbox(driver.licenseImages || [], idx)}
                                                >
                                                    <img src={img} alt="Driver License" className="doc-gallery__item-img" />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="doc-gallery__empty">Yüklənmiş vəsiqə şəkli yoxdur.</div>
                                    )}
                                </div>

                                <div>
                                    <h4 className="doc-gallery__title">Şəxsiyyət Vəsiqəsi Şəkilləri</h4>
                                    {driver.idCardImages && driver.idCardImages.length > 0 ? (
                                        <div className="doc-gallery__grid">
                                            {driver.idCardImages.map((img, idx) => (
                                                <div
                                                    key={idx}
                                                    className="doc-gallery__item"
                                                    onClick={() => handleOpenLightbox(driver.idCardImages || [], idx)}
                                                >
                                                    <img src={img} alt="ID Card" className="doc-gallery__item-img" />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="doc-gallery__empty">Yüklənmiş şəxsiyyət vəsiqəsi şəkli yoxdur.</div>
                                    )}
                                </div>
                            </div>

                            {driver.status === 'Pending' && (
                                <div className="action-row">
                                    <button
                                        className="v-btn-approve"
                                        onClick={() => onStatusChange('Approved')}
                                    >
                                        <CheckCircle size={18} /> <span>İcazə Ver</span>
                                    </button>
                                    <button
                                        className="v-btn-reject"
                                        onClick={() => onStatusChange('Rejected')}
                                    >
                                        <X size={18} /> <span>İmtina Et</span>
                                    </button>
                                </div>
                            )}

                            {driver.status === 'Approved' && (
                                <div className="assignment-panel">
                                    <h3 className="assignment-panel__title">
                                        <Car size={18} /> Nəqliyyat Təyinatı
                                    </h3>

                                    {isLoadingVehicles ? (
                                        <div className="assignment-panel__loading">Maşın bazası yüklənir...</div>
                                    ) : (
                                        <div className="assignment-panel__form">
                                            <select
                                                value={selectedVehicleId}
                                                onChange={(e) => setSelectedVehicleId(e.target.value)}
                                                className="form-input"
                                            >
                                                <option value="">-- Maşın seçilməyib / Boşdadır --</option>
                                                {vehicles.map(v => {
                                                    const isTaken = takenVehicleIds.includes(v.id);
                                                    return (
                                                        <option
                                                            key={v.id}
                                                            value={v.id}
                                                            className={isTaken ? 'option-taken' : ''}
                                                        >
                                                            {v.brand} {v.model} • [{v.plateNumber}] {isTaken ? '(MƏŞĞULDUR)' : ''}
                                                        </option>
                                                    );
                                                })}
                                            </select>

                                            <button
                                                className="v-btn-primary w-full"
                                                onClick={handleAssign}
                                                disabled={isAssigning}
                                            >
                                                <span>{isAssigning ? 'Yadda Saxlanılır...' : 'Təyinatı Təsdiqlə'}</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        <form onSubmit={handleSaveLicense} className="space-y-4">
                            <div className="form-group">
                                <label className="form-group__label form-group__label--required">Vəsiqə Nömrəsi (ŞN) *</label>
                                <input
                                    type="text"
                                    value={licenseNumber}
                                    onChange={(e) => setLicenseNumber(e.target.value)}
                                    className="form-input"
                                    placeholder="AZE1234567"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-group__label form-group__label--required">Bitmə Tarixi *</label>
                                <input
                                    type="date"
                                    value={licenseExpiryDate}
                                    min={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => setLicenseExpiryDate(e.target.value)}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-group__label">Vəsiqə Kateqoriyaları *</label>
                                <div className="category-selector">
                                    {LICENSE_CATEGORIES.map(cat => {
                                        const isSelected = selectedCategories.includes(cat);
                                        return (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => handleCategoryChange(cat)}
                                                className={`category-selector__btn ${isSelected ? "category-selector__btn--active" : ""
                                                    }`}
                                            >
                                                {cat}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Sürücülük vəsiqəsi yükləmə hissəsi */}
                            <div className="form-group">
                                <label className="form-group__label">Sürücülük Vəsiqəsi Şəkilləri (Maks 5) *</label>
                                <div className="upload-area">
                                    {licenseUploads.map((item) => (
                                        <div key={item.id} className="upload-item">
                                            {item.status === 'success' && item.url && (
                                                <>
                                                    <img src={item.url} alt="License" className="doc-gallery__item-img" />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemove(item.id, 'license')}
                                                        className="upload-item__remove"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </>
                                            )}
                                            {item.status === 'uploading' && (
                                                <div className="upload-item__loading">
                                                    <Loader className="upload-item__loading-spinner" size={20} />
                                                </div>
                                            )}
                                            {item.status === 'failed' && (
                                                <div className="upload-item__error">
                                                    <AlertTriangle className="upload-item__error-icon" size={16} />
                                                    <div className="upload-item__error-actions">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRetry(item.id, 'license')}
                                                            className="upload-item__error-btn upload-item__error-btn--retry"
                                                        >
                                                            <RotateCcw size={10} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemove(item.id, 'license')}
                                                            className="upload-item__error-btn upload-item__error-btn--remove"
                                                        >
                                                            <X size={10} />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {licenseUploads.length < 5 && (
                                        <label className="upload-trigger">
                                            <UploadCloud size={20} />
                                            <span className="upload-trigger__text">Şəkil Seç</span>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={(e) => handleFileSelect(e, 'license')}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* Şəxsiyyət vəsiqəsi yükləmə hissəsi */}
                            <div className="form-group">
                                <label className="form-group__label">Şəxsiyyət Vəsiqəsi Şəkilləri (Maks 5, Könüllü)</label>
                                <div className="upload-area">
                                    {idCardUploads.map((item) => (
                                        <div key={item.id} className="upload-item">
                                            {item.status === 'success' && item.url && (
                                                <>
                                                    <img src={item.url} alt="ID Card" className="doc-gallery__item-img" />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemove(item.id, 'idCard')}
                                                        className="upload-item__remove"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </>
                                            )}
                                            {item.status === 'uploading' && (
                                                <div className="upload-item__loading">
                                                    <Loader className="upload-item__loading-spinner" size={20} />
                                                </div>
                                            )}
                                            {item.status === 'failed' && (
                                                <div className="upload-item__error">
                                                    <AlertTriangle className="upload-item__error-icon" size={16} />
                                                    <div className="upload-item__error-actions">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRetry(item.id, 'idCard')}
                                                            className="upload-item__error-btn upload-item__error-btn--retry"
                                                        >
                                                            <RotateCcw size={10} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemove(item.id, 'idCard')}
                                                            className="upload-item__error-btn upload-item__error-btn--remove"
                                                        >
                                                            <X size={10} />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {idCardUploads.length < 5 && (
                                        <label className="upload-trigger">
                                            <UploadCloud size={20} />
                                            <span className="upload-trigger__text">Şəkil Seç</span>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={(e) => handleFileSelect(e, 'idCard')}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="v-btn-outline"
                                    onClick={() => {
                                        // Reset state and cancel
                                        setLicenseNumber(driver.licenseNumber || '');
                                        setLicenseExpiryDate(() => {
                                            if (!driver.licenseExpiryDate) return '';
                                            const d = new Date(driver.licenseExpiryDate);
                                            if (isNaN(d.getTime())) return '';
                                            return d.toISOString().split('T')[0];
                                        });
                                        setSelectedCategories(driver.licenseCategories || []);
                                        setLicenseUploads(initUploads(driver.licenseImages));
                                        setIdCardUploads(initUploads(driver.idCardImages));
                                        setIsEditing(false);
                                    }}
                                    disabled={isSavingLicense}
                                >
                                    Ləğv Et
                                </button>
                                <button
                                    type="submit"
                                    className="v-btn-primary"
                                    disabled={isSavingLicense || isUploadingAny}
                                >
                                    {isSavingLicense ? (
                                        <>
                                            <Loader className="animate-spin" size={16} />
                                            <span>Yadda Saxlanılır...</span>
                                        </>
                                    ) : isUploadingAny ? (
                                        <>
                                            <Loader className="animate-spin" size={16} />
                                            <span>Şəkillər Yüklənir...</span>
                                        </>
                                    ) : (
                                        <span>Yadda Saxla</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* Custom Lightbox integration */}
            {showLightbox && (
                <Lightbox
                    images={lightboxImages}
                    currentIndex={lightboxIndex}
                    onClose={() => setShowLightbox(false)}
                />
            )}
        </div>
    );
}