import React from 'react';
import './WeatherCalendar.css';

interface DayWeather {
    date: string;
    temperature: number;
    description: string;
    icon: string;
}

interface WeatherCalendarProps {
    monthData: DayWeather[];
    onDayClick: (date: string) => void;
}

const WeatherCalendar: React.FC<WeatherCalendarProps> = ({ monthData, onDayClick }) => {
    const getWeatherIcon = (description: string): string => {
        if (description.toLowerCase().includes('дождь')) return '🌧';
        if (description.toLowerCase().includes('снег')) return '❄';
        if (description.toLowerCase().includes('облач')) return '☁';
        if (description.toLowerCase().includes('гроз')) return '⛈';
        return '☀';
    };

    const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ru-RU', { 
            day: 'numeric',
            month: 'short'
        });
    };

    return (
        <div className="weather-calendar">
            <h2>Прогноз на месяц</h2>
            <div className="calendar-grid">
                {monthData.map((day, index) => (
                    <div 
                        key={index}
                        className="calendar-day"
                        onClick={() => onDayClick(day.date)}
                    >
                        <div className="calendar-date">{formatDate(day.date)}</div>
                        <div className="weather-icon">{getWeatherIcon(day.description)}</div>
                        <div className="temperature">{Math.round(day.temperature)}°</div>
                        <div className="description">{day.description}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeatherCalendar; 