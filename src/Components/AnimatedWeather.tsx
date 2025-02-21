import React, { useEffect, useState, useCallback } from 'react';
import './AnimatedWeather.css';

interface AnimatedWeatherProps {
    weatherType: 'clear' | 'clouds' | 'rain' | 'snow' | 'thunderstorm';
    isDay: boolean;
    sunrise?: string;
    sunset?: string;
    temperature: number;
}

const AnimatedWeather: React.FC<AnimatedWeatherProps> = ({ 
    weatherType, 
    isDay,
    sunrise = "07:00",
    sunset = "19:00"
}) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const calculateDayProgress = useCallback(() => {
        const now = currentTime;
        const [sunriseHours, sunriseMinutes] = sunrise.split(':').map(Number);
        const [sunsetHours, sunsetMinutes] = sunset.split(':').map(Number);
        
        const sunriseTime = sunriseHours * 60 + sunriseMinutes;
        const sunsetTime = sunsetHours * 60 + sunsetMinutes;
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        
        let progress = (currentMinutes - sunriseTime) / (sunsetTime - sunriseTime);
        progress = Math.max(0, Math.min(1, progress));
        
        return progress * 180;
    }, [currentTime, sunrise, sunset]);

    return (
        <div className={`animated-weather ${weatherType} ${isDay ? 'day' : 'night'}`}>
            <div className="weather-overlay" />
            {(weatherType === 'clear' || weatherType === 'clouds') && (
                <div className="day-cycle">
                    <div 
                        className="sun-moon-path"
                        style={{ transform: `rotate(${calculateDayProgress()}deg)` }}
                    >
                        <div className={`celestial-body ${isDay ? 'sun' : 'moon'}`} />
                    </div>
                    <div className="time-marks">
                        <span>{sunrise}</span>
                        <span>{sunset}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnimatedWeather; 