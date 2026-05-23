import React, { useEffect } from 'react';
import { Wallet, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../shared/context/AuthContext';
import './WalletPaymentBox.css';

interface WalletPaymentBoxProps {
    totalPrice: number;
    onValidationChange?: (isValid: boolean) => void;
}

export const WalletPaymentBox: React.FC<WalletPaymentBoxProps> = ({
    totalPrice,
    onValidationChange
}) => {
    const { user } = useAuth();
    const balance = (user as any)?.balance ?? 0.0;
    const isSufficient = balance >= totalPrice;

    useEffect(() => {
        if (onValidationChange) {
            onValidationChange(isSufficient);
        }
    }, [isSufficient, onValidationChange]);

    return (
        <div className="wallet-balance-box">
            <div className="wallet-info-top">
                <span className="info-lbl">
                    <Wallet size={16} /> Balans
                </span>
                <span className={`balance-val ${!isSufficient ? 'insufficient' : ''}`}>
                    {balance.toFixed(2)} ₼
                </span>
            </div>
            {!isSufficient && (
                <div className="balance-error-msg">
                    <AlertCircle size={14} />
                    <span>Kifayət qədər balans yoxdur. Zəhmət olmasa balansınızı artırın.</span>
                </div>
            )}
        </div>
    );
};
