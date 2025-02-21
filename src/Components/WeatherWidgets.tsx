import React, { useEffect, useState } from 'react';
import './WeatherWidgets.css';

interface WeatherWidgetsProps {
    sunrise: string;
    sunset: string;
    moonPhase: string;
    windDirection: number;
    temperature: number;
}

const WeatherWidgets: React.FC<WeatherWidgetsProps> = ({
    sunrise,
    sunset,
    moonPhase,
    windDirection,
    temperature
}) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date): string => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    const formatSunTime = (timeStr: string): string => {
        const [time] = timeStr.split(' ');
        const [hours, minutes] = time.split(':');
        return `${hours}:${minutes}`;
    };

    const timeToMinutes = (timeStr: string): number => {
        const [time] = timeStr.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const getCurrentTimePosition = (): number => {
        const now = currentTime;
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const sunriseMinutes = timeToMinutes(sunrise);
        const sunsetMinutes = timeToMinutes(sunset);
        
        const dayLength = sunsetMinutes - sunriseMinutes;
        const position = ((currentMinutes - sunriseMinutes) / dayLength) * 100;
        
        return Math.max(0, Math.min(100, position));
    };

    const getMoonPhaseIcon = () => {
        const phases = {
            'New Moon': { icon: '🌑', color: '#1a1a1a', shadow: '0 0 20px rgba(255, 255, 255, 0.2)' },
            'Waxing Crescent': { icon: '🌒', color: '#2a2a2a', shadow: '0 0 20px rgba(255, 255, 255, 0.3)' },
            'First Quarter': { icon: '🌓', color: '#3a3a3a', shadow: '0 0 20px rgba(255, 255, 255, 0.4)' },
            'Waxing Gibbous': { icon: '🌔', color: '#4a4a4a', shadow: '0 0 20px rgba(255, 255, 255, 0.5)' },
            'Full Moon': { icon: '🌕', color: '#ffffff', shadow: '0 0 20px rgba(255, 255, 255, 0.8)' },
            'Waning Gibbous': { icon: '🌖', color: '#4a4a4a', shadow: '0 0 20px rgba(255, 255, 255, 0.5)' },
            'Last Quarter': { icon: '🌗', color: '#3a3a3a', shadow: '0 0 20px rgba(255, 255, 255, 0.4)' },
            'Waning Crescent': { icon: '🌘', color: '#2a2a2a', shadow: '0 0 20px rgba(255, 255, 255, 0.3)' }
        };
        return phases[moonPhase as keyof typeof phases] || phases['New Moon'];
    };

    const moonPhaseInfo = getMoonPhaseIcon();

    const roundTemperature = (temp: number): string => {
        const rounded = Math.abs(temp % 1) >= 0.5 ? 
            Math.sign(temp) * Math.ceil(Math.abs(temp)) : 
            Math.sign(temp) * Math.floor(Math.abs(temp));
        return rounded.toString();
    };

    return (
        <div className="weather-widgets">
            <div className="widget sun-clock">
                <h3>Солнечные часы</h3>
                <div className="current-time">{formatTime(currentTime)}</div>
                <div className="sun-path">
                    <div className="sun-marker" style={{ left: `${getCurrentTimePosition()}%` }} />
                    <div className="time-marks">
                        <span className="sunrise-time">{formatSunTime(sunrise)}</span>
                        <span className="sunset-time">{formatSunTime(sunset)}</span>
                    </div>
                </div>
            </div>

            <div className="widget moon-phase">
                <h3>Фаза луны</h3>
                <div className="moon-animation">
                    <div 
                        className="moon-icon" 
                        style={{ 
                            backgroundColor: moonPhaseInfo.color,
                            boxShadow: moonPhaseInfo.shadow 
                        }}
                    >
                        {moonPhaseInfo.icon}
                    </div>
                    <div className="moon-description">{moonPhase}</div>
                </div>
            </div>

            <div className="widget wind-compass">
                <h3>Направление ветра</h3>
                <div className="compass">
                    <div className="compass-arrow" style={{ transform: `rotate(${windDirection}deg)` }}></div>
                    <div className="compass-directions">
                        <span className="direction-marker north">С</span>
                        <span className="direction-marker east">В</span>
                        <span className="direction-marker south">Ю</span>
                        <span className="direction-marker west">З</span>
                    </div>
                </div>
            </div>

            <div className="widget thermometer">
                <h3>Термометр</h3>
                <div className="thermometer-container">
                    <div className="thermometer-display">
                        <div 
                            className="temperature-indicator" 
                            style={{ 
                                height: `${((temperature + 20) / 40) * 100}%`,
                                opacity: temperature <= -20 ? 0 : 1
                            }}
                        />
                    </div>
                    <div className="temperature-scale">
                        <span>20°</span>
                        <span>10°</span>
                        <span>0°</span>
                        <span>-10°</span>
                        <span>-20°</span>
                    </div>
                    <div className="temperature-value">{roundTemperature(temperature)}°C</div>
                </div>
            </div>
        </div>
    );
};

export default WeatherWidgets; 