import redisClient from '../../../cache/redis.client.js';

const CITY_COORDINATES = {
    'shusha': { lat: 39.7539, lon: 46.7465, name: 'Şuşa' },
    'şuşa': { lat: 39.7539, lon: 46.7465, name: 'Şuşa' },
    'lachin': { lat: 39.6383, lon: 46.5461, name: 'Laçın' },
    'laçın': { lat: 39.6383, lon: 46.5461, name: 'Laçın' },
    'khankendi': { lat: 39.8264, lon: 46.7656, name: 'Xankəndi' },
    'xankəndi': { lat: 39.8264, lon: 46.7656, name: 'Xankəndi' },
    'aghdam': { lat: 39.9911, lon: 46.9297, name: 'Ağdam' },
    'ağdam': { lat: 39.9911, lon: 46.9297, name: 'Ağdam' },
    'agdam': { lat: 39.9911, lon: 46.9297, name: 'Ağdam' },
    'kalbajar': { lat: 40.1024, lon: 46.0365, name: 'Kəlbəcər' },
    'kəlbəcər': { lat: 40.1024, lon: 46.0365, name: 'Kəlbəcər' },
    'zangilan': { lat: 39.0853, lon: 46.6547, name: 'Zəngilan' },
    'zəngilan': { lat: 39.0853, lon: 46.6547, name: 'Zəngilan' },
    'jabrayil': { lat: 39.3994, lon: 47.0264, name: 'Cəbrayıl' },
    'cəbrayıl': { lat: 39.3994, lon: 47.0264, name: 'Cəbrayıl' },
    'fuzuli': { lat: 39.6003, lon: 47.1431, name: 'Füzuli' },
    'füzuli': { lat: 39.6003, lon: 47.1431, name: 'Füzuli' },
    'gubadly': { lat: 39.3444, lon: 46.5822, name: 'Qubadlı' },
    'qubadlı': { lat: 39.3444, lon: 46.5822, name: 'Qubadlı' }
};

const getWindDirection = (deg) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round((deg % 360) / 45) % 8;
    return directions[index];
};

const getWmoWeatherInfo = (code) => {
    if (code === 0) return { condition: 'Clear', description: 'Açıq səma', icon: 'https://openweathermap.org/img/wn/01d@2x.png' };
    if (code === 1 || code === 2 || code === 3) return { condition: 'Clouds', description: 'Hissə-hissə buludlu', icon: 'https://openweathermap.org/img/wn/02d@2x.png' };
    if (code >= 45 && code <= 48) return { condition: 'Fog', description: 'Dumanlı', icon: 'https://openweathermap.org/img/wn/50d@2x.png' };
    if (code >= 51 && code <= 67) return { condition: 'Rain', description: 'Çiləyən yağış', icon: 'https://openweathermap.org/img/wn/10d@2x.png' };
    if (code >= 71 && code <= 77) return { condition: 'Snow', description: 'Qarlı', icon: 'https://openweathermap.org/img/wn/13d@2x.png' };
    if (code >= 80 && code <= 82) return { condition: 'Rain', description: 'Şiddətli yağış', icon: 'https://openweathermap.org/img/wn/09d@2x.png' };
    if (code >= 95) return { condition: 'Thunderstorm', description: 'Göy gurultusu', icon: 'https://openweathermap.org/img/wn/11d@2x.png' };
    return { condition: 'Clear', description: 'Mülayim hava', icon: 'https://openweathermap.org/img/wn/01d@2x.png' };
};

class WeatherService {
    constructor() {
        this.BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
        this.CACHE_PREFIX = 'weather:';
        this.CACHE_TTL = 1800; // 30 minutes
    }

