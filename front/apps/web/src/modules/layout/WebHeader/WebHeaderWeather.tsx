import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Cloud, Sun, CloudRain, CloudLightning,
    Wind, Droplets, Eye, Gauge, MapPin, ChevronDown, Check
} from 'lucide-react';
import { useWeather } from '../../../shared/hooks/useWeather';
import './WebHeaderWeather.css';

const KARABAKH_CITIES = [
    { id: 'Shusha', name: 'Şuşa' },
    { id: 'Lachin', name: 'Laçın' },
    { id: 'Kalbajar', name: 'Kəlbəcər' },
    { id: 'Khankendi', name: 'Xankəndi' },
    { id: 'Aghdam', name: 'Ağdam' },
    { id: 'Zangilan', name: 'Zəngilan' },
    { id: 'Fuzuli', name: 'Füzuli' },
    { id: 'Jabrayil', name: 'Cəbrayıl' },
    { id: 'Gubadly', name: 'Qubadlı' }
];

export const WebHeaderWeather: React.FC = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const queryCity = searchParams.get('city');

    const [selectedCity, setSelectedCity] = useState<string>(() => {
        return queryCity || localStorage.getItem('dk_selected_city') || 'Shusha';
    });

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (queryCity) {
            setSelectedCity(queryCity);
            localStorage.setItem('dk_selected_city', queryCity);
        }
    }, [queryCity]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const { weather, isLoading, error } = useWeather(selectedCity);

    const handleSelectCity = (cityId: string) => {
        setSelectedCity(cityId);
        localStorage.setItem('dk_selected_city', cityId);
        setDropdownOpen(false);
    };

    const getIcon = (condition: string) => {
        const c = condition.toLowerCase();
        if (c.includes('rain')) return <CloudRain size={24} className="weather-icon rain" />;
        if (c.includes('thunder')) return <CloudLightning size={24} className="weather-icon storm" />;
        if (c.includes('cloud')) return <Cloud size={24} className="weather-icon cloud" />;
        return <Sun size={24} className="weather-icon sun" />;
    };

    const currentCityObj = KARABAKH_CITIES.find(
        c => c.id.toLowerCase() === selectedCity.toLowerCase()
    ) || { id: selectedCity, name: selectedCity };

    return (
        <div className="dk-weather-wrapper" ref={dropdownRef}>
            <div 
                className={`dk-weather-widget clickable ${dropdownOpen ? 'active' : ''}`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                title="Şəhəri dəyişmək üçün klikləyin"
            >
                <div className="weather-primary-block">
                    <div className="weather-city">
                        <MapPin size={12} strokeWidth={3} />
                        <span>{currentCityObj.name}</span>
                        <ChevronDown size={12} className={`city-arrow ${dropdownOpen ? 'open' : ''}`} />
                    </div>
                    <div className="weather-temp-row">
                        {weather ? getIcon(weather.condition || '') : <Sun size={24} className="weather-icon sun" />}
                        <span className="temp-value">
                            {isLoading ? '...' : weather ? `${Math.round(weather.temp)}°C` : '--'}
                        </span>
                    </div>
                </div>

                <div className="weather-divider"></div>

                {weather && !isLoading && (
                    <div className="weather-stats-block">
                        <div className="w-stat-item" title="Küləyin sürəti və istiqaməti">
                            <Wind size={14} className="w-stat-icon" />
                            <span>{weather.windSpeed}m/s {weather.windDirection}</span>
                        </div>
                        <div className="w-stat-item" title="Rütubət">
                            <Droplets size={14} className="w-stat-icon" />
                            <span>{weather.humidity}%</span>
                        </div>
                        <div className="w-stat-item" title="Görünüş">
                            <Eye size={14} className="w-stat-icon" />
                            <span>{weather.visibility}km</span>
                        </div>
                        <div className="w-stat-item" title="Təzyiq">
                            <Gauge size={14} className="w-stat-icon" />
                            <span>{weather.pressure}hPa</span>
                        </div>
                    </div>
                )}
            </div>

            {/* CITY DROPDOWN MENU */}
            {dropdownOpen && (
                <div className="dk-weather-dropdown">
                    <div className="dropdown-header">Qarabağ Şəhərləri</div>
                    {KARABAKH_CITIES.map((c) => (
                        <div
                            key={c.id}
                            className={`dropdown-city-item ${selectedCity.toLowerCase() === c.id.toLowerCase() ? 'selected' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSelectCity(c.id);
                            }}
                        >
                            <span>{c.name}</span>
                            {selectedCity.toLowerCase() === c.id.toLowerCase() && (
                                <Check size={14} className="check-icon" />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};