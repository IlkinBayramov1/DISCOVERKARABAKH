import redisClient from '../../../cache/redis.client.js';

class WeatherService {
    constructor() {
        this.BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
        this.CACHE_PREFIX = 'weather:';
        this.CACHE_TTL = 1800; // 30 minutes
    }

    async getWeather(lat, lng) {
        const apiKey = process.env.OPENWEATHER_API_KEY;
        if (!apiKey) throw new Error('Weather API key is missing');

        const cacheKey = `${this.CACHE_PREFIX}${lat.toFixed(2)}:${lng.toFixed(2)}`;

        // 1. Try Cache
        if (redisClient.isReady()) {
            try {
                const cached = await redisClient.get(cacheKey);
                if (cached) return JSON.parse(cached);
            } catch (err) {
                console.error('[WeatherService] Cache GET error:', err);
            }
        }

        // 2. Fetch from API
        try {
            const url = new URL(this.BASE_URL);
            url.searchParams.append('lat', lat);
            url.searchParams.append('lon', lng);
            url.searchParams.append('appid', apiKey);
            url.searchParams.append('units', 'metric');
            url.searchParams.append('lang', 'az');

            const response = await fetch(url);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch weather');
            }

            const data = await response.json();

            // Helper to convert wind degrees to direction
            const getWindDirection = (deg) => {
                const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
                const index = Math.round(deg / 45) % 8;
                return directions[index];
            };

            const weatherData = {
                temp: data.main.temp,
                feelsLike: data.main.feels_like,
                humidity: data.main.humidity,
                pressure: data.main.pressure,
                visibility: (data.visibility / 1000).toFixed(1), // Convert to km
                condition: data.weather[0].main,
                description: data.weather[0].description,
                icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
                windSpeed: data.wind.speed,
                windDeg: data.wind.deg,
                windDirection: getWindDirection(data.wind.deg),
                updatedAt: new Date()
            };

            // 3. Save to Cache
            if (redisClient.isReady()) {
                try {
                    await redisClient.setEx(cacheKey, this.CACHE_TTL, JSON.stringify(weatherData));
                } catch (err) {
                    console.error('[WeatherService] Cache SET error:', err);
                }
            }

            return weatherData;
        } catch (error) {
            console.error('[WeatherService] API fetch error:', error.message);
            throw error;
        }
    }

    async getWeatherByCity(city) {
        const apiKey = process.env.OPENWEATHER_API_KEY;
        if (!apiKey) throw new Error('Weather API key is missing');

        const cacheKey = `${this.CACHE_PREFIX}city:${city.toLowerCase().trim()}`;

        // 1. Try Cache
        if (redisClient.isReady()) {
            try {
                const cached = await redisClient.get(cacheKey);
                if (cached) return JSON.parse(cached);
            } catch (err) {
                console.error('[WeatherService] Cache GET error:', err);
            }
        }

        // 2. Fetch from API
        try {
            const url = new URL(this.BASE_URL);
            url.searchParams.append('q', city);
            url.searchParams.append('appid', apiKey);
            url.searchParams.append('units', 'metric');
            url.searchParams.append('lang', 'az');

            const response = await fetch(url);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch weather');
            }

            const data = await response.json();

            // Helper to convert wind degrees to direction
            const getWindDirection = (deg) => {
                const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
                const index = Math.round(deg / 45) % 8;
                return directions[index];
            };

            const weatherData = {
                temp: data.main.temp,
                feelsLike: data.main.feels_like,
                humidity: data.main.humidity,
                pressure: data.main.pressure,
                visibility: (data.visibility / 1000).toFixed(1), // Convert to km
                condition: data.weather[0].main,
                description: data.weather[0].description,
                icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
                windSpeed: data.wind.speed,
                windDeg: data.wind.deg,
                windDirection: getWindDirection(data.wind.deg),
                updatedAt: new Date()
            };

            // 3. Save to Cache
            if (redisClient.isReady()) {
                try {
                    await redisClient.setEx(cacheKey, this.CACHE_TTL, JSON.stringify(weatherData));
                } catch (err) {
                    console.error('[WeatherService] Cache SET error:', err);
                }
            }

            return weatherData;
        } catch (error) {
            console.error('[WeatherService] API fetch error:', error.message);
            throw error;
        }
    }
}

export const weatherService = new WeatherService();