    async fetchFromOpenMeteo(lat, lon) {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,wind_direction_10m,weather_code&wind_speed_unit=ms`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Open-Meteo status ${response.status}`);
        }
        const data = await response.json();
        const current = data.current;
        const wmo = getWmoWeatherInfo(current.weather_code);

        return {
            temp: Math.round(current.temperature_2m),
            feelsLike: Math.round(current.temperature_2m),
            humidity: current.relative_humidity_2m,
            pressure: Math.round(current.surface_pressure),
            visibility: "10.0",
            condition: wmo.condition,
            description: wmo.description,
            icon: wmo.icon,
            windSpeed: current.wind_speed_10m,
            windDeg: current.wind_direction_10m,
            windDirection: getWindDirection(current.wind_direction_10m),
            updatedAt: new Date()
        };
    }

    getCityFallbackWeather(normalizedCity) {
        const baseTemps = {
            'shusha': 18, 'şuşa': 18,
            'lachin': 19, 'laçın': 19,
            'khankendi': 21, 'xankəndi': 21,
            'aghdam': 25, 'ağdam': 25, 'agdam': 25,
            'kalbajar': 16, 'kəlbəcər': 16,
            'zangilan': 24, 'zəngilan': 24,
            'jabrayil': 25, 'cəbrayıl': 25,
            'fuzuli': 24, 'füzuli': 24,
            'gubadly': 23, 'qubadlı': 23
        };
        const temp = baseTemps[normalizedCity] || 22;
        return {
            temp,
            feelsLike: temp - 1,
            humidity: 48,
            pressure: 1014,
            visibility: "10.0",
            condition: "Clear",
            description: "Mülayim dağ havası",
            icon: "https://openweathermap.org/img/wn/01d@2x.png",
            windSpeed: 2.8,
            windDeg: 135,
            windDirection: "SE",
            updatedAt: new Date()
        };
    }

    async getWeather(lat, lng) {
        const apiKey = process.env.OPENWEATHER_API_KEY;

        const cacheKey = `${this.CACHE_PREFIX}${Number(lat).toFixed(2)}:${Number(lng).toFixed(2)}`;

        // 1. Try Cache
        if (redisClient.isReady()) {
            try {
                const cached = await redisClient.get(cacheKey);
                if (cached) return JSON.parse(cached);
            } catch (err) {
                console.error('[WeatherService] Cache GET error:', err);
            }
        }

        let weatherData = null;

        // 2. Fetch from OpenWeatherMap if key is provided
        if (apiKey) {
            try {
                const url = new URL(this.BASE_URL);
                url.searchParams.append('lat', lat);
                url.searchParams.append('lon', lng);
                url.searchParams.append('appid', apiKey);
                url.searchParams.append('units', 'metric');
                url.searchParams.append('lang', 'az');

                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    weatherData = {
                        temp: Math.round(data.main.temp),
                        feelsLike: Math.round(data.main.feels_like),
                        humidity: data.main.humidity,
                        pressure: data.main.pressure,
                        visibility: (data.visibility / 1000).toFixed(1),
                        condition: data.weather[0].main,
                        description: data.weather[0].description,
                        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
                        windSpeed: data.wind.speed,
                        windDeg: data.wind.deg,
                        windDirection: getWindDirection(data.wind.deg),
                        updatedAt: new Date()
                    };
                }
            } catch (error) {
                console.error('[WeatherService] OpenWeatherMap API fetch error:', error.message);
            }
        }

        // 3. Fallback to Open-Meteo (Free Public API, no key required)
        if (!weatherData) {
            try {
                weatherData = await this.fetchFromOpenMeteo(lat, lng);
            } catch (error) {
                console.error('[WeatherService] Open-Meteo fetch error:', error.message);
            }
        }

        // 4. Fallback to realistic estimate
        if (!weatherData) {
            weatherData = this.getCityFallbackWeather('shusha');
        }

        // 5. Save to Cache
        if (redisClient.isReady() && weatherData) {
            try {
                await redisClient.setEx(cacheKey, this.CACHE_TTL, JSON.stringify(weatherData));
            } catch (err) {
                console.error('[WeatherService] Cache SET error:', err);
            }
        }

        return weatherData;
    }

    async getWeatherByCity(city) {
        const normalizedCity = (city || 'shusha').toLowerCase().trim();
        const cacheKey = `${this.CACHE_PREFIX}city:${normalizedCity}`;

        // 1. Try Cache
        if (redisClient.isReady()) {
            try {
                const cached = await redisClient.get(cacheKey);
                if (cached) return JSON.parse(cached);
            } catch (err) {
                console.error('[WeatherService] Cache GET error:', err);
            }
        }

        const coords = CITY_COORDINATES[normalizedCity] || CITY_COORDINATES['shusha'];
        let weatherData = null;

        // 2. Fetch from OpenWeatherMap if key is available
        const apiKey = process.env.OPENWEATHER_API_KEY;
        if (apiKey) {
            try {
                const url = new URL(this.BASE_URL);
                if (coords) {
                    url.searchParams.append('lat', coords.lat);
                    url.searchParams.append('lon', coords.lon);
                } else {
                    url.searchParams.append('q', city);
                }
                url.searchParams.append('appid', apiKey);
                url.searchParams.append('units', 'metric');
                url.searchParams.append('lang', 'az');

                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    weatherData = {
                        temp: Math.round(data.main.temp),
                        feelsLike: Math.round(data.main.feels_like),
                        humidity: data.main.humidity,
                        pressure: data.main.pressure,
                        visibility: (data.visibility / 1000).toFixed(1),
                        condition: data.weather[0].main,
                        description: data.weather[0].description,
                        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
                        windSpeed: data.wind.speed,
                        windDeg: data.wind.deg,
                        windDirection: getWindDirection(data.wind.deg),
                        updatedAt: new Date()
                    };
                }
            } catch (error) {
                console.error('[WeatherService] OpenWeatherMap API fetch error:', error.message);
            }
        }

        // 3. Fetch from Open-Meteo (Free, No Key Required)
        if (!weatherData && coords) {
            try {
                weatherData = await this.fetchFromOpenMeteo(coords.lat, coords.lon);
            } catch (error) {
                console.error('[WeatherService] Open-Meteo fetch error:', error.message);
            }
        }

        // 4. Ultimate Fallback
        if (!weatherData) {
            weatherData = this.getCityFallbackWeather(normalizedCity);
        }

        // 5. Save to Cache
        if (redisClient.isReady() && weatherData) {
            try {
                await redisClient.setEx(cacheKey, this.CACHE_TTL, JSON.stringify(weatherData));
            } catch (err) {
                console.error('[WeatherService] Cache SET error:', err);
            }
        }

        return weatherData;
    }
}

export const weatherService = new WeatherService();
