import { useState, useEffect, useCallback } from 'react';
import { profileApi } from '../api/profile.api';
import type { IUserProfile } from '../types/profile.types';

export const useProfile = () => {
    const [profile, setProfile] = useState<IUserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState<boolean>(false);

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await profileApi.getProfile();
            if (response.success) {
                setProfile(response.data);
            } else {
                setError(response.message || 'Failed to load profile');
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateProfile = async (data: Partial<IUserProfile>) => {
        setUpdating(true);
        setError(null);
        try {
            const response = await profileApi.updateProfile(data);
            if (response.success) {
                setProfile(response.data);
                return { success: true };
            } else {
                setError(response.message || 'Failed to update profile');
                return { success: false, message: response.message };
            }
        } catch (err: any) {
            const msg = err.message || 'Failed to update profile';
            setError(msg);
            return { success: false, message: msg };
        } finally {
            setUpdating(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return {
        profile,
        loading,
        error,
        updating,
        refreshProfile: fetchProfile,
        updateProfile
    };
};
