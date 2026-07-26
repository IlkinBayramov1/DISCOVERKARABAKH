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
    const popularCacheRef = useRef<any[] | null>(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (isOpen) {
                searchLocations(query);
            }
        }, 250); // 250ms debounce

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
        const isSearchTermEmpty = !searchTerm || !searchTerm.trim();

        // Use cache if it's an empty query and cache exists
        if (isSearchTermEmpty && popularCacheRef.current !== null) {
            setResults(popularCacheRef.current);
            return;
        }

        setLoading(true);
        try {
            const res = await httpClient.get<any>(`/transport/passenger/location/search?q=${encodeURIComponent(searchTerm)}`);
            const responseData = res.data;
            let finalResults: any[] = [];
            if (responseData && responseData.success && Array.isArray(responseData.data)) {
                finalResults = responseData.data;
            } else if (Array.isArray(responseData)) {
                finalResults = responseData;
            }

            setResults(finalResults);

            // Store in cache if query is empty (representing default popular locations)
            if (isSearchTermEmpty) {
                popularCacheRef.current = finalResults;
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

        // Invalidate cache since selection increments popularity
        popularCacheRef.current = null;

        // Optional: Fire background request to increment popularity
        try {
            httpClient.post(`/transport/passenger/location/${loc._id || loc.id}/select`, {});
        } catch (e) { /* Ignore background error */ }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);
        setIsOpen(true);
        onChange({
            ...value,
            address: val
        });
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
                    searchLocations(query);
                }}
            />
            {loading && <div className="autocomplete-spinner"></div>}

            {isOpen && (
                <ul className="autocomplete-dropdown">
                    {results.length > 0 ? (
                        results.map((loc) => (
                            <li key={loc._id || loc.id} onClick={() => handleSelect(loc)}>
                                <div className="autocomplete-icon-container">
                                    <MapPin size={16} />
                                </div>
                                <div className="autocomplete-text">
                                    <strong>{loc.name}</strong>
                                    <span className="text-sm text-muted block">{loc.address}</span>
                                </div>
                            </li>
                        ))
                    ) : (
                        query.trim().length > 0 && !loading && (
                            <li className="autocomplete-no-results">
                                No locations found
                            </li>
                        )
                    )}
                </ul>
            )}
        </div>
    );
};
