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
        try {
            const [day, month, year] = dateStr.split('.');
            if (!day || !month || !year) {
                throw new Error('Invalid date format');
            }
            const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            if (isNaN(date.getTime())) {
                throw new Error('Invalid date');
            }
            return date.toLocaleDateString('ru-RU', { 
                day: 'numeric',
                month: 'short'
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid Date';
        }
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