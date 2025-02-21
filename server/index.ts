import express, { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import sanitize from 'sanitize-html';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


dotenv.config({ path: resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;


app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));


app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL 
        : ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
    methods: ['GET', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.options('*', cors());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Слишком много запросов, попробуйте позже' },
    standardHeaders: true,
    legacyHeaders: false
});

app.use('/weather', limiter);


const validateCity = (city: string): boolean => {
    const cityRegex = /^[a-zA-Zа-яА-ЯёЁ0-9\s,.-]+$/u;
    return cityRegex.test(city) && city.length < 100;
};

interface Forecast {
    day: string;
    temp: string;
    date: string;
    condition: string;
}

interface AirQuality {
    co: number;
    no2: number;
    o3: number;
    so2: number;
    pm2_5: number;
    pm10: number;
}

interface WeatherData {
    temperature: string;
    description: string;
    feelsLike: string;
    wind: string;
    humidity: string;
    pressure: string;
    forecast: Forecast[];
    airQuality: AirQuality;
    uvIndex: number;
    maxUvTime: string;
    moonPhase: string;
    moonInfluence: string;
    magneticField: string;
    precipitationChance: number;
    hourlyTemperatures: number[];
    sunrise: string;
    sunset: string;
    daylightDuration: string;
    monthData: {
        date: string;
        temperature: number;
        description: string;
        icon: string;
    }[];
}

type MoonPhase = 'New Moon' | 'Waxing Crescent' | 'First Quarter' | 'Waxing Gibbous' | 
                 'Full Moon' | 'Waning Gibbous' | 'Last Quarter' | 'Waning Crescent';

interface MoonInfluences {
    'New Moon': string;
    'Waxing Crescent': string;
    'First Quarter': string;
    'Waxing Gibbous': string;
    'Full Moon': string;
    'Waning Gibbous': string;
    'Last Quarter': string;
    'Waning Crescent': string;
}


