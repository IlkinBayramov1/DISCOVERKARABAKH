import React from 'react';
import { CheckCircle2, Download, X } from 'lucide-react';
import '../pages/Utility.css';

interface ReceiptModalProps {
    isOpen: boolean;
    onClose: () => void;
    totalAmount: number;
    transactionId: string;
    abonentName: string;
    billsCount: number;
}

export default function ReceiptModal({ isOpen, onClose, totalAmount, transactionId, abonentName, billsCount }: ReceiptModalProps) {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
        }}>
            <div style={{
                background: '#ffffff',
                width: '100%',
                maxWidth: '450px',
                borderRadius: '24px',
                padding: '40px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                position: 'relative',
                animation: 'fade-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            }}>
                <button 
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#64748b'
                    }}
                >
                    <X size={24} />
                </button>

                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'rgba(16, 185, 129, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px auto'
                    }}>
                        <CheckCircle2 size={48} color="#10b981" />
                    </div>
                    <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '0 0 5px 0' }}>Ödəniş Uğurludur!</h2>
                    <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>Borcunuz uğurla bazaya qeyd edildi.</p>
                </div>

                <div style={{
                    background: '#f8fafc',
                    border: '1px dashed #cbd5e1',
                    borderRadius: '16px',
                    padding: '20px',
                    marginBottom: '30px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                        <span style={{ color: '#64748b', fontSize: '14px' }}>Ödəyici:</span>
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>{abonentName}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                        <span style={{ color: '#64748b', fontSize: '14px' }}>Tranzaksiya ID:</span>
                        <span style={{ fontWeight: 500, fontFamily: 'monospace', color: '#0f172a' }}>{transactionId}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                        <span style={{ color: '#64748b', fontSize: '14px' }}>Ödənilən Borc Sayı:</span>
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>{billsCount} ədəd</span>
                    </div>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        paddingTop: '15px',
                        borderTop: '1px dashed #cbd5e1'
                    }}>
                        <span style={{ color: '#64748b', fontSize: '15px', fontWeight: 600 }}>Cəmi Ödənildi:</span>
                        <span style={{ fontWeight: 800, color: '#10b981', fontSize: '20px' }}>{totalAmount.toFixed(2)} AZN</span>
                    </div>
                </div>

                <button 
                    onClick={onClose}
                    className="web-btn-search" 
                    style={{ width: '100%', justifyContent: 'center', padding: '15px', fontSize: '16px' }}
                >
                    <Download size={20} />
                    Qəbzi Yüklə və Bağla
                </button>
            </div>
        </div>
    );
}
