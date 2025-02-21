import React, { useState } from 'react';
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

const WeatherCalendar: React.FC<WeatherCalendarProps> = ({
    monthData,
    onDayClick
}) => {
    const [currentDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
    const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const months = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];

    const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    const getDaysInMonth = (year: number, month: number): number => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number): number => {
        const firstDay = new Date(year, month, 1).getDay();
        return firstDay === 0 ? 6 : firstDay - 1; // Конвертируем в формат Пн-Вс
    };

    const prevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const nextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const getWeatherForDate = (date: string): DayWeather | undefined => {
        return monthData.find(data => data.date === date);
    };

    const formatDate = (year: number, month: number, day: number): string => {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    const handleDayClick = (date: string, weather?: DayWeather) => {
        setSelectedDate(date);
        if (weather) {
            onDayClick(date);
        }
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentYear, currentMonth);
        const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
        const days = [];

        // Добавляем пустые ячейки для дней до начала месяца
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(
                <div key={`empty-${i}`} className="calendar-day empty"></div>
            );
        }

        // Добавляем дни месяца
        for (let day = 1; day <= daysInMonth; day++) {
            const date = formatDate(currentYear, currentMonth, day);
            const weather = getWeatherForDate(date);
            const isToday = date === formatDate(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate()
            );
            const isSelected = date === selectedDate;

            days.push(
                <div
                    key={date}
                    className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${weather ? 'has-weather' : ''}`}
                    onClick={() => handleDayClick(date, weather)}
                >
                    <div className="day-number">{day}</div>
                    {weather && (
                        <div className="weather-info">
                            <img 
                                src={`https://openweathermap.org/img/wn/${
                                    weather.description.toLowerCase().includes('дождь') ? '10d' : 
                                    weather.description.toLowerCase().includes('облач') ? '03d' :
                                    weather.description.toLowerCase().includes('ясно') ? '01d' :
                                    weather.description.toLowerCase().includes('снег') ? '13d' : '02d'
                                }@2x.png`}
                                alt={weather.description}
                                className="weather-icon"
                            />
                            <div className="temperature">
                                {Math.round(weather.temperature)}°
                            </div>
                            <div className="description" title={weather.description}>
                                {weather.description}
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        return days;
    };

    return (
        <div className="weather-calendar">
            <div className="calendar-header">
                <button onClick={prevMonth} className="month-nav">
                    <span className="arrow">←</span>
                </button>
                <h2>{months[currentMonth]} {currentYear}</h2>
                <button onClick={nextMonth} className="month-nav">
                    <span className="arrow">→</span>
                </button>
            </div>
            <div className="weekdays">
                {daysOfWeek.map(day => (
                    <div key={day} className="weekday">{day}</div>
                ))}
            </div>
            <div className="calendar-grid">
                {renderCalendar()}
            </div>
        </div>
    );
};

export default WeatherCalendar; 