const getWeather = async (req: Request<{ city: string }>, res: Response): Promise<void> => {
    try {
        const city = decodeURIComponent(req.params.city).trim();
        console.log(`Получен запрос погоды для города: ${city}`);
        
        if (!city || !validateCity(city)) {
            console.log('Некорректное название города:', city);
            res.status(400).json({ 
                error: 'Некорректное название города' 
            });
            return;
        }

        const apiKey = process.env.WEATHER_API_KEY;
        if (!apiKey) {
            console.error('API key не настроен');
            res.status(500).json({ 
                error: 'Ошибка конфигурации сервера' 
            });
            return;
        }

        console.log('Отправка запроса к API погоды...');
        const apiUrl = 'https://api.weatherapi.com/v1/forecast.json';
        const params = {
            key: apiKey,
            q: city,
            days: 14,
            aqi: 'yes',
            lang: 'ru'
        };
        
        console.log(`Запрос к API: ${apiUrl}`);
        console.log('Параметры запроса:', { ...params, key: '***' });

        const response = await axios.get(apiUrl, {
            params,
            timeout: 10000,
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Weather App/1.0',
                'Accept-Language': 'ru'
            }
        });

        console.log('Получен ответ от API, статус:', response.status);
        const data = response.data;

        if (!data) {
            console.error('Пустой ответ от API');
            throw new Error('Empty API response');
        }

        if (!data.current) {
            console.error('Отсутствуют текущие данные в ответе API');
            throw new Error('No current weather data in API response');
        }

        if (!data.forecast?.forecastday?.[0]) {
            console.error('Отсутствует прогноз в ответе API');
            throw new Error('No forecast data in API response');
        }

        console.log('Данные успешно получены, обработка...');
        const hourlyTemperatures = data.forecast.forecastday[0].hour.map(
            (hour: { temp_c: number }) => hour.temp_c
        );

        const sunrise = data.forecast.forecastday[0].astro.sunrise;
        const sunset = data.forecast.forecastday[0].astro.sunset;
        
        const getMinutes = (timeStr: string): number => {
            const [time, period] = timeStr.split(' ');
            const [hours, minutes] = time.split(':').map(Number);
            let totalMinutes = hours * 60 + minutes;
            if (period === 'PM' && hours !== 12) totalMinutes += 12 * 60;
            if (period === 'AM' && hours === 12) totalMinutes -= 12 * 60;
            return totalMinutes;
        };

        const sunriseMinutes = getMinutes(sunrise);
        const sunsetMinutes = getMinutes(sunset);
        let daylightMinutes = sunsetMinutes - sunriseMinutes;
        if (daylightMinutes < 0) daylightMinutes += 24 * 60;
        
        const daylightDuration = `${Math.floor(daylightMinutes / 60)} ч ${daylightMinutes % 60} мин`;

        const sanitizeText = (text: string): string => sanitize(text, {
            allowedTags: [],
            allowedAttributes: {}
        });

        // Получаем данные о погоде на месяц
        const monthData = data.forecast.forecastday.map((day: any) => ({
            date: day.date,
            temperature: day.day.avgtemp_c,
            description: sanitizeText(day.day.condition.text),
            icon: day.day.condition.icon
        }));

        const weatherResponse: WeatherData = {
            temperature: data.current.temp_c.toString(),
            description: sanitizeText(data.current.condition.text),
            feelsLike: data.current.feelslike_c.toString(),
            wind: data.current.wind_kph.toString(),
            humidity: data.current.humidity.toString(),
            pressure: data.current.pressure_mb.toString(),
            forecast: data.forecast.forecastday.map((day: any) => ({
                day: sanitizeText(new Date(day.date).toLocaleDateString('ru-RU', { weekday: 'long' })),
                temp: `${day.day.maxtemp_c}°C`,
                date: sanitizeText(new Date(day.date).toLocaleDateString('ru-RU')),
                condition: sanitizeText(day.day.condition.text)
            })),
            airQuality: {
                co: Number(data.current.air_quality.co.toFixed(2)),
                no2: Number(data.current.air_quality.no2.toFixed(2)),
                o3: Number(data.current.air_quality.o3.toFixed(2)),
                so2: Number(data.current.air_quality.so2.toFixed(2)),
                pm2_5: Number(data.current.air_quality.pm2_5.toFixed(2)),
                pm10: Number(data.current.air_quality.pm10.toFixed(2))
            },
            uvIndex: data.current.uv,
            maxUvTime: data.forecast.forecastday[0].astro.sun_hour_max,
            moonPhase: data.forecast.forecastday[0].astro.moon_phase,
            moonInfluence: getMoonInfluence(data.forecast.forecastday[0].astro.moon_phase as MoonPhase),
            magneticField: getMagneticFieldStatus(),
            precipitationChance: data.forecast.forecastday[0].day.daily_chance_of_rain,
            hourlyTemperatures,
            sunrise,
            sunset,
            daylightDuration,
            monthData
        };

        console.log('Отправка ответа клиенту');
        res.json(weatherResponse);
    } catch (error: any) {
        console.error('Ошибка при получении данных о погоде:', error);
        console.error('Детали ошибки:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            code: error.code
        });
        
        if (error.response?.status === 404) {
            res.status(404).json({ 
                error: 'Город не найден',
                details: error.response.data?.error?.message || 'Город не найден в базе данных погодного сервиса'
            });
            return;
        }
        
        if (error.code === 'ECONNABORTED') {
            res.status(408).json({
                error: 'Превышено время ожидания запроса к погодному сервису'
            });
            return;
        }

        if (error.message.includes('API response')) {
            res.status(502).json({
                error: 'Некорректный ответ от погодного сервиса',
                details: error.message
            });
            return;
        }
        
        res.status(500).json({ 
            error: 'Ошибка при получении данных о погоде',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Регистрируем маршрут
app.get('/weather/:city', getWeather);

function getMoonInfluence(moonPhase: MoonPhase): string {
    const influences: MoonInfluences = {
        'New Moon': 'Время для новых начинаний',
        'Waxing Crescent': 'Благоприятное время для роста',
        'First Quarter': 'Время действовать',
        'Waxing Gibbous': 'Время завершения проектов',
        'Full Moon': 'Пик энергии',
        'Waning Gibbous': 'Время для анализа',
        'Last Quarter': 'Время отпускать',
        'Waning Crescent': 'Время для отдыха'
    };
    return influences[moonPhase] || 'Нейтральное влияние';
}

function getMagneticFieldStatus(): string {
    return 'Спокойное';
}

// Обработка ошибок
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Ошибка сервера:', err);
    
    if (err instanceof SyntaxError) {
        res.status(400).json({ 
            error: 'Некорректный запрос' 
        });
        return;
    }
    
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ 
            error: 'Неавторизованный запрос' 
        });
        return;
    }
    
    res.status(500).json({ 
        error: 'Внутренняя ошибка сервера',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
