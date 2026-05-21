import React from 'react';
import type { IBookingItem } from '../../types';

interface GuestFormProps {
    onChange: (guestData: Partial<IBookingItem>) => void;
}

export const GuestForm: React.FC<GuestFormProps> = ({ onChange }) => {
    return (
        <div className="guest-form-container">
            {/* TODO: Build form inputs for First Name, Last Name, Email, Phone */}
            <h3>Guest Details</h3>
        </div>
    );
};
