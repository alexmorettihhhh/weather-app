import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Weather.css';
import weatherLogo from '../assets/image.png';
import Daylight from './Daylight';
import TemperatureChart from './TemperatureChart';
import WeatherRecommendations from './WeatherRecommendations';
import ExtendedWeatherData from './ExtendedWeatherData';
import WeatherWidgets from './WeatherWidgets';
import WeatherCalendar from './WeatherCalendar';

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
}

interface DayWeather {
    date: string;
    temperature: number;
    description: string;
    icon: string;
}

const roundTemperature = (temp: number): string => {
    const rounded = Math.abs(temp % 1) >= 0.5 ? 
        Math.sign(temp) * Math.ceil(Math.abs(temp)) : 
        Math.sign(temp) * Math.floor(Math.abs(temp));
    return rounded.toString();
};

const validateSearchTerm = (term: string): boolean => {
    const searchRegex = /^[a-zA-Zа-яА-Я0-9\s,.-]+$/;
    return searchRegex.test(term) && term.length < 100;
};

const sanitizeString = (str: string): string => {
    return str.replace(/[<>]/g, '');
};

const Weather: React.FC = () => {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [city, setCity] = useState<string>('Москва');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isCelsius, setIsCelsius] = useState(true);
    const [monthData, setMonthData] = useState<DayWeather[]>([]);

    const fetchWeather = async (city: string) => {
        try {
            if (!validateSearchTerm(city)) {
                setError('Некорректное название города');
                return;
            }

            setIsLoading(true);
            setError(null);

            const sanitizedCity = encodeURIComponent(sanitizeString(city));
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/weather/${sanitizedCity}`, {
                timeout: 5000,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.data && typeof response.data === 'object') {
                setWeatherData(response.data);
            } else {
                throw new Error('Некорректные данные от сервера');
            }
        } catch (error: any) {
            console.error('Error fetching weather data:', error);
            
            if (error.response) {
                const errorMessage = error.response.data?.error || 'Неизвестная ошибка';
                setError(errorMessage);
            } else if (error.code === 'ECONNABORTED') {
                setError('Превышено время ожидания запроса');
            } else if (error.message === 'Network Error') {
                setError('Ошибка сети. Проверьте подключение к интернету');
            } else {
                setError('Ошибка при получении данных о погоде');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCitySuggestions = async (term: string) => {
        if (term.length < 3) {
            setSuggestions([]);
            return;
        }
        try {
            const response = await axios.get(`https://api.weatherapi.com/v1/search.json?key=YOUR_API_KEY&q=${term}`);
            setSuggestions(response.data.map((city: { name: string }) => city.name));
        } catch (error) {
            console.error('Error fetching city suggestions:', error);
        }
    };

    useEffect(() => {
        fetchWeather(city);
    }, [city]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (validateSearchTerm(value)) {
            setSearchTerm(value);
            fetchCitySuggestions(value);
        }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateSearchTerm(searchTerm)) {
            setCity(searchTerm);
            setSearchTerm('');
            setSuggestions([]);
        } else {
            setError('Некорректное название города');
        }
    };

    const getLocationWeather = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                fetchWeather(`${latitude},${longitude}`);
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    const getAirQualityColor = (value: number): string => {
        if (value <= 50) return 'green';
        if (value <= 100) return 'yellow';
        if (value <= 150) return 'orange';
        if (value <= 200) return 'red';
        return 'darkred';
    };

    const toggleTemperatureUnit = () => {
        setIsCelsius(!isCelsius);
    };

    const getTemperature = (temp: string): string => {
        const numTemp = parseFloat(temp);
        if (isNaN(numTemp)) return "0";
        return isCelsius ? roundTemperature(numTemp) : roundTemperature((numTemp * 9/5) + 32);
    };

    const handleDayClick = (date: string) => {
        const dayData = monthData.find(day => day.date === date);
        if (dayData) {
            console.log('Selected day weather:', dayData);
        }
    };

    return (
        <div>
            <nav className="weather-nav">
                <div className="nav-content">
                    <div className="weather-logo">
                        <img src={weatherLogo} alt="Weather Logo" />
                    </div>
                    <div className="weather-search">
                        <form onSubmit={handleSearchSubmit}>
                            <input
                                type="text"
                                placeholder="Введите город"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                            <button type="submit">ПОИСК</button>
                        </form>
                        <button className="geolocation-button" onClick={getLocationWeather}>
                            ИСПОЛЬЗОВАТЬ ГЕОЛОКАЦИЮ
                        </button>
                        {suggestions.length > 0 && (
                            <ul className="suggestions-list">
                                {suggestions.map((suggestion, index) => (
                                    <li key={index} onClick={() => { setCity(suggestion); setSearchTerm(''); setSuggestions([]); }}>
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </nav>

            <div className="weather-app">
                {error ? (
                    <div className="error-message">{error}</div>
                ) : isLoading ? (
                    <div className="loading">Загрузка...</div>
                ) : weatherData ? (
                    <>
                        <div className="weather-content">
                            <div className="weather-main">
                                <div className="weather-current">
                                    <div className="weather-info">
                                        <span className="city-name">Погода в {city}</span>
                                        <div className="temperature-block">
                                            <span className="temperature">{getTemperature(weatherData.temperature)}°</span>
                                            <div className="weather-details">
                                                <span>Ощущается как {getTemperature(weatherData.feelsLike)}°</span>
                                                <span>{weatherData.description}</span>
                                            </div>
                                        </div>
                                        <div className="unit-toggle">
                                            <label>
                                                <input type="radio" checked={isCelsius} onChange={toggleTemperatureUnit} />
                                                °C
                                            </label>
                                            <label>
                                                <input type="radio" checked={!isCelsius} onChange={toggleTemperatureUnit} />
                                                °F
                                            </label>
                                        </div>
                                        <div className="weather-info-details">
                                            <div className="info-item">
                                                <span className="icon wind-icon"></span>
                                                <span>{weatherData.wind} км/ч</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="icon humidity-icon"></span>
                                                <span>{weatherData.humidity}%</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="icon pressure-icon"></span>
                                                <span>{weatherData.pressure} мм рт. ст.</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="weather-forecast">
                                    <h2>Прогноз на 14 дней</h2>
                                    <div className="forecast-list">
                                        {weatherData.forecast.map((day, index) => (
                                            <div key={index} className="forecast-item">
                                                <div className="forecast-day">{day.day}</div>
                                                <div className="forecast-date">{day.date}</div>
                                                <div className="forecast-temp">{getTemperature(day.temp)}°</div>
                                                <div className="forecast-condition">{day.condition}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="air-quality">
                                    <h2>Качество воздуха</h2>
                                    <div className="air-quality-grid">
                                        <div className="air-quality-item">
                                            <div>CO</div>
                                            <div style={{ color: getAirQualityColor(weatherData.airQuality.co) }}>
                                                {weatherData.airQuality.co} µg/m³
                                            </div>
                                        </div>
                                        <div className="air-quality-item">
                                            <div>NO2</div>
                                            <div style={{ color: getAirQualityColor(weatherData.airQuality.no2) }}>
                                                {weatherData.airQuality.no2} µg/m³
                                            </div>
                                        </div>
                                        <div className="air-quality-item">
                                            <div>O3</div>
                                            <div style={{ color: getAirQualityColor(weatherData.airQuality.o3) }}>
                                                {weatherData.airQuality.o3} µg/m³
                                            </div>
                                        </div>
                                        <div className="air-quality-item">
                                            <div>SO2</div>
                                            <div style={{ color: getAirQualityColor(weatherData.airQuality.so2) }}>
                                                {weatherData.airQuality.so2} µg/m³
                                            </div>
                                        </div>
                                        <div className="air-quality-item">
                                            <div>PM2.5</div>
                                            <div style={{ color: getAirQualityColor(weatherData.airQuality.pm2_5) }}>
                                                {weatherData.airQuality.pm2_5} µg/m³
                                            </div>
                                        </div>
                                        <div className="air-quality-item">
                                            <div>PM10</div>
                                            <div style={{ color: getAirQualityColor(weatherData.airQuality.pm10) }}>
                                                {weatherData.airQuality.pm10} µg/m³
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <Daylight 
                            sunrise={weatherData.sunrise}
                            sunset={weatherData.sunset}
                            daylightDuration={weatherData.daylightDuration}
                            moonPhase={weatherData.moonPhase}
                            magneticField={weatherData.magneticField}
                            uvIndex={weatherData.uvIndex}
                        />
                        
                        <div className="temperature-chart">
                            <h2>График температуры</h2>
                            <TemperatureChart 
                                temperatures={weatherData.hourlyTemperatures}
                                labels={Array.from({length: 24}, (_, i) => `${i}:00`)}
                            />
                        </div>

                        <WeatherWidgets 
                            sunrise={weatherData.sunrise}
                            sunset={weatherData.sunset}
                            moonPhase={weatherData.moonPhase}
                            windDirection={45}
                            temperature={parseFloat(weatherData.temperature)}
                        />

                        <ExtendedWeatherData 
                            temperature={parseFloat(weatherData.temperature)}
                            humidity={parseFloat(weatherData.humidity)}
                            pressure={parseFloat(weatherData.pressure)}
                            visibility={10}
                            windSpeed={parseFloat(weatherData.wind)}
                        />

                        <WeatherRecommendations 
                            temperature={parseFloat(weatherData.temperature)}
                            humidity={parseFloat(weatherData.humidity)}
                            windSpeed={parseFloat(weatherData.wind)}
                            uvIndex={weatherData.uvIndex}
                            precipitation={weatherData.precipitationChance}
                            pressure={parseFloat(weatherData.pressure)}
                        />

                        <WeatherCalendar 
                            monthData={monthData}
                            onDayClick={handleDayClick}
                        />
                    </>
                ) : null}
            </div>
        </div>
    );
};

export default Weather;
