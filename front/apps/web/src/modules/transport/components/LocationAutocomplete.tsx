import React, { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { httpClient } from '../../../shared/api/httpClient'; // Assumes shared client exists
import type { LocationData } from '../api/transport.web.api';
import './LocationAutocomplete.css';

interface LocationAutocompleteProps {
    value: LocationData;
    onChange: (location: LocationData) => void;
    placeholder?: string;
    className?: string;
}

export const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
    value,
    onChange,
    placeholder = "Ünvan axtarın...",
    className = "form-input"
}) => {
    const [query, setQuery] = useState(value.address || '');
    const [results, setResults] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const wrapperRef = useRef<HTMLDivElement>(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query && isOpen) {
                // Ensure we only search if they've typed at least 2 chars
                if (query.length >= 2) {
                    searchLocations(query);
                }
            } else if (!query) {
                setResults([]);
            }
        }, 400); // 400ms debounce

        return () => clearTimeout(timer);
    }, [query, isOpen]);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const searchLocations = async (searchTerm: string) => {
        setLoading(true);
        try {
            // Adjust to the actual route we defined: /transport/passenger/location/search?q=...
            const res = await httpClient.get<any>(`/transport/passenger/location/search?q=${encodeURIComponent(searchTerm)}`);
            // Normally httpClient returns { data } from Axios, but depending on interceptor it could be { success, data }
            const responseData = res.data;
            if (responseData && responseData.success && Array.isArray(responseData.data)) {
                setResults(responseData.data);
            } else if (Array.isArray(responseData)) {
                setResults(responseData);
            } else {
                setResults([]);
            }
        } catch (error) {
            console.error("Failed to search locations", error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = async (loc: any) => {
        setQuery(loc.name || loc.address); // Display name
        onChange({
            address: loc.name ? `${loc.name}, ${loc.address}` : loc.address,
            lat: loc.coordinates?.lat || 0,
            lng: loc.coordinates?.lng || 0
        });
        setIsOpen(false);

        // Optional: Fire background request to increment popularity
        try {
            httpClient.post(`/transport/passenger/location/${loc._id || loc.id}/select`, {});
        } catch (e) { /* Ignore background error */ }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setIsOpen(true);
        // Also update parent with plain text just in case they don't select an autocomplete suggestion
        onChange({
            ...value,
            address: e.target.value
        });

        if (!e.target.value) {
            setResults([]);
        }
    };

    return (
        <div className="location-autocomplete-wrapper" ref={wrapperRef}>
            <input
                type="text"
                className={className}
                placeholder={placeholder}
                value={query}
                onChange={handleChange}
                onFocus={() => {
                    setIsOpen(true);
                    if (query.length >= 2) searchLocations(query);
                }}
            />
            {loading && <div className="autocomplete-spinner"></div>}

            {isOpen && results.length > 0 && (
                <ul className="autocomplete-dropdown">
                    {results.map((loc) => (
                        <li key={loc._id || loc.id} onClick={() => handleSelect(loc)}>
                            <MapPin size={16} className="text-muted mr-2" />
                            <div className="autocomplete-text">
                                <strong>{loc.name}</strong>
                                <span className="text-sm text-muted block">{loc.address}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
