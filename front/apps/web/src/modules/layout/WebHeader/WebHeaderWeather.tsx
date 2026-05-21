import React from 'react';
import { useLocation } from 'react-router-dom';
import {
    Cloud, Sun, CloudRain, CloudLightning,
    Wind, Droplets, Eye, Gauge, MapPin
} from 'lucide-react';
import { useWeather } from '../../../shared/hooks/useWeather';
import './WebHeaderWeather.css';

export const WebHeaderWeather: React.FC = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const city = searchParams.get('city') || 'Shusha';

    const { weather, isLoading, error } = useWeather(city);

    if (isLoading) {
        return (
            <div className="dk-weather-wrapper">
                <div className="dk-weather-widget loading">
                    <div className="weather-pulse-loader"></div>
                </div>
            </div>
        );
    }

    if (!weather || error) {
        return (
            <div className="dk-weather-wrapper">
                <div className="dk-weather-widget error" title={error || 'Weather data unavailable'}>
                    <MapPin size={12} />
                    <span>{city}</span>
                </div>
            </div>
        );
    }

    const getIcon = (condition: string) => {
        const c = condition.toLowerCase();
        if (c.includes('rain')) return <CloudRain size={24} className="weather-icon rain" />;
        if (c.includes('thunder')) return <CloudLightning size={24} className="weather-icon storm" />;
        if (c.includes('cloud')) return <Cloud size={24} className="weather-icon cloud" />;
        return <Sun size={24} className="weather-icon sun" />;
    };

    return (
        <div className="dk-weather-wrapper">
            <div className="dk-weather-widget">
                <div className="weather-primary-block">
                    <div className="weather-city">
                        <MapPin size={12} strokeWidth={3} />
                        <span>{city}</span>
                    </div>
                    <div className="weather-temp-row">
                        {getIcon(weather.condition || '')}
                        <span className="temp-value">{Math.round(weather.temp)}°C</span>
                    </div>
                </div>

                <div className="weather-divider"></div>

                <div className="weather-stats-block">
                    <div className="w-stat-item" title="Wind Speed & Direction">
                        <Wind size={14} className="w-stat-icon" />
                        <span>{weather.windSpeed}m/s {weather.windDirection}</span>
                    </div>
                    <div className="w-stat-item" title="Humidity">
                        <Droplets size={14} className="w-stat-icon" />
                        <span>{weather.humidity}%</span>
                    </div>
                    <div className="w-stat-item" title="Visibility">
                        <Eye size={14} className="w-stat-icon" />
                        <span>{weather.visibility}km</span>
                    </div>
                    <div className="w-stat-item" title="Pressure">
                        <Gauge size={14} className="w-stat-icon" />
                        <span>{weather.pressure}hPa</span>
                    </div>
                </div>
            </div>
        </div>
    );
};