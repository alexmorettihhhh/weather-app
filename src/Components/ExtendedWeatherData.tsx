import React from 'react';
import './ExtendedWeatherData.css';

interface ExtendedWeatherDataProps {
    temperature: number;
    humidity: number;
    pressure: number;
    visibility: number;
    windSpeed: number;
}

const ExtendedWeatherData: React.FC<ExtendedWeatherDataProps> = ({
    temperature,
    humidity,
    pressure,
    visibility,
    windSpeed
}) => {
    // Расчет точки росы
    const calculateDewPoint = (temp: number, hum: number): number => {
        const a = 17.27;
        const b = 237.7;
        const alpha = ((a * temp) / (b + temp)) + Math.log(hum / 100);
        return (b * alpha) / (a - alpha);
    };

    // Расчет индекса комфортности
    const calculateComfortIndex = (temp: number, hum: number): string => {
        const hi = temp + 0.5555 * (6.11 * Math.exp(5417.7530 * (1/273.16 - 1/(temp + 273.15))) * hum/100 - 10);
        
        if (hi < 21) return 'Прохладно';
        if (hi < 25) return 'Комфортно';
        if (hi < 28) return 'Тепло';
        if (hi < 32) return 'Жарко';
        return 'Очень жарко';
    };

    const dewPoint = calculateDewPoint(temperature, humidity);
    const comfortIndex = calculateComfortIndex(temperature, humidity);

    // Прогноз изменения давления
    const getPressureTrend = (currentPressure: number): string => {
        if (currentPressure < 740) return 'Ожидается ухудшение погоды';
        if (currentPressure > 770) return 'Ожидается ясная погода';
        return 'Стабильная погода';
    };

    return (
        <div className="extended-weather-data">
            <div className="data-section">
                <h3>Точка росы</h3>
                <div className="data-value">{dewPoint.toFixed(1)}°C</div>
                <div className="data-description">
                    При этой температуре начнётся конденсация
                </div>
            </div>

            <div className="data-section">
                <h3>Видимость</h3>
                <div className="data-value">{visibility} км</div>
                <div className="data-description">
                    {visibility > 10 ? 'Отличная видимость' : 'Ограниченная видимость'}
                </div>
            </div>

            <div className="data-section">
                <h3>Атмосферное давление</h3>
                <div className="data-value">{pressure} мм рт. ст.</div>
                <div className="data-description">
                    {getPressureTrend(pressure)}
                </div>
            </div>

            <div className="data-section">
                <h3>Индекс комфортности</h3>
                <div className="data-value">{comfortIndex}</div>
                <div className="data-description">
                    Основано на температуре и влажности
                </div>
            </div>
        </div>
    );
};

export default ExtendedWeatherData; 