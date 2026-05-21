import React, { useState, useEffect } from 'react';

interface BookingTimerProps {
    expiresAt: Date | string;
    onExpire?: () => void;
}

export const BookingTimer: React.FC<BookingTimerProps> = ({ expiresAt, onExpire }) => {
    const [timeLeft, setTimeLeft] = useState<string>('');

    useEffect(() => {
        // TODO: Implement countdown logic based on expiresAt
        setTimeLeft('14:59'); 
    }, [expiresAt]);

    return (
        <div className="booking-timer-badge">
            <span>⏱ Time left to book: {timeLeft}</span>
        </div>
    );
};
