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

    const { weather, isLoading } = useWeather(city);

    if (isLoading) return <div className="header-weather loading">...</div>;
    if (!weather) return null;

    const getIcon = (condition: string) => {
        const c = condition.toLowerCase();
        if (c.includes('rain')) return <CloudRain size={20} />;
        if (c.includes('thunder')) return <CloudLightning size={20} />;
        if (c.includes('cloud')) return <Cloud size={20} />;
        return <Sun size={20} />;
    };

    return (
        <div className="header-weather">
            <div className="weather-summary">
                <div className="city-info">
                    <MapPin size={14} />
                    <span>{city}</span>
                </div>
                <div className="temp-info">
                    {getIcon(weather.condition || '')}
                    <span className="temp">{Math.round(weather.temp)}°C</span>
                </div>
            </div>

            <div className="weather-stats">
                <div className="stat-item" title="Wind">
                    <Wind size={14} />
                    <span>{weather.windSpeed}m/s {weather.windDirection}</span>
                </div>
                <div className="stat-item" title="Humidity">
                    <Droplets size={14} />
                    <span>{weather.humidity}%</span>
                </div>
                <div className="stat-item" title="Visibility">
                    <Eye size={14} />
                    <span>{weather.visibility}km</span>
                </div>
                <div className="stat-item" title="Pressure">
                    <Gauge size={14} />
                    <span>{weather.pressure}hPa</span>
                </div>
            </div>
        </div>
    );
};
