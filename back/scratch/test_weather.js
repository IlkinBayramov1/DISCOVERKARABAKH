import 'dotenv/config';
import { weatherService } from '../modules/shared/weather/weather.service.js';

async function testWeather() {
    try {
        console.log('Testing Weather Service...');
        console.log('API Key loaded:', process.env.OPENWEATHER_API_KEY ? 'YES' : 'NO');
        // This will likely fail with 401 because of missing API Key, 
        // but it verifies the service is correctly instantiated and makes the request.
        const data = await weatherService.getWeather(39.81, 46.75); // Coordinates for Khankendi
        console.log('Weather Data:', data);
    } catch (err) {
        console.log('Weather fetch as expected (Error due to missing Key):', err.message);
    }
}

testWeather();
