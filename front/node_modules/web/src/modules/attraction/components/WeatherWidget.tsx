import React from 'react';
import { useAttractionWeather } from '../hooks/useAttractionWeather';
import { Cloud, Sun, CloudRain, CloudLightning, Thermometer } from 'lucide-react';
import './WeatherWidget.css';

interface WeatherWidgetProps {
    attractionId: string;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ attractionId }) => {
    const { weather, isLoading, error } = useAttractionWeather(attractionId);

    if (isLoading) return <div className="weather-widget glass loading">Loading weather...</div>;
    if (error || !weather) return null;

    const getIcon = (condition: string) => {
        const c = condition.toLowerCase();
        if (c.includes('rain')) return <CloudRain className="weather-icon" />;
        if (c.includes('thunder')) return <CloudLightning className="weather-icon" />;
        if (c.includes('cloud')) return <Cloud className="weather-icon" />;
        return <Sun className="weather-icon" />;
    };

    return (
        <div className="weather-widget glass">
            <div className="weather-main">
                {getIcon(weather.condition || '')}
                <div className="temp-wrapper">
                    <span className="temperature">{Math.round(weather.temperature)}°C</span>
                    <span className="condition">{weather.condition}</span>
                </div>
            </div>
            <div className="weather-details">
                <div className="detail-item">
                    <Thermometer size={14} />
                    <span>Feels like {Math.round(weather.feelsLike)}°C</span>
                </div>
            </div>
        </div>
    );
};
