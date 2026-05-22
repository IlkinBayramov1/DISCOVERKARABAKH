import React, { useState, useEffect, useRef } from 'react';
import { 
    Upload, 
    FileText, 
    CheckCircle, 
    XCircle, 
    AlertTriangle, 
    Clock, 
    RefreshCcw 
} from 'lucide-react';
import { utilityApi, type UtilityBillPreview, type UploadLogItem } from '../api/utility.api';
import './BulkUpload.css'; // Yeni CSS faylını bura bağlayırıq

export default function BulkUpload() {
    const [uploading, setUploading] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Excel Validasiya Preview
    const [previewData, setPreviewData] = useState<UtilityBillPreview[]>([]);
    const [previewBatchId, setPreviewBatchId] = useState<string | null>(null);
    const [previewFileName, setPreviewFileName] = useState<string>('');
    const [validationErrors, setValidationErrors] = useState<Array<{ row: number; error: string }>>([]);

    // Yükləmə Tarixçəsi
    const [history, setHistory] = useState<UploadLogItem[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [actioningBatchId, setActioningBatchId] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            setLoadingHistory(true);
            const response = await utilityApi.getUploadLogs();
            setHistory(response.data);
        } catch (err: any) {
            console.error('Yükləmə tarixçəsi gətirilərkən xəta:', err);
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const processFile = async (selectedFile: File) => {
        const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();
        if (fileExt !== 'xlsx' && fileExt !== 'xls' && fileExt !== 'csv') {
            setErrorMessage('Yalnız Excel (.xlsx, .xls) və ya CSV faylları dəstəklənir.');
            return;
        }

        setErrorMessage(null);
        setSuccessMessage(null);
        setPreviewData([]);
        setValidationErrors([]);

        try {
            setUploading(true);
            const res = await utilityApi.uploadExcel(selectedFile);
            
            if (res.data.success && res.data.preview) {
                setPreviewData(res.data.preview);
                setPreviewFileName(selectedFile.name);
                setPreviewBatchId(`BATCH-${Math.random().toString(36).substring(2, 11).toUpperCase()}`);
            } else if (res.data.errors) {
                setValidationErrors(res.data.errors);
            }
        } catch (err: any) {
            setErrorMessage(err.message || 'Excel faylının yüklənməsində xəta baş verdi.');
        } finally {
            setUploading(false);
        }
    };

    const handleConfirm = async () => {
        if (!previewBatchId || previewData.length === 0) return;

        try {
            setConfirming(true);
            setErrorMessage(null);
            await utilityApi.confirmUpload(previewBatchId, previewData, previewFileName);
            
            setSuccessMessage(`Təbriklər! ${previewData.length} ədəd borc məlumatı uğurla təsdiqləndi.`);
            setPreviewData([]);
            setPreviewBatchId(null);

            if (fileInputRef.current) fileInputRef.current.value = '';
            fetchHistory();
        } catch (err: any) {
            setErrorMessage(err.message || 'Borclar təsdiqlənərkən xəta baş verdi.');
        } finally {
            setConfirming(false);
        }
    };

    const handleCancel = () => {
        setPreviewData([]);
        setPreviewBatchId(null);
        setValidationErrors([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleRollback = async (batchId: string) => {
        const confirmCheck = window.confirm(
            'Diqqət! Bu paketi geri qaytarmaqla ona aid olan bütün ödənilməmiş borcları bazadan siləcəksiniz. Bu əməliyyat geri alına bilməz. Davam etmək istəyirsiniz?'
        );
        if (!confirmCheck) return;

        try {
            setActioningBatchId(batchId);
            setErrorMessage(null);
            setSuccessMessage(null);
            await utilityApi.rollbackUpload(batchId);
            setSuccessMessage('Yüklənilmiş borc paketi uğurla geri qaytarıldı (Rollback edildi).');
            fetchHistory();
        } catch (err: any) {
            setErrorMessage(err.message || 'Geri qaytarılma zamanı xəta baş verdi. Bəzi borclar artıq ödənilmiş ola bilər.');
        } finally {
            setActioningBatchId(null);
        }
    };

    return (
        <div className="dk-bu-wrapper">
            <div className="dk-util-container">
                
                {/* Header */}
                <header className="dk-util-header">
                    <h1 className="dk-util-title">Excel ilə Borcların Yüklənməsi</h1>
                    <p className="dk-util-subtitle">Standard şablon əsasında sakinlərə aid aylıq kommunal borcları yükləyin və təsdiqləyin.</p>
                </header>

                {/* Notifications */}
                {successMessage && (
                    <div className="dk-util-alert success">
                        <CheckCircle className="alert-icon" size={24} />
                        <div className="alert-content">
                            <h4>Uğurlu Əməliyyat</h4>
                            <p>{successMessage}</p>
                        </div>
                    </div>
                )}

                {errorMessage && (
                    <div className="dk-util-alert danger">
                        <XCircle className="alert-icon" size={24} />
                        <div className="alert-content">
                            <h4>Xəta baş verdi</h4>
                            <p>{errorMessage}</p>
                        </div>
                    </div>
                )}

                {/* Excel Upload Area */}
                {previewData.length === 0 && validationErrors.length === 0 && (
                    <div className="dk-util-card">
                        <div 
                            className={`dk-drag-drop-area ${dragActive ? 'active' : ''}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                style={{ display: 'none' }} 
                                accept=".xlsx, .xls, .csv" 
                                onChange={handleFileChange}
                            />
                            <Upload className="upload-icon" size={48} />
                            {uploading ? (
                                <p style={{ color: '#0ea5e9' }}>Excel oxunur və validasiya edilir...</p>
                            ) : (
                                <>
                                    <p><strong>Excel faylını sürüşdürərək bura buraxın</strong> və ya seçmək üçün klikləyin</p>
                                    <span>Dəstəklənən formatlar: .xlsx, .xls, .csv (Maksimum 10MB)</span>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Validation Errors Panel */}
                {validationErrors.length > 0 && (
                    <div className="dk-util-card">
                        <div className="card-header">
                            <h3 className="card-title" style={{ color: '#ef4444' }}>
                                <AlertTriangle size={20} />
                                Faylda Xətalar Aşkar Edildi ({validationErrors.length} ədəd)
                            </h3>
                            <button className="dk-btn dk-btn-secondary" onClick={handleCancel}>Yeni Fayl Yüklə</button>
                        </div>
                        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
                            Excel faylında aşağıdakı uyğunsuzluqlar var. Zəhmət olmasa xətaları düzəldib yenidən yükləyin:
                        </p>
                        <ul className="validation-list">
                            {validationErrors.map((err, i) => (
                                <li key={i}>
                                    <XCircle size={16} />
                                    <span><strong>Sətir {err.row}:</strong> {err.error}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Preview Table Panel */}
                {previewData.length > 0 && (
                    <div className="dk-util-card">
                        <div className="card-header">
                            <h3 className="card-title text-sky-500">
                                <FileText size={20} />
                                Borcların Önbaxış Cədvəli ({previewData.length} Sətir)
                            </h3>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button className="dk-btn dk-btn-secondary" onClick={handleCancel} disabled={confirming}>
                                    LƏĞV ET
                                </button>
                                <button className="dk-btn dk-btn-success" onClick={handleConfirm} disabled={confirming}>
                                    {confirming ? 'Təsdiqlənir...' : 'TƏSDİQLƏ VƏ YAZ'}
                                </button>
                            </div>
                        </div>

                        <div className="dk-table-wrapper" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            <table className="dk-table">
                                <thead>
                                    <tr>
                                        <th>Abonent Kodu</th>
                                        <th>Sakin Ad Soyad</th>
                                        <th>Məbləğ</th>
                                        <th>Dövriyyə Ayı</th>
                                        <th>Son Ödəniş Tarixi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {previewData.map((row, idx) => (
                                        <tr key={idx}>
                                            <td style={{ fontWeight: 800, color: '#0ea5e9' }}>{row.abonentCode}</td>
                                            <td>{row.residentName}</td>
                                            <td style={{ fontWeight: 800, color: '#10b981' }}>{row.amount} AZN</td>
                                            <td>{row.billingMonth}</td>
                                            <td>{new Date(row.dueDate).toLocaleDateString('az-AZ')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Upload History Section */}
                <div className="dk-util-card">
                    <div className="card-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                        <h3 className="card-title">
                            <Clock size={20} className="text-slate-400" />
                            Yükləmə Tarixçəsi və Geri Qaytarma (Rollback)
                        </h3>
                    </div>

                    {loadingHistory ? (
                        <p style={{ color: '#94a3b8', marginTop: '20px' }}>Tarixçə yüklənir...</p>
                    ) : history.length === 0 ? (
                        <p style={{ color: '#64748b', textAlign: 'center', padding: '40px 0', background: '#f8fafc', borderRadius: '12px', marginTop: '20px' }}>
                            Hələ ki heç bir Excel faylı yüklənilməyib.
                        </p>
                    ) : (
                        <div className="dk-table-wrapper" style={{ marginTop: '24px' }}>
                            <table className="dk-table">
                                <thead>
                                    <tr>
                                        <th>Yüklənmə Tarixi</th>
                                        <th>Faylın Adı</th>
                                        <th>Məlumat</th>
                                        <th>Status</th>
                                        <th style={{ textAlign: 'right' }}>Əməliyyat</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((log) => (
                                        <tr key={log.id}>
                                            <td>{new Date(log.createdAt).toLocaleString('az-AZ')}</td>
                                            <td style={{ fontWeight: 700 }}>{log.fileName}</td>
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                    <span>{log.rowCount} sətir</span>
                                                    <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>{log.batchId}</span>
                                                </div>
                                            </td>
                                            <td>
                                                {log.isRolledBack ? (
                                                    <span className="dk-badge rolled-back">Geri Qaytarılıb</span>
                                                ) : (
                                                    <span className="dk-badge active">Aktiv</span>
                                                )}
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                {!log.isRolledBack && (
                                                    <button 
                                                        className="dk-btn dk-btn-danger"
                                                        onClick={() => handleRollback(log.batchId)}
                                                        disabled={actioningBatchId === log.batchId}
                                                    >
                                                        <RefreshCcw size={14} className={actioningBatchId === log.batchId ? 'animate-spin' : ''} />
                                                        {actioningBatchId === log.batchId ? 'Geri Alınır...' : 'Rollback'}
                                                    </button>
                                                )}
                                                {log.isRolledBack && (
                                                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                                                        {log.rolledBackAt ? new Date(log.rolledBackAt).toLocaleDateString('az-AZ') : ''} tarixdə silindi
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}