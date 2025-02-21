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

    const months = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

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

    const getWeatherForDay = (day: number): DayWeather | undefined => {
        const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        return monthData.find(data => data.date === dateStr);
    };

    const renderCalendarDays = () => {
        const days = [];
        const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

        // Добавляем заголовки дней недели
        days.push(
            <div key="weekdays" className="weekdays">
                {daysOfWeek.map(day => (
                    <div key={day} className="weekday">{day}</div>
                ))}
            </div>
        );

        // Добавляем пустые ячейки в начале месяца
        const firstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
        const cells = [];
        for (let i = 0; i < firstDay; i++) {
            cells.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        // Добавляем дни месяца
        for (let day = 1; day <= daysInMonth; day++) {
            const weatherData = getWeatherForDay(day);
            const isToday = day === currentDate.getDate() && 
                           currentMonth === currentDate.getMonth() && 
                           currentYear === currentDate.getFullYear();

            cells.push(
                <div 
                    key={day}
                    className={`calendar-day ${isToday ? 'today' : ''}`}
                    onClick={() => weatherData && onDayClick(weatherData.date)}
                >
                    <div className="day-number">{day}</div>
                    {weatherData && (
                        <div className="day-weather">
                            <div className="weather-icon">{weatherData.icon}</div>
                            <div className="temperature">{weatherData.temperature}°C</div>
                            <div className="description">{weatherData.description}</div>
                        </div>
                    )}
                </div>
            );
        }

        days.push(
            <div key="days" className="calendar-days">
                {cells}
            </div>
        );

        return days;
    };

    return (
        <div className="weather-calendar">
            <div className="calendar-header">
                <button onClick={prevMonth}>&lt;</button>
                <h2>{months[currentMonth]} {currentYear}</h2>
                <button onClick={nextMonth}>&gt;</button>
            </div>
            <div className="calendar-grid">
                {renderCalendarDays()}
            </div>
        </div>
    );
};

export default WeatherCalendar; 