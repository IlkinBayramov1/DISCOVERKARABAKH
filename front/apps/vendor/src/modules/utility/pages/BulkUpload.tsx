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
import './Utility.css';

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
                // Yeni təsadüfi batchId təyin edirik
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
            
            // Tarixçəni yeniləyirik
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
        <div className="utility-container">
            <div className="utility-header">
                <div>
                    <h1>Excel ilə Borcların Yüklənməsi</h1>
                    <p>Standard şablon əsasında sakinlərə aid aylıq kommunal borcları yükləyin və təsdiqləyin.</p>
                </div>
            </div>

            {/* Notification Messages */}
            {successMessage && (
                <div className="utility-alert utility-alert-info">
                    <CheckCircle className="utility-alert-icon" size={20} />
                    <div className="utility-alert-content">
                        <h4>Uğurlu Əməliyyat</h4>
                        <p>{successMessage}</p>
                    </div>
                </div>
            )}

            {errorMessage && (
                <div className="utility-alert utility-alert-danger">
                    <XCircle className="utility-alert-icon" size={20} />
                    <div className="utility-alert-content">
                        <h4>Xəta baş verdi</h4>
                        <p>{errorMessage}</p>
                    </div>
                </div>
            )}

            {/* Excel Upload Area */}
            {previewData.length === 0 && validationErrors.length === 0 && (
                <div 
                    className={`utility-drag-drop-area ${dragActive ? 'drag-over' : ''}`}
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
                    <Upload className="utility-upload-icon mx-auto" size={48} />
                    {uploading ? (
                        <p>Excel oxunur və validasiya edilir...</p>
                    ) : (
                        <>
                            <p><strong>Excel faylını sürüşdürərək bura buraxın</strong> və ya seçmək üçün klikləyin</p>
                            <span>Dəstəklənən formatlar: .xlsx, .xls, .csv (Maksimum 10MB)</span>
                        </>
                    )}
                </div>
            )}

            {/* Validation Errors Panel */}
            {validationErrors.length > 0 && (
                <div className="utility-panel" style={{ marginBottom: '25px' }}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-red-500 flex items-center gap-2" style={{ margin: 0 }}>
                            <AlertTriangle size={20} />
                            Faylda Xətalar Aşkar Edildi ({validationErrors.length} ədəd)
                        </h3>
                        <button className="utility-btn utility-btn-secondary" onClick={handleCancel}>Yeni Fayl Yüklə</button>
                    </div>
                    <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '15px' }}>
                        Excel faylında aşağıdakı uyğunsuzluqlar var. Zəhmət olmasa xətaları düzəldib yenidən yükləyin:
                    </p>
                    <ul className="utility-validation-list" style={{ color: '#f87171' }}>
                        {validationErrors.map((err, i) => (
                            <li key={i}>
                                <strong>Sətir {err.row}:</strong> {err.error}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Preview Table Panel */}
            {previewData.length > 0 && (
                <div className="utility-panel" style={{ marginBottom: '25px' }}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 style={{ margin: 0 }}>
                            <FileText size={20} className="text-sky-400" />
                            Borcların Önbaxış Cədvəli ({previewData.length} Sətir)
                        </h3>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                                className="utility-btn utility-btn-success" 
                                onClick={handleConfirm}
                                disabled={confirming}
                            >
                                {confirming ? 'Təsdiqlənir...' : 'TƏSDİQLƏ VƏ BAZAYA YAZ'}
                            </button>
                            <button 
                                className="utility-btn utility-btn-secondary" 
                                onClick={handleCancel}
                                disabled={confirming}
                            >
                                LƏĞV ET
                            </button>
                        </div>
                    </div>

                    <div className="utility-table-wrapper" style={{ maxHeight: '350px' }}>
                        <table className="utility-table">
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
                                        <td style={{ fontWeight: 600, color: '#38bdf8' }}>{row.abonentCode}</td>
                                        <td>{row.residentName}</td>
                                        <td style={{ fontWeight: 700, color: '#10b981' }}>{row.amount} AZN</td>
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
            <div className="utility-panel">
                <h3>
                    <Clock size={18} className="text-slate-400" />
                    Yükləmə Tarixçəsi və Geri Qaytarma (Rollback)
                </h3>

                {loadingHistory ? (
                    <div style={{ padding: '20px 0' }}>
                        <div className="utility-skeleton utility-skeleton-text" style={{ width: '100%', height: '30px', marginBottom: '10px' }}></div>
                        <div className="utility-skeleton utility-skeleton-text" style={{ width: '100%', height: '30px' }}></div>
                    </div>
                ) : history.length === 0 ? (
                    <p style={{ color: '#64748b', textAlign: 'center', padding: '20px 0', fontSize: '14px' }}>Hələ ki heç bir Excel faylı yüklənilməyib.</p>
                ) : (
                    <div className="utility-table-wrapper">
                        <table className="utility-table">
                            <thead>
                                <tr>
                                    <th>Yüklənmə Tarixi</th>
                                    <th>Faylın Adı</th>
                                    <th>Sətir Sayı</th>
                                    <th>Batch ID</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Əməliyyat</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((log) => (
                                    <tr key={log.id}>
                                        <td>{new Date(log.createdAt).toLocaleString('az-AZ')}</td>
                                        <td style={{ fontWeight: 600 }}>{log.fileName}</td>
                                        <td>{log.rowCount} sətir</td>
                                        <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{log.batchId}</td>
                                        <td>
                                            {log.isRolledBack ? (
                                                <span className="utility-badge utility-badge-unpaid">Geri Qaytarılıb</span>
                                            ) : (
                                                <span className="utility-badge utility-badge-paid">Aktiv</span>
                                            )}
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            {!log.isRolledBack && (
                                                <button 
                                                    className="utility-btn utility-btn-danger"
                                                    style={{ padding: '6px 12px', fontSize: '12px' }}
                                                    onClick={() => handleRollback(log.batchId)}
                                                    disabled={actioningBatchId === log.batchId}
                                                >
                                                    <RefreshCcw size={13} className={actioningBatchId === log.batchId ? 'animate-spin' : ''} />
                                                    {actioningBatchId === log.batchId ? 'Geri Alınır...' : 'Geri Al (Rollback)'}
                                                </button>
                                            )}
                                            {log.isRolledBack && (
                                                <span style={{ fontSize: '11px', color: '#64748b' }}>
                                                    {log.rolledBackAt ? new Date(log.rolledBackAt).toLocaleDateString('az-AZ') : ''} silindi
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
    );
}